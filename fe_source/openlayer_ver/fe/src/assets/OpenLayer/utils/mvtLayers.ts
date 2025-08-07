import MVT from 'ol/format/MVT';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { env } from '~/env';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { MyMapRef } from '~/models/MapBase';
import { LayerModel } from '~/models/Layer';
import { CustomVectorTileLayer } from '~/assets/OpenLayer/utils/customTileLayer';
import { LayerStyles, OptionStyle } from '~/models/Styles';
import { get as getProjection } from 'ol/proj';
import { TileGrid } from 'ol/tilegrid';
import { resolutions } from '~/utils/common';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

// EPSG:5179 정의 및 등록 (UTM-K)
proj4.defs(
  'EPSG:5179',
  '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
);
register(proj4 as any);

// EPSG:5179 extent 명시
const proj5179 = getProjection('EPSG:5179');
if (proj5179) {
  proj5179.setExtent([90112, 1192896, 1990673, 2761664]);
}

function xyzToEPSG5179BoundingBox(x: number, y: number, z: number) {
  // 타일 크기와 해상도 계산
  const tileSize = 256; // 타일 크기
  const originShift = 20037508.34; // EPSG:3857의 최대 좌표 한계 (미터 단위)

  // 줌 레벨에 따른 해상도 계산
  const resolution = (2 * originShift) / (tileSize * Math.pow(2, z));

  // x, y 좌표에 따른 BBOX 계산
  const minx = x * tileSize * resolution - originShift;
  const maxx = (x + 1) * tileSize * resolution - originShift;
  const miny = originShift - (y + 1) * tileSize * resolution;
  const maxy = originShift - y * tileSize * resolution;

  return `${minx},${miny},${maxx},${maxy}`;
}

export function getLayerStyle(layerName: string, styleId?: number, dataStyles?: LayerStyles[]) {
  const findStyles = dataStyles?.find(item => item.id === styleId)?.options;
  if (findStyles) {
    const styleOptions: OptionStyle = JSON.parse(findStyles);
    switch (layerName) {
      case 'nodeBusinessPlan':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? '#FF0000', // 빨간색
            }),
          }),
        });

      case 'nodeExcavationSite':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? '#979696', // 회색
            }),
          }),
        });

      case 'nodeGreenBelt':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? '#319630', // 초록색
            }),
          }),
        });

      case 'nodePublicToilet':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? '#aba8a7', // 옅은 회색
            }),
          }),
        });

      case 'nodeRoadsideTrees':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? '#7ab878', // 밝은 초록색
            }),
          }),
        });

      case 'linkDsWay':
        return new Style({
          stroke: new Stroke({
            color: styleOptions?.color ?? '#7695c1', // 파란색
            width: styleOptions?.width ?? 1,
          }),
        });

      case 'linkSafeWayHome':
        return new Style({
          stroke: new Stroke({
            color: styleOptions?.color ?? '#ec5fcc', // 분홍색
            width: styleOptions?.width ?? 1,
          }),
        });

      case 'polygonHump':
        return new Style({
          fill: new Fill({
            color: styleOptions?.fillColor ?? '#f7b9a7', // 밝은 핑크
          }),
          stroke: new Stroke({
            color: styleOptions?.color ?? '#f99578', // 어두운 핑크
            width: 1,
          }),
        });
      case 'performanceTest':
        return new Style({
          image: new CircleStyle({
            radius: styleOptions.radius ?? 3,
            fill: new Fill({
              color: styleOptions.fillColor ?? 'blue', // 초록색
            }),
          }),
        });

      default:
        return new Style({
          fill: new Fill({
            color: '#0000FF', // 기본 파란색
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2,
          }),
        });
    }
  }
}

export const selectedFeatureStyle = new Style({
  stroke: new Stroke({
    color: 'green',
    width: 4,
  }),
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)',
  }),
});

export function createVectorLayer(layerValue: LayerModel, dataStyles?: LayerStyles[]) {
  const projection = getProjection('EPSG:5179');
  if (!projection) {
    throw new Error('EPSG:5179 projection not found');
  }
  const tileGrid = new TileGrid({
    extent: projection.getExtent(),
    resolutions,
    tileSize: 256,
  });
  const vectorLayer = new CustomVectorTileLayer({
    source: new VectorTileSource({
      format: new MVT({
        featureClass: Feature,
      }),
      tileUrlFunction: tileCoord => {
        const [z, x, y] = tileCoord;
        const bbox = xyzToEPSG5179BoundingBox(x, y, z);
        return `${env.geoServer}/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne:${layerValue.value}&bbox=${bbox}&width=256&height=256&srs=EPSG%3A5179&styles=&format=application%2Fvnd.mapbox-vector-tile`;
      },
      projection: 'EPSG:5179',
      tileGrid,
    }),
    style: feature => {
      return getLayerStyle(layerValue.value ?? '', layerValue.styleId, dataStyles);
    },
  });

  // 'layerName' 속성을 레이어에 추가
  vectorLayer.set('id', layerValue.id);
  vectorLayer.setCurrentVisible(!!layerValue.visible);
  vectorLayer.set('layerName', layerValue.value);
  vectorLayer.set('aliasName', layerValue.alias);
  vectorLayer.set('tableName', layerValue.tableName);
  vectorLayer.set('selectable', layerValue.selectable);
  vectorLayer.set('minZoom', layerValue.minZoom);
  vectorLayer.set('maxZoom', layerValue.maxZoom);
  vectorLayer.set('editable', layerValue.editable);
  return vectorLayer;
}

export function createImageLayer(layerName: string, styles?: string) {
  const imageLayer = new ImageLayer({
    source: new ImageWMS({
      url: `${env.geoServer}/geoserver/ne/wms`,
      params: {
        LAYERS: layerName,
        FORMAT: 'image/png',
        TRANSPARENT: true,
        VERSION: '1.1.1',
        SRS: 'EPSG:5179', // 반드시 5179로 통일
        CRS: 'EPSG:5179', // 반드시 5179로 통일
        STYLES: styles ?? layerName,
      },
      serverType: 'geoserver',
    }),
    visible: true,
  });
  imageLayer.set('layerName', layerName);
  imageLayer.set('id', 'mvt-image');
  return imageLayer;
}

export function calculateBbox(coordinate: number[], zoom: number, resolutions: number[]) {
  // 소수점 버림하여 정수 줌 레벨 사용
  const roundedZoom = Math.floor(zoom);
  // 좌표와 zoom 값의 유효성 확인
  if (
    !coordinate ||
    coordinate.length !== 2 ||
    isNaN(roundedZoom) ||
    roundedZoom < 0 ||
    roundedZoom >= resolutions.length
  ) {
    console.error('Invalid coordinate or zoom level');
    return null;
  }

  const [x, y] = coordinate;
  const resolution = resolutions[roundedZoom];

  // 줌 레벨에 따른 버퍼 크기 조정 (필요 시 값 조정 가능)
  let bufferMultiplier;
  if (roundedZoom < 10) {
    bufferMultiplier = 10; // 낮은 줌 레벨에서 더 큰 버퍼
  } else if (roundedZoom < 11) {
    bufferMultiplier = 5; // 10~11 레벨 사이에서 중간 크기 버퍼
  } else if (roundedZoom < 12) {
    bufferMultiplier = 5; // 11~12 레벨에서 작은 버퍼
  } else if (roundedZoom < 13) {
    bufferMultiplier = 3; // 12~13 레벨에서 더 작은 버퍼
  } else {
    bufferMultiplier = 1; // 줌 레벨 13 이상에서는 기본 버퍼 적용
  }

  const buffer = resolution * bufferMultiplier;

  const minX = x - buffer;
  const minY = y - buffer;
  const maxX = x + buffer;
  const maxY = y + buffer;

  return `${minX},${minY},${maxX},${maxY}`;
}

export function applyLineStringHighlightStyle() {
  return new Style({
    stroke: new Stroke({
      color: 'blue', // 강조할 색상
      width: 10, // 강조할 두께
    }),
  });
}
export function addCircleMarker(
  map: MyMapRef,
  coordinate: number[],
  layer?: LayerModel,
  isMultiple?: boolean,
  featureId?: string,
) {
  const markerFeature = new Feature({
    geometry: new Point(coordinate),
  });

  markerFeature.setId(featureId);

  markerFeature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 10, // 원의 반지름
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0)',
        }),
        stroke: new Stroke({
          color: 'red', // 바깥선 색상
          width: 2, // 바깥선 두께
        }),
      }),
    }),
  );

  // 마커 레이어 생성
  const markerLayer = new VectorLayer({
    source: new VectorSource({
      features: [markerFeature],
    }),
    minZoom: layer?.minZoom,
    maxZoom: layer?.maxZoom,
  });

  if (map.markerLayer) {
    if (!isMultiple) {
      map.markerLayer?.forEach(layer => map?.removeLayer(layer));
      map.markerLayer = [];
    }
  }
  map?.addLayer(markerLayer);
  map.markerLayer?.push(markerLayer);

  // if (!!map?.markerLayer && map?.markerLayer !== null) {
  //   if (!isMultiple) {
  //     map?.markerLayer?.forEach(layer => map?.removeLayer(layer));
  //     map.markerLayer = [];
  //   }
  // } else {
  //   map.markerLayer = [];
  // }
}
