/* eslint-disable no-case-declarations */
import { includes, chunk } from 'lodash';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Extent, extend as olExtend, createEmpty as createEmptyExtent } from 'ol/extent';
import proj4 from 'proj4';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Geometry, LineString, Point, Polygon } from 'ol/geom';
import { findCustomStyleName } from '../services/getLayerName';

interface StyleOptions {
  opacity?: number;
  color?: string;
  weight?: number;
  dashArray?: string;
  fillColor?: string;
  radius?: number;
}

interface StyleFilter {
  left: { column: string };
  operation: '>=' | '<=' | '>' | '<' | '==' | '!=';
  right: number;
}

interface StyleConfig {
  type: 'LINE' | 'POINT' | 'POLYGON';
  options: StyleOptions;
  filter?: StyleFilter[];
}

export interface FeatureData {
  geometry: {
    type: 'Point' | 'Polygon' | 'LineString';
    coordinates: number[] | number[][] | [[number[]]];
  };
  style: { id: string };
}

export class CustomVectorLayer extends VectorLayer<VectorSource> {
  private _defaultStyle: Style | null = null;
  private _userStyle: Style | null = null;

  constructor(options?: any) {
    super(options);
    this._defaultStyle = this.getStyle() as Style;
  }

  public getAliasName(): string | undefined {
    return this.get('aliasName');
  }

  // Phương thức trả về tableName từ thuộc tính layer
  public getTableName(): string | undefined {
    return this.get('tableName');
  }
  public isSelectable(): boolean {
    return this.get('selectable');
  }

  /**
   * Thêm feature vào layer.
   * @param {Feature} feature - Feature cần thêm.
   */
  public async addData(features: FeatureData[]) {
    const results: Feature<Geometry>[] = [];

    for (const item of features) {
      const response = await findCustomStyleName(item.style.id);
      const style = response?.configs?.[0];
      const styleOptions = !!style ? JSON.parse(style.options) : {};
      switch (item.geometry.type) {
        case 'Point':
          const featurePoint = new Feature(
            new Point(proj4('EPSG:4326', 'EPSG:5179', item.geometry.coordinates as number[])),
          );
          featurePoint.setStyle(
            new Style({
              image: new CircleStyle({
                radius: styleOptions?.radius ?? 5,
                fill: new Fill({
                  color: styleOptions?.fillColor ?? '#FF0000', // 빨간색
                }),
                stroke: new Stroke({
                  color: styleOptions?.color ?? '#111', // 파란색
                  width: styleOptions?.width ?? 3,
                }),
              }),
            }),
          );
          results.push(featurePoint);
          break;
        case 'LineString':
          const coordsLine = item.geometry.coordinates.reduce((newCoords, item) => {
            return [...newCoords, proj4('EPSG:4326', 'EPSG:5179', item as number[])];
          }, []);
          const featureLineString = new Feature(new LineString(coordsLine));
          featureLineString.setStyle(
            new Style({
              stroke: new Stroke({
                color: styleOptions?.color ?? 'black', // 파란색
                width: styleOptions?.width ?? 4,
              }),
            }),
          );
          results.push(featureLineString);
          break;
        case 'Polygon':
          const coordsPolygon = item.geometry.coordinates.reduce((newCoords, item) => {
            return [...newCoords, proj4('EPSG:4326', 'EPSG:5179', item as number[])];
          }, []);
          const featurePolygon = new Feature(new Polygon(coordsPolygon));
          results.push(featurePolygon);
          break;
        default:
          break;
      }
    }
    console.log(this.getSource());
    this.getSource()?.addFeatures(results);
  }
  public clearLayers() {
    this.getSource()?.clear();
  }
  public refresh() {
    this.getSource()?.refresh();
  }
  public getBounds(): Extent | null {
    const source = this.getSource();
    if (!source) {
      return null;
    }
    const features = source.getFeatures();
    if (features.length === 0) {
      return null;
    }

    // Tạo một extent rỗng ban đầu
    const extent = createEmptyExtent();

    // Mở rộng extent để bao phủ tất cả các feature
    features.forEach(feature => {
      const geometry = feature.getGeometry();
      if (geometry) {
        olExtend(extent, geometry.getExtent());
      }
    });
    const [minX, minY, maxX, maxY] = extent;
    const [minLng, minLat] = proj4('EPSG:5179', 'EPSG:4326', [minX, minY]);
    const [maxLng, maxLat] = proj4('EPSG:5179', 'EPSG:4326', [maxX, maxY]);

    return [minLng, minLat, maxLng, maxLat];
  }
  public setUserLayerConfig(zoomLevel: { minZoom: number; maxZoom: number } | null) {
    if (zoomLevel !== null) {
      this?.set('minZoom', zoomLevel.minZoom);
      this?.set('maxZoom', zoomLevel.maxZoom);
    } else {
      const defaultMinZoom = this?.get('minZoom');
      const maxZoom = this?.get('maxZoom');
      this?.set('minZoom', defaultMinZoom);
      this?.set('maxZoom', maxZoom);
    }
    this.refresh();
  }
  /**
   * Thiết lập style người dùng hoặc quay lại style mặc định.
   * @param {Style | null} style - Style tùy chỉnh của người dùng hoặc null để trở về mặc định.
   */
  public setUserStyleConfig(styleConfig: StyleConfig | null) {
    if (styleConfig === null) {
      this._userStyle = null;
      this.setStyle(this._defaultStyle); // Trở về style mặc định
    } else {
      const { type, options } = styleConfig;
      this._userStyle = this._createStyle(type, options);
      this.setStyle(this._userStyle);
    }
    this.refresh(); // Làm mới layer để áp dụng style mới
  }
  public setDefaultStyle(styleConfig: StyleConfig | null) {
    if (!styleConfig) {
      this.setStyle(this._defaultStyle); // Trở về style mặc định
    } else {
      const { type, options } = styleConfig;
      this._defaultStyle = this._createStyle(type, options);
      this.setStyle(this._defaultStyle); // Thiết lập style mặc định
      // this.refresh(); // Làm mới layer để áp dụng style mặc định
    }
  }

  private _createStyle(type: 'LINE' | 'POINT' | 'POLYGON', options: StyleOptions): Style {
    const { color = '#000', weight = 1, dashArray = '0', fillColor = '#FFF', radius = 5 } = options;

    switch (type) {
      case 'LINE':
        return new Style({
          stroke: new Stroke({
            color,
            width: weight,
            lineDash: dashArray.split(',').map(Number),
          }),
        });

      case 'POINT':
        return new Style({
          image: new CircleStyle({
            radius,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color, width: weight }),
          }),
        });

      case 'POLYGON':
        return new Style({
          stroke: new Stroke({
            color,
            width: weight,
            lineDash: dashArray.split(',').map(Number),
          }),
          fill: new Fill({
            color: fillColor,
          }),
        });
      default:
        console.warn(`Style type ${type} không được hỗ trợ.`);
        return this._defaultStyle || new Style();
    }
  }

  public setThemematics(styleConfigs: StyleConfig[]) {
    // @ts-ignore
    this.setStyle(feature => {
      for (const styleConfig of styleConfigs) {
        if (!includes(['LINE', 'POINT', 'POLYGON'], styleConfig.type)) {
          continue; // Loại feature không phù hợp với styleConfig
        }

        const isMatch = styleConfig.filter?.every(condition => {
          const value = feature.get(condition.left.column);
          const compareValue = condition.right;

          switch (condition.operation) {
            case '>=':
              return value >= compareValue;
            case '<=':
              return value <= compareValue;
            case '>':
              return value > compareValue;
            case '<':
              return value < compareValue;
            case '==':
              return value === compareValue;
            case '!=':
              return value !== compareValue;
            default:
              console.warn(`Unknown operation: ${condition.operation}`);
              return false;
          }
        });

        // Nếu tất cả điều kiện thỏa mãn, áp dụng style tương ứng
        if (isMatch) {
          const styleOptions = styleConfig.options;
          return this._createStyle(styleConfig.type, styleOptions);
        }
      }

      return this._defaultStyle; // Trả về style mặc định nếu không có điều kiện nào thỏa mãn
    });
    this.refresh();
  }
}
