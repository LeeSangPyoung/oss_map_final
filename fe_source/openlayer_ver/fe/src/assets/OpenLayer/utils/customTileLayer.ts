import VectorTileLayer, { Options } from 'ol/layer/VectorTile';
import { Fill, Stroke, Style } from 'ol/style';
import { findCustomStyleName, updateConfigLayer } from '../services/getLayerName';
import { useMapbase } from '~/store/useMapbase';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';
import CircleStyle from 'ol/style/Circle';
import { includes } from 'lodash';
import { StyleFunction } from 'ol/style/Style';
import { MyEvents } from '~/main';

interface StyleOptions {
  opacity?: number;
  color?: string;
  weight?: number;
  dashArray?: string;
  fillColor?: string;
  radius?: number;
}

export interface StyleFilter {
  left: { column: string };
  operation: '>=' | '<=' | '>' | '<' | '==' | '!=';
  right: number;
}

export interface ThemematicsConfig {
  type: 'LINE' | 'POINT' | 'POLYGON' | 'LINESTRING' | 'CIRCLE';
  filter: {
    left: { column: string };
    operation: '>=' | '<=' | '>' | '<' | '==' | '!=';
    right: number | { column: string };
  }[];
  options: StyleOptions;
}

interface StyleConfig {
  customStyleName?: string;
}

export class CustomVectorTileLayer extends VectorTileLayer {
  private _defaultStyle: StyleFunction | null | Style = null;
  private _userStyle: Style | null = null;

  constructor(options: Options) {
    super(options); // Gọi constructor của lớp cha
    this._defaultStyle = this.getStyleFunction() as StyleFunction;
  }

  // Phương thức trả về aliasName từ thuộc tính layer
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

  public setCurrentVisible(visible: boolean) {
    const zoom = this.getMapInternal()?.getView()?.getZoom() ?? 0;
    if (zoom >= 13) {
      if (!visible) {
        super.setVisible(false);
      } else {
        super.setVisible(true);
      }
    }
  }
  public setVisible(visible: boolean) {
    const zoom = this.getMapInternal()?.getView()?.getZoom() ?? 0;
    MyEvents.emit('setVisibleLayer', { layerName: this.get('layerName'), visible: visible });

    if (zoom >= 13) {
      if (!visible) {
        super.setVisible(false);
      } else {
        super.setVisible(true);
      }
    }
    const layerData = useMapbase.getState().layerData;
    const newLayerData =
      layerData?.map(item => ({
        ...item,
        visible: item.value === this.get('layerName') ? visible : item.visible,
      })) ?? [];
    useMapbase.getState().setLayerData(newLayerData);
    const layer = useMapbase
      .getState()
      .getMap()
      ?.getLayers()
      .getArray()
      .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;
    const layerName = newLayerData
      ?.filter(item => item.minZoom <= zoom && item.maxZoom >= zoom && item.visible)
      .map(item => item.value);
    const styleNames = newLayerData
      ?.filter(item => item.minZoom <= zoom && item.maxZoom >= zoom && item.visible)
      .map(item => item.styleName);
    if (layer) {
      layer.getSource()?.updateParams({ LAYERS: layerName.join(','), STYLES: styleNames });
      layer.getSource()?.refresh();
    }
  }
  public refresh(): void {
    const zoom = this.getMapInternal()?.getView()?.getZoom() ?? 0;
    if (zoom >= 13) {
      this.getSource()?.refresh();
    } else {
      MyEvents.emit('layerRefresh');
    }
  }
  public getProperties() {
    const properties = {
      layerName: this.get('layerName'),
      aliasName: this.getAliasName(),
      isSelectable: this.isSelectable(),
      tableName: this.getTableName(),
      minZoom: this.getMinZoom(),
      maxZoom: this.getMaxZoom(),
      editable: this.get('editable'),
    };
    return properties;
  }
  public setUserLayerConfig(zoomLevel: { minZoom: number; maxZoom: number } | null) {
    const zoom = this.getMapInternal()?.getView()?.getZoom();
    if (!zoom) {
      return;
    }
    const layerData = useMapbase.getState().layerData ?? [];
    const newLayerData = layerData.map(item => ({
      ...item,
      minZoom: item.value === this.get('layerName') ? zoomLevel?.minZoom : item.minZoom,
      maxZoom: item.value === this.get('layerName') ? zoomLevel?.maxZoom : item.maxZoom,
    }));
    useMapbase.getState().setLayerData(newLayerData);

    if (zoom >= 13) {
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
    updateConfigLayer(this.get('id'), {
      minZoom: zoomLevel?.minZoom,
      maxZoom: zoomLevel?.maxZoom,
    }).then(response => {
      if (!!response) {
        const layer = useMapbase
          .getState()
          .getMap()
          ?.getLayers()
          .getArray()
          .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;
        const layerName = newLayerData
          ?.filter(item => item.minZoom <= zoom && item.maxZoom >= zoom)
          .map(item => item.value)
          .join(',');
        const styleNames = newLayerData
          ?.filter(item => item.minZoom <= zoom && item.maxZoom >= zoom)
          .map(item => item.styleName);
        if (layer) {
          layer.getSource()?.updateParams({ LAYERS: layerName, STYLES: styleNames });
          layer.getSource()?.refresh();
          // this.setDefaultStyle();
        }
      }
    });
  }

  /**
   * Thiết lập style người dùng hoặc quay lại style mặc định.
   * @param {Style | null} style - Style tùy chỉnh của người dùng hoặc null để trở về mặc định.
   */
  public async setUserStyleConfig(styleConfig: StyleConfig | null) {
    const zoom = this.getMapInternal()?.getView()?.getZoom();
    const layerData = useMapbase.getState().layerData ?? [];
    const defaultStylesData = useMapbase.getState().defaultStyles ?? [];

    if (!zoom) {
      return;
    }
    if (styleConfig === null) {
      this.setDefaultStyle();
      return;
    }

    const styleName = styleConfig?.customStyleName ?? '';
    
    // 먼저 커스텀 스타일에서 찾기
    const response = await findCustomStyleName(styleName);
    
    if (response) {
      // 커스텀 스타일이 있는 경우
      const styles = response.configs[0];
      const { type, options } = styles;
      const newStyles = defaultStylesData.map(item => {
        return {
          ...item,
          options: item.styleName === this.get('layerName') ? options : item.options,
          customStyleName: item.styleName === this.get('layerName') ? response.name : item.styleName,
        };
      });
      const newLayerData = layerData.map(item => {
        return {
          ...item,
          styleName: item.value === this.get('layerName') ? response.name : item.styleName,
        };
      });
      useMapbase.getState().setLayerData(newLayerData);
      useMapbase.getState().setDefaultStyles(newStyles);
      
      // Vector Tile 레이어는 직접 스타일 설정 불가 - WMS 파라미터 업데이트만 수행
      const layer = useMapbase
        .getState()
        .getMap()
        ?.getLayers()
        .getArray()
        .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;
      const layerName = newLayerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => item.value)
        .join(',');
      const styleNames = newLayerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => item.styleName);
      if (layer) {
        layer.getSource()?.updateParams({ LAYERS: layerName, STYLES: styleNames });
        layer.getSource()?.refresh();
      }
    } else {
      // 커스텀 스타일이 없으면 기본 스타일로 직접 설정
      const newLayerData = layerData.map(item => {
        return {
          ...item,
          styleName: item.value === this.get('layerName') ? styleName : item.styleName,
        };
      });
      useMapbase.getState().setLayerData(newLayerData);
      
      // WMS 파라미터 업데이트
      const layer = useMapbase
        .getState()
        .getMap()
        ?.getLayers()
        .getArray()
        .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;
      const layerName = newLayerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => item.value)
        .join(',');
      const styleNames = newLayerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => item.styleName);
      if (layer) {
        layer.getSource()?.updateParams({ LAYERS: layerName, STYLES: styleNames });
        layer.getSource()?.refresh();
      }
      
      console.log(`기본 스타일 '${styleName}'을 적용했습니다.`);
    }
  }
  public setDefaultStyle() {
    const zoom = this.getMapInternal()?.getView()?.getZoom();
    if (!zoom) {
      return;
    }
    const layerData = useMapbase.getState().layerData ?? [];
    const defaultStylesData = useMapbase.getState().defaultStyles ?? [];
    this._userStyle = null;
    
    // 기본 스타일로 복원
    const defaultData = defaultStylesData.map(item => ({
      ...item,
      customStyleName: undefined,
      options: layerData.find(it => it.value === item.styleName)?.optionsStyle,
    }));
    
    const newLayerData = layerData.map(item => ({
      ...item,
      styleName:
        item.value === this.get('layerName')
          ? defaultData.find(it => it.id === item.styleId)?.styleName
          : item.styleName,
    }));
    
    useMapbase.getState().setDefaultStyles(defaultData);
    useMapbase.getState().setLayerData(newLayerData);
    
    // WMS 파라미터 업데이트
    const layer = useMapbase
      .getState()
      .getMap()
      ?.getLayers()
      .getArray()
      .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;

    const layerName = newLayerData
      ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
      .map(item => item.value)
      .join(',');
    const styleNames = newLayerData
      ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
      .map(item => item.styleName);
      
    if (layer) {
      layer.getSource()?.updateParams({ LAYERS: layerName, STYLES: styleNames });
      layer.getSource()?.refresh();
      console.log('기본 스타일로 복원되었습니다:', styleNames);
    }
  }
  public async setThemematics(styleConfigs: StyleConfig) {
    const zoom = Math.floor(useMapbase.getState().getZoom('current'));
    const layerData = useMapbase.getState().layerData ?? [];
    const defaultStylesData = useMapbase.getState().defaultStyles ?? [];
    const filterNames = [
       "nodeBusinessPlan",
       "nodeExcavationSite",
       "nodeGreenBelt",
       "nodePublicToilet",
       "nodeRoadsideTrees",
       "linkDsWay",
       "linkSafeWayHome",
       "polygonHump"
    ];

    const filteredStyles = defaultStylesData.filter(style => filterNames.includes(style.styleName));
    if (!zoom) {
      return;
    }

    console.log('setThemematics 호출됨:', { 
      customStyleName: styleConfigs.customStyleName, 
      zoom, 
      layerData: layerData.length,
      defaultStylesData: defaultStylesData.length 
    });

    const response = await findCustomStyleName(styleConfigs.customStyleName ?? '');
    console.log('findCustomStyleName 응답:', response);
    
    if (response) {
      const configs = response.configs;
      const newStyles = filteredStyles.map(item => {
        return {
          ...item,
          customStyleName: item.styleName === this.get('layerName') ? response.name : item.styleName,
        };
      });
      useMapbase.getState().setDefaultStyles(newStyles);

      // Vector Tile 레이어는 직접 스타일 설정 불가 - WMS 파라미터 업데이트만 수행
      const layer = useMapbase
        .getState()
        .getMap()
        ?.getLayers()
        .getArray()
        .find(layer => layer.get('id') === 'mvt-image') as ImageLayer<ImageWMS>;
      
      // LAYERS와 STYLES 파라미터를 올바르게 설정
      const layerName = layerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => item.value)
        .join(',');
      const styleNames = layerData
        ?.filter(item => (item.minZoom ?? 0) <= zoom && (item.maxZoom ?? 20) >= zoom)
        .map(item => (item.value === this.get('layerName') ? response.name : item.styleName));
      
      console.log('WMS 파라미터 설정:', { 
        layerName, 
        styleNames, 
        currentLayerName: this.get('layerName'),
        responseName: response.name 
      });
      
      if (layer) {
        layer.getSource()?.updateParams({ LAYERS: layerName, STYLES: styleNames });
        layer.getSource()?.refresh();
        console.log('테마틱 스타일이 적용되었습니다:', { LAYERS: layerName, STYLES: styleNames });
      } else {
        console.warn('mvt-image 레이어를 찾을 수 없습니다.');
      }
    } else {
      console.warn(`테마틱 스타일 '${styleConfigs.customStyleName}'을 찾을 수 없습니다.`);
    }
  }

  private _createStyle(type: 'LINESTRING' | 'POINT' | 'POLYGON' | 'LINE' | 'CIRCLE', options: StyleOptions): Style {
    const { color = '#000', weight = 1, dashArray = '0', fillColor = '#FFF', radius = 5 } = options;

    switch (type) {
      case 'LINESTRING':
      case 'LINE':
        return new Style({
          stroke: new Stroke({
            color,
            width: weight,
            lineDash: dashArray.split(',').map(Number),
          }),
        });

      case 'POINT':
      case 'CIRCLE':
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
        return new Style();
    }
  }
}
