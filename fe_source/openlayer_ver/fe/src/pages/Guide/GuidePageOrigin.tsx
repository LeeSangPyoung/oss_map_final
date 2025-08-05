/* eslint-disable react-hooks/exhaustive-deps */
import { Collection, Feature, MapBrowserEvent } from 'ol';
import { useEffect, useRef, useState } from 'react';
import { useGetLayerList } from '~/packages/Home/services/useGetLayers';
import { mapDawulayerBase } from '~/packages/OpenLayer/utils/dawulerLayer';
import { useMapbase } from '~/store/useMapbase';
import { isEmpty, debounce } from 'lodash';
import 'react-contexify/dist/ReactContexify.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import { ImageWMS, VectorTile } from 'ol/source';
import RenderFeature from 'ol/render/Feature';
import ImageLayer from 'ol/layer/Image';
import {
  addCircleMarker,
  createImageLayer,
  createVectorLayer,
  selectedFeatureStyle,
} from '~/packages/OpenLayer/utils/mvtLayers';
import { Button } from 'antd';
import { MyMapRef } from '~/models/MapBase';
import { getFeatureById, getFeaturesFromWFS, getListFeaturesInPixel } from '~/packages/OpenLayer/services/getFeatures';
import { LineString, MultiLineString, Point, Polygon } from 'ol/geom';
import { FeatureBase } from '~/models/Coords';
import { centerPointOL, listButton, listButton2 } from '~/utils/common';
import { useGetLayerStyles } from '~/packages/Home/services/useGetStylesLayers';
import { ModeDraw, ModeOptions, ModeSelector } from '~/models/ModeDraw';
import { useRectangleSelection } from '~/packages/Selection';
import { useCircleSelection } from '~/packages/Selection';
import { usePolygonSelection } from '~/packages/Selection';
import { LayerModel } from '~/models/Layer';
import { useTrailDistance } from '~/packages/Drawing';
import { Draw, Modify, Snap } from 'ol/interaction';
import { useMapHistoryStore } from '~/store/useHistoryStore';
import { useTrailArea } from '~/packages/Drawing';
import { useTrailSimple } from '~/packages/Drawing';
import { useAreaDraw } from '~/packages/Drawing/hooks/useAreaDraw';
import { useTrailDraw, useTrailDrawPoint, useTrailDrawPolygon } from '~/packages/Drawing/hooks/useTrailDraw';
import LayerGroup from 'ol/layer/Group';
import { MyEvents } from '~/main';
import { FeatureData } from '~/packages/OpenLayer/utils/customVectorLayer';
import { CustomVectorTileLayer } from '~/packages/OpenLayer/utils/customTileLayer';
import ModifyFeature from 'ol-ext/interaction/ModifyFeature';
import { boundaryStyle, nodeStylesTrailEdit, updateFeatureStyle } from '~/packages/OpenLayer/utils/stylesFeature';
import {
  calculateDistance,
  calculateDistanceToSegment,
  generateSegmentsFromPolygon,
} from '~/packages/OpenLayer/utils/common';
import proj4 from 'proj4';
import { useLayerStore } from '~/store/useLayer';
import SelectSido from '~/components/SelectSido/SelectSido';
import SelectSsgByCode from '~/components/SelectSggByCode/SelectSggByCode';
import { Item, Menu, useContextMenu } from 'react-contexify';

const MENU_ID = 'MENU_OPEN_LAYER';

export default function GuidePageOrigin() {
  console.log('GuidePageOrigin mount');
  const mapStore = useMapbase();
  const [zoom, setZoomDisplay] = useState(13);
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [sido, setSido] = useState('');
  const [visibleLayer, setVisibleLayer] = useState({
    layerName: '',
    visible: true,
  });

  const [themeCustom, setThemeCustom] = useState({
    layerName: '',
    stylesName: '',
  });
  // const [isDraw, setDraw] = useState(false);

  const mapRef = useRef<MyMapRef | null>(null); // Dùng useRef để lưu map đã khởi tạo
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const vectorTileLayers = useRef<VectorTileLayer<VectorTile<RenderFeature>, RenderFeature>[]>([]);
  const tileWmsLayer = useRef<ImageLayer<ImageWMS> | null>(null);

  const snapSource = useRef(new VectorSource());
  const addedFeatureIdsRef = useRef(new Set()); // Theo dõi các feature đã thêm

  const { show } = useContextMenu({ id: MENU_ID });

  const { startSelectorFeature } = useRectangleSelection({
    map: mapStore.map,
  });

  const { onMoveEnd, resetHistory } = useMapHistoryStore();

  const handleEndDraw = () => {
    setDrawPolygon(false);
    const inter = mapRef.current
      ?.getInteractions()
      .getArray()
      .filter(item => mapStore.selectorMode === item.get('selectorMode'));
    inter?.forEach(it => it.setActive(true));
  };

  const { startDrawing: startTrailDistance } = useTrailDistance({
    map: mapStore.map,
    onEndDraw: handleEndDraw,
  });
  const { startDrawing: startTrailArea } = useTrailArea({
    map: mapStore.map,
    onEndDraw: handleEndDraw,
  });

  const { startCircleSelection } = useCircleSelection({
    map: mapStore.map,
    onEndDraw: handleEndDraw,
  });
  const { startPolygonSelection } = usePolygonSelection({
    map: mapStore.map,
    onEndDraw: handleEndDraw,
    onStartDraw: () => {
      setDrawPolygon(true);
      console.log('start draw');
      // mapRef.current?.un('click', handleClick);
    },
  });

  const { startDrawSimple } = useTrailSimple({
    onEndDraw: handleEndDraw,
  });

  const { startDraw: startDrawRect } = useAreaDraw({
    onEndDraw: handleEndDraw,
  });

  const { startDraw: startTrailDraw } = useTrailDraw({
    onEndDraw: handleEndDraw,
  });
  const { startDraw: startTrailPolygon } = useTrailDrawPolygon({
    onEndDraw: handleEndDraw,
  });
  const { startDraw: startDrawPoint } = useTrailDrawPoint({
    onEndDraw: handleEndDraw,
  });

  const { data: layerData } = useGetLayerList();
  const { data: dataStyles } = useGetLayerStyles();

  const removePointSelected = () => {
    if (mapRef.current?.markerLayer) {
      mapRef.current.markerLayer.forEach(layer => {
        mapRef.current?.removeLayer(layer);
      });
      mapRef.current.markerLayer = [];
    }
  };
  const resetStyleImg = () => {
    if (mapRef.current?.highlightedLineLayer) {
      mapRef.current?.highlightedLineLayer.forEach(layer => {
        mapRef.current?.removeLayer(layer);
      });
      mapRef.current.highlightedLineLayer = [];
    }
  };

  const setSelectedFeatureStyle = async (feature: FeatureBase, layers: LayerModel[], isMultiple?: boolean) => {
    const geometryType = feature?.geometry?.type;
    const findLayerOfFeature = layers.find(item => item.value === feature.properties?.type);
    if (!mapRef.current || !visibleLayer.visible) {
      return;
    }

    const featureSelected = feature;

    if (geometryType === 'LineString' || geometryType === 'MultiLineString' || geometryType === 'Polygon') {
      // const featureSelected = await getFeatureById(
      //   `${feature.properties?.type}`,
      //   `${geometryType === 'Polygon' ? 'polygon_id' : 'link_id'}=${feature.id?.split('.')?.[1] ?? ''}`,
      // );
      if (featureSelected) {
        let lineFeature: Feature | null = null;
        if (geometryType === 'MultiLineString') {
          lineFeature = new Feature({
            geometry: new MultiLineString(featureSelected.geometry.coordinates), // 전체 MultiLineString 사용
          });
        } else if (geometryType === 'LineString') {
          lineFeature = new Feature({
            geometry: new LineString(featureSelected.geometry.coordinates), // 전체 MultiLineString 사용
          });
        } else if (geometryType === 'Polygon') {
          lineFeature = new Feature({
            geometry: new Polygon(featureSelected.geometry.coordinates), // 전체 Polygon 사용
          });
        }
        lineFeature?.setStyle(selectedFeatureStyle);
        lineFeature?.setId(featureSelected.id);

        const lineLayer = new VectorLayer({
          source: new VectorSource({
            features: [lineFeature],
            // style: selectedFeatureStyle,
          }),
          zIndex: 100,
          minZoom: findLayerOfFeature?.minZoom,
          maxZoom: findLayerOfFeature?.maxZoom,
        });
        lineLayer.set('id', featureSelected.id);
        if (mapRef.current?.highlightedLineLayer) {
          if (!isMultiple) {
            mapRef.current?.highlightedLineLayer?.forEach(layer => mapRef.current?.removeLayer(layer));
            mapRef.current.highlightedLineLayer = [];
            mapRef.current?.addLayer(lineLayer);
            mapRef.current.highlightedLineLayer?.push(lineLayer);
          } else {
            const isExists = mapRef.current.highlightedLineLayer?.findIndex(
              item => item.get('id') === featureSelected.id,
            );
            if (isExists === -1) {
              mapRef.current?.addLayer(lineLayer);
              mapRef.current.highlightedLineLayer?.push(lineLayer);
            }
          }
        }
      }
    } else {
      const geometry = new Point(feature.geometry?.coordinates ?? []);
      mapRef.current &&
        addCircleMarker(mapRef.current, geometry.getCoordinates(), findLayerOfFeature, isMultiple, feature.id);
      // resetStyleImg();
    }
  };

  // 지도 생성 및 마운트
  useEffect(() => {
    if (!mapRef.current && !!mapStore.defaultOptions) {
      const options = { ...mapStore.defaultOptions, target: 'map-open-layer' };
      const initialMapBase = mapDawulayerBase(options);
      mapRef.current = initialMapBase;
      mapStore.setMap(initialMapBase);
    }
  }, [mapStore.defaultOptions]);

  // 데이터 로딩 및 상태 변화 추적 로그
  useEffect(() => {
    console.log('[GuideOrigin] useEffect triggered');
    console.log('[GuideOrigin] mapRef.current:', mapRef.current);
    console.log('[GuideOrigin] layerData (useGetLayerList):', layerData);
    console.log('[GuideOrigin] dataStyles (useGetLayerStyles):', dataStyles);
    console.log('[GuideOrigin] mapStore.layerData:', mapStore.layerData);
    console.log('[GuideOrigin] mapStore.defaultStyles:', mapStore.defaultStyles);
  }, [layerData, dataStyles, mapStore.layerData, mapStore.defaultStyles]);

  // layerData가 도착하면 mapStore.layerData에 동기화
  useEffect(() => {
    if (layerData) {
      mapStore.setLayerData(layerData);
      console.log('[GuideOrigin] mapStore.setLayerData called');
    }
  }, [layerData]);

  // 레이어 초기화 및 줌 이벤트
  useEffect(() => {
    const { layerData: layerDataStore } = mapStore;
    if (mapRef.current && layerDataStore) {
      const handleZoomChange = () => {
        const zoom = Math.floor(mapRef.current?.getView()?.getZoom() ?? 0);
        setZoomDisplay(zoom);
        const isZoomForMVT = zoom >= 13;
        if (isZoomForMVT) {
          vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
          vectorTileLayers.current = layerDataStore.map(layer => {
            const vectorLayer = createVectorLayer(layer, mapStore.defaultStyles);
            mapRef.current?.addLayer(vectorLayer);
            // 벡터타일 레이어의 source URL 템플릿 로그
            const src = vectorLayer.getSource();
            const vtUrl = src && src.getUrls ? src.getUrls() : undefined;
            console.log('[GuideOrigin] VectorTile source URL:', vtUrl);
            // 주요 속성 로그
            console.log('[GuideOrigin] VectorTile visible:', vectorLayer.getVisible());
            console.log('[GuideOrigin] VectorTile opacity:', vectorLayer.getOpacity());
            return vectorLayer;
          });
          // map에 올라간 전체 레이어 확인
          console.log('[GuideOrigin] map.getLayers:', mapRef.current.getLayers().getArray());
          // 현재 projection 코드 로그
          console.log('[GuideOrigin] Projection:', mapRef.current.getView().getProjection().getCode());
        }
      };
      mapRef.current.getView().on('change:resolution', handleZoomChange);
      setTimeout(() => {
        handleZoomChange();
      }, 0);
      return () => {
        mapRef.current?.getView().un('change:resolution', handleZoomChange);
      };
    }
  }, [mapStore.layerData, visibleLayer, mapStore.defaultStyles, themeCustom]);

  // main(/) 첫 진입 시에도 WMS가 반드시 호출되도록 강제 추가 useEffect
  useEffect(() => {
    if (mapRef.current && layerData && dataStyles) {
      const zoom = Math.floor(mapRef.current?.getView().getZoom() ?? 0);
      const layersFilter = layerData
        .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
        .filter(item => item.visible);
      const layerNames = layersFilter.map(item => item.value);
      const styleNames = layerNames.map(layerName => {
        const found = layerData.find(item => item.value === layerName);
        return found && found.styleName ? found.styleName : '';
      });
      if (tileWmsLayer.current) {
        tileWmsLayer.current?.getSource()?.updateParams({ LAYERS: layerNames, STYLES: styleNames });
        tileWmsLayer.current.setVisible(true);
        tileWmsLayer.current?.getSource()?.refresh();
      } else {
        const newTileWmsLayer = createImageLayer(layerNames.join(','), styleNames.join(','));
        mapRef?.current?.addLayer(newTileWmsLayer);
        tileWmsLayer.current = newTileWmsLayer;
      }
    }
  }, [mapRef.current, layerData, dataStyles]);

  // === 버튼 핸들러 함수 추가 시작 ===
  const handleGetCenter = () => {
    const latLng = mapStore.getCenter();
    alert(JSON.stringify(latLng));
  };

  const handleGetZoom = (type: 'current' | 'min' | 'max') => () => {
    const zoom = mapStore.getZoom(type);
    const title = type === 'current' ? 'Zoom: ' : type === 'min' ? 'Min Zoom: ' : 'Max Zoom:';
    alert(title + zoom);
  };

  const panToView = () => {
    mapStore.panTo([126.76202, 37.68216]);
  };

  const panToView2 = () => {
    mapStore.panTo([126.76202, 37.68216], 10);
  };

  const handleFitBounds = () => {
    mapStore.fitBounds({ min: [126.937554, 37.523505], max: [127.03003, 37.577724] });
  };

  const handleHistoryAction = (type: 'back' | 'forward') => () => {
    mapStore.onHistoryAction(type);
  };

  const refreshMap = () => {
    mapStore.refresh();
  };
  const handleGetLayerById = (layerId: string) => async () => {
    const layer = await mapStore.getLayerById(layerId);
    alert(layerId);
    return layer;
  };

  const handleGetLayerAlias = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      const aliasName = layer.getAliasName();
      alert(aliasName);
    }
  };
  const handleGetTableName = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      const tableName = layer.getTableName();
      alert(tableName);
    }
  };

  const handleGetZoomLayer = (zoomType: 'min' | 'max') => async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      const zoom = zoomType === 'min' ? layer.getMinZoom() : layer.getMaxZoom();
      alert(zoom);
    }
  };

  const isSelectableLayer = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      const isSelectable = layer.isSelectable();
      alert(isSelectable);
    }
    return false;
  };

  const getLayerProperties = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      const properties = layer.getProperties();
      alert(JSON.stringify(properties));
    }
  };

  const showLayer = async () => {
    const layer = await mapStore.getLayerById('linkDsWay');
    if (layer) {
      if (visibleLayer.visible) {
        layer.setVisible(false);
      } else {
        layer.setVisible(true);
      }
    }
  };

  const refreshLayer = async () => {
    const layer = await mapStore.getLayerById('linkDsWay');
    if (layer) {
      layer.refresh();
    }
  };

  const addLayer = () => {
    let layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
    if (!layer) {
      layer = mapStore.addCustomLayerByName('TEST_USER_LAYER');
    }
    const features: FeatureData[] = [
      {
        geometry: {
          type: 'Point',
          coordinates: centerPointOL,
        },
        style: { id: 'nodeBusinessPlan' },
      },
      {
        geometry: {
          type: 'LineString',
          coordinates: [
            [127.062289345605, 37.5087805938127],
            [127.045617, 37.495418],
          ],
        },
        style: { id: 'linkSafeWayHome' },
      },
    ];
    layer?.addData(features);
    // layer?.setStyle([pointStyle]);
  };

  const clearAllLayers = () => {
    const layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
    if (layer) {
      layer.clearLayers();
    }
  };
  const removeLayerByName = (name: string) => {
    mapStore.removeCustomLayerByName(name);
  };
  const getLayerBounds = () => {
    const layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
    if (!layer) {
      return;
    }
    const bounds = layer?.getBounds();
    if (bounds) {
      mapStore.fitBounds({
        min: [bounds[0], bounds[1]],
        max: [bounds[2], bounds[3]],
      });
    }
  };

  const handleSetUserConfigLevel = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    const minZoom = layer?.get('minZoom');
    if (layer) {
      layer?.setUserLayerConfig({ minZoom: minZoom === 5 ? 14 : 5, maxZoom: minZoom === 5 ? 15 : 16 });
    }
  };
  const handleSetUserStyleConfig = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      layer?.setUserStyleConfig({ customStyleName: 'polygonHump-custom' });
    }
  };

  const handleSetDefaultStyle = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    setThemeCustom({ layerName: '', stylesName: '' });
    if (layer) {
      layer.setUserStyleConfig(null);
    }
  };

  const handleSetThemematics = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      setThemeCustom({ layerName: layer.get('layerName'), stylesName: 'polygon-thematics' });
      layer.setThemematics({ customStyleName: 'polygon-thematics' });
    }
  };

  const handleZoomIn = debounce(mapStore.zoomIn, 300);
  const handleZoomOut = debounce(mapStore.zoomOut, 300);
  const clearSelectedLayer = () => {
    mapStore.clearSelectedFeatures?.();
    mapStore.setMode('select');
  };
  // === 버튼 핸들러 함수 추가 끝 ===

  // === 선택/모드 핸들러 함수 추가 ===
  const handleSelection = (type: ModeSelector) => () => {
    if (!drawPolygon) {
      mapStore.setSelectorMode(type);
    }
  };

  const handleSetMode = (type: ModeDraw, options?: ModeOptions) => () => {
    if (type === 'select' || type === 'draw-end') {
      setDrawPolygon(false);
    } else {
      setDrawPolygon(true);
    }
    mapStore.setMode(type, options);
  };
  // === 선택/모드 핸들러 함수 추가 끝 ===

  // === 기타 버튼 핸들러 함수 추가 ===
  const handleGetSelectedFeatures = () => {
    const selectedFeatures = mapStore.getSelectedFeatures();
    if (selectedFeatures) {
      alert(JSON.stringify(selectedFeatures));
    }
  };

  const handleGetTrailCoords = () => {
    const trailCoords = mapStore.getTrailCoordinates();
    alert(JSON.stringify(trailCoords));
  };

  const handleTrailEdit = async () => {
    if (isEmpty(mapStore.selectedFeatures) || mapStore.selectedFeatures.length > 1) {
      alert('Please select a trail feature to edit.');
      return;
    }
    const seletectedFeatures = mapStore.getSelectedFeatures();
    mapStore.setMode('trail-edit', { feature: seletectedFeatures[0] });
  };
  // === 기타 버튼 핸들러 함수 추가 끝 ===

  const handleClickButton = (action: string) => () => {
    const myActionClick: any = {
      center: handleGetCenter,
      currentZoom: handleGetZoom('current'),
      miniZoom: handleGetZoom('min'),
      maxZoom: handleGetZoom('max'),
      refresh: refreshMap,
      panTo: panToView,
      setView: panToView2,
      fitBounds: handleFitBounds,
      back: handleHistoryAction('back'),
      forward: handleHistoryAction('forward'),
      zoomin: handleZoomIn,
      zoomout: handleZoomOut,
      setZoom: () => mapStore.setZoom(10),
      getLayer: handleGetLayerById(`polygonHump`),
      getLayerAliasName: handleGetLayerAlias,
      getTableNameLayer: handleGetTableName,
      layerMinZoom: handleGetZoomLayer('min'),
      layerMaxZoom: handleGetZoomLayer('max'),
      isSelectable: isSelectableLayer,
      getProperties: getLayerProperties,
      layerVisible: showLayer,
      layerRefresh: refreshLayer,
      addData: addLayer,
      clearLayers: clearAllLayers,
      clearSelectLayer: clearSelectedLayer,
      removeCustomLayerByName: () => removeLayerByName('TEST_USER_LAYER'),
      layerBounds: getLayerBounds,
      layerLevel: handleSetUserConfigLevel,
      setUserStyleConfig: handleSetUserStyleConfig,
      setUserStyleConfig2: handleSetDefaultStyle,
      setThemematics: handleSetThemematics,
      defaultContextMenu: () => {
        mapStore.setDefaultContextMenu?.([
          {
            label: 'ZoomIn',
            onClick: function () {
              mapStore.zoomIn();
            },
          },
          {
            label: 'Zoomout',
            onClick: function () {
              mapStore.zoomOut();
            },
          },
        ]);
      },
      editContextMenu: () => {
        mapStore.setDefaultContextMenu?.([
          {
            label: 'Menu1',
            onClick: function () {
              alert('Edit context menu item 1');
            },
          },
          {
            label: 'Menu2',
            onClick: function () {
              alert('Edit context menu item 2');
            },
          },
        ]);
      },
    };
    myActionClick[action]();
  };

  const handleClick2 = (action: string) => () => {
    const myActionClick: any = {
      trailDistance: handleSetMode('trail-distance'),
      trailArea: handleSetMode('trail-area'),
      rectSelection: handleSelection('RECT'),
      circleSelection: handleSelection('CIRCLE'),
      polygonSelection: handleSelection('POLYGON'),
      trailSimple: handleSetMode('trail-simple'),
      areaRect: handleSetMode('area-draw', {
        geoType: 'Rect',
        areaDrawOption: {
          mode: 'rect',
          style: {
            color: 'red',
            fillColor: 'blue',
            weight: 4,
            fill: true,
            fillOpacity: 0.4,
          },
        },
      }),
      areaCircle: handleSetMode('area-draw', {
        geoType: 'Circle',
        areaDrawOption: {
          mode: 'circle',
          style: {
            color: 'red',
            fillColor: 'blue',
            weight: 4,
            fill: true,
            fillOpacity: 0.4,
          },
        },
      }),
      areaPolygon: handleSetMode('area-draw', {
        geoType: 'Polygon',
        areaDrawOption: {
          mode: 'polygon',
          style: {
            color: 'red',
            fillColor: 'blue',
            weight: 4,
            fill: true,
            fillOpacity: 0.4,
          },
        },
      }),
      trailLine: handleSetMode('trail-draw', { geoType: 'LineString' }),
      trailPoint: handleSetMode('trail-draw', { geoType: 'Point' }),
      trailPolygon: handleSetMode('trail-draw', { geoType: 'Polygon' }),
      getSelectedFeatures: handleGetSelectedFeatures,
      getTrailCoordinates: handleGetTrailCoords,
      trailEdit: handleTrailEdit,
      select: handleSetMode('select'),
    };
    myActionClick[action]();
  };

  return (
    <div className="container mx-auto h-full">
      <div className="my-5 flex  items-center gap-4">
        <SelectSido onSelectSido={val => setSido(val ?? '')} />
        <SelectSsgByCode sidoId={sido} />
      </div>
      <div id="map-open-layer" className="size-full" ref={mapContainerRef}></div>

      {!isEmpty(mapStore.contextMenu) && (
        <Menu id={MENU_ID}>
          {mapStore.contextMenu?.map(item => (
            <Item key={item.label} onClick={item.onClick}>
              {item.label}
            </Item>
          ))}
        </Menu>
      )}
      <div className="text-red-500">{zoom}</div>
      <div className="mt-[40px] flex flex-wrap items-center gap-3">
        {listButton.map(item => (
          <Button key={item.id} size="large" onClick={handleClickButton(item.action)}>
            {item.label}
          </Button>
        ))}
        {listButton2.map(item => (
          <Button key={item.id} size="large" onClick={handleClick2(item.action)}>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 