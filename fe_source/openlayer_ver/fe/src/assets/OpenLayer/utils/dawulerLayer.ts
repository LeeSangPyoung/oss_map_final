import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import proj4 from 'proj4';
import { centerPointOL, resolutions } from '~/utils/common';
import { getTileUrl } from '~/utils/fillZero';
import { get as getProjection } from 'ol/proj';
import { defaults } from 'ol/interaction/defaults';
import { MapbaseOption } from '~/models/MapBase';
import { LayerModel } from '~/models/Layer';
import { env } from '~/env';
import { CustomVectorLayer } from './customVectorLayer';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';
import { register } from 'ol/proj/proj4';
import { MouseWheelZoom } from 'ol/interaction';

export const extent = [254440, 1232737, 1892840, 2871137]; // 지도 경계 설정
proj4.defs(
  'EPSG:5179',
  '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs',
);
register(proj4);

export const dawulLayer = new TileLayer({
  source: new XYZ({
    projection: 'EPSG:5179',
    tileGrid: new TileGrid({
      origin: [254440, 2871137],
      resolutions: resolutions,
      tileSize: 400,
    }),
    tileSize: 400,
    tileUrlFunction: function ([z, x, y]) {
      const coords = {
        x,
        y,
        z,
      };
      return getTileUrl(coords);
    },
  }),
});

export const mapDawulayerBase = (options: MapbaseOption, target?: string) => {
  const projection = getProjection('EPSG:5179');
  projection?.setExtent(extent);
  const centerPoint = !!options?.mapOptions?.center ? options.mapOptions?.center : centerPointOL;
  const initialMap = new Map({
    target: !!target ? target : options.target,
    view: new View({
      center: proj4('EPSG:4326', 'EPSG:5179', centerPoint),
      zoom: options?.mapOptions?.zoom,
      maxZoom: 17,
      minZoom: 1,
      projection: projection ?? undefined, // View 좌표계를 EPSG:5179로 설정
      resolutions: resolutions,
    }),
    layers: [dawulLayer],
    interactions: defaults({
      doubleClickZoom: false, // Vô hiệu hóa double click zoom
      shiftDragZoom: false,
      mouseWheelZoom: false,
    }).extend([
      new MouseWheelZoom({
        constrainResolution: true,
        duration: 250,
      }),
    ]),
    // controls: defaultsControl({
    //   zoom: true,
    // }),
  });
  return initialMap;
};

export const onTransformLayer = (layerData: LayerModel[]) => {
  const newLayerData = layerData.map(item => {
    const name = `ne:${item.value}`;
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        const url = `${env.geoServer}/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:5179`;
        return url;
      },
      strategy: bboxStrategy,
    });
    const layer = new CustomVectorLayer({
      id: item.id,
      source: vectorSource,
    });
    layer.setProperties({
      id: item.value,
      tableName: item.tableName,
      aliasName: item.alias,
      isSelectable: item.selectable,
      type: 'geojson',
      geometryType: item.geometryType,
      maxZoom: item.maxZoom ?? 1,
      minZoom: item.minZoom,
    });
    return layer;
  });
  return newLayerData;
};
