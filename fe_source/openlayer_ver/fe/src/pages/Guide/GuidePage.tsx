/* eslint-disable react-hooks/exhaustive-deps */
import { Feature } from 'ol';
import { useEffect, useRef, useState } from 'react';
import { useGetLayerList } from '~/assets/Home/services/useGetLayers';
import { mapDawulayerBase } from '~/assets/OpenLayer/utils/dawulerLayer';
import { useMapbase } from '~/store/useMapbase';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import 'react-contexify/dist/ReactContexify.css';
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
} from '~/assets/OpenLayer/utils/mvtLayers';
import { Button } from 'antd';
import { MyMapRef } from '~/models/MapBase';
import { LineString, MultiLineString, Point, Polygon } from 'ol/geom';
import { FeatureBase } from '~/models/Coords';
import { centerPointOL, listButton, listButton2 } from '~/utils/common';
import { ModeDraw, ModeOptions, ModeSelector } from '~/models/ModeDraw';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { useMapHistoryStore } from '~/store/useHistoryStore';
import VectorLayer from 'ol/layer/Vector';
import { FeatureData } from '~/assets/OpenLayer/utils/customVectorLayer';
import { Checkbox } from 'antd';
import { useLayerStore } from '~/store/useLayer';

const MENU_ID = 'MENU_OPEN_LAYER';

export default function GuidePage() {
  const mapStore = useMapbase();
  const [zoom, setZoomDisplay] = useState(13);
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [visibleLayer] = useState({
    layerName: '',
    visible: true,
  });
  const [themeCustom, setThemeCustom] = useState({
    layerName: '',
    stylesName: '',
  });
  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
  const mapRef = useRef<MyMapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const vectorTileLayers = useRef<VectorTileLayer<VectorTile<RenderFeature>, RenderFeature>[]>([]);
  const tileWmsLayer = useRef<ImageLayer<ImageWMS> | null>(null);
  const { onMoveEnd } = useMapHistoryStore();
  const { show } = useContextMenu({ id: MENU_ID });

  const { data: layerData } = useGetLayerList();

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

  const setSelectedFeatureStyle = async (feature: FeatureBase, layers: any[], isMultiple?: boolean) => {
    const geometryType = feature?.geometry?.type;
    const findLayerOfFeature = layers.find(item => item.value === feature.properties?.type);
    if (!mapRef.current || !visibleLayer.visible) {
      return;
    }
    const featureSelected = feature;
    if (geometryType === 'LineString' || geometryType === 'MultiLineString' || geometryType === 'Polygon') {
      if (featureSelected) {
        let lineFeature: Feature | null = null;
        if (geometryType === 'MultiLineString') {
          lineFeature = new Feature({
            geometry: new MultiLineString(featureSelected.geometry?.coordinates ?? []),
          });
        } else if (geometryType === 'LineString') {
          lineFeature = new Feature({
            geometry: new LineString(featureSelected.geometry?.coordinates ?? []),
          });
        } else if (geometryType === 'Polygon') {
          lineFeature = new Feature({
            geometry: new Polygon(featureSelected.geometry?.coordinates ?? []),
          });
        }
        lineFeature?.setStyle(selectedFeatureStyle);
        lineFeature?.setId(featureSelected.id);
        const featuresArr = lineFeature ? [lineFeature] : [];
        const lineLayer = new VectorLayer({
          source: new VectorSource({
            features: featuresArr,
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
    }
  };

  useEffect(() => {
    if (mapStore.selectedFeatures && layerData) {
      const currentZoom = mapRef.current?.getView()?.getZoom() ?? 0;
      const layers = layerData?.filter(item => item.minZoom <= currentZoom && currentZoom <= item.maxZoom);
      resetStyleImg();
      removePointSelected();
      mapStore.selectedFeatures.forEach(feature => {
        setSelectedFeatureStyle(feature, layers, mapStore.selectedFeatures.length > 1);
      });
    }
  }, [mapStore.selectedFeatures, layerData]);

  useEffect(() => {
    if (mapStore.map !== null && !!mapStore.map) {
      mapRef.current?.on('moveend', onMoveEnd);
      return () => {
        mapRef.current?.un('moveend', onMoveEnd);
      };
    }
  }, [mapStore.map]);

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

  const handleGetCenter = () => {
    const latLng = mapStore.getCenter();
    alert(JSON.stringify(latLng));
  };
  const handleGetZoom = (type: 'current' | 'min' | 'max') => () => {
    const zoom = mapStore.getZoom(type);
    const title = type === 'current' ? 'Zoom: ' : type === 'min' ? 'Min Zoom: ' : 'Max Zoom:';
    alert(title + zoom);
  };
  const refreshMap = () => {
    mapStore.refresh();
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
  const handleZoomIn = debounce(mapStore.zoomIn, 300);
  const handleZoomOut = debounce(mapStore.zoomOut, 300);
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
    // 모든 사용 가능한 레이어 목록
    const availableLayers = [
      'nodeBusinessPlan',
      'nodeExcavationSite', 
      'nodeGreenBelt',
      'nodePublicToilet',
      'nodeRoadsideTrees',
      'linkDsWay',
      'linkSafeWayHome',
      'polygonHump'
    ];

    let result = '=== 레이어 선택 가능 여부 ===\n\n';
    
    for (const layerId of availableLayers) {
      const layer = await mapStore.getLayerById(layerId);
      if (layer) {
        const isSelectable = layer.isSelectable();
        result += `${layerId}: ${isSelectable ? '✅ 선택 가능' : '❌ 선택 불가'}\n`;
      } else {
        result += `${layerId}: ❓ 레이어를 찾을 수 없음\n`;
      }
    }
    
    alert(result);
  };
  const getLayerProperties = async () => {
    // 모든 사용 가능한 레이어 목록
    const availableLayers = [
      'nodeBusinessPlan',
      'nodeExcavationSite', 
      'nodeGreenBelt',
      'nodePublicToilet',
      'nodeRoadsideTrees',
      'linkDsWay',
      'linkSafeWayHome',
      'polygonHump'
    ];

    let result = '=== 레이어 상세 정보 ===\n\n';
    
    for (const layerId of availableLayers) {
      const layer = await mapStore.getLayerById(layerId);
      if (layer) {
        const properties = layer.getProperties();
        const isSelectable = layer.isSelectable();
        const aliasName = layer.getAliasName();
        const tableName = layer.getTableName();
        
        result += `📋 ${layerId}\n`;
        result += `   선택 가능: ${isSelectable ? '✅' : '❌'}\n`;
        result += `   별칭: ${aliasName || '없음'}\n`;
        result += `   테이블명: ${tableName || '없음'}\n`;
        result += `   최소 줌: ${properties.minZoom || '없음'}\n`;
        result += `   최대 줌: ${properties.maxZoom || '없음'}\n`;
        result += `   가시성: ${properties.visible ? '보임' : '숨김'}\n`;
        result += `   편집 가능: ${properties.editable ? '가능' : '불가'}\n`;
        result += '\n';
      } else {
        result += `❓ ${layerId}: 레이어를 찾을 수 없음\n\n`;
      }
    }
    
    alert(result);
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
  };
  const clearAllLayers = () => {
    const layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
    if (layer) {
      layer.clearLayers();
    }
  };
  const clearSelectedLayer = () => {
    mapStore.clearSelectedFeatures?.();
    mapStore.setMode('select');
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
  const handleSetMode = (type: ModeDraw, options?: ModeOptions) => () => {
    if (type === 'select' || type === 'draw-end') {
      setDrawPolygon(false);
    } else {
      setDrawPolygon(true);
    }
    mapStore.setMode(type, options);
  };
  const handleSelection = (type: ModeSelector) => () => {
    if (!drawPolygon) {
      mapStore.setSelectorMode(type);
    }
  };
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
    mapStore.setMode('trail-edit', { feature: seletectedFeatures[0], geoType: 'LineString' });
  };

  // 지도 객체 생성 및 마운트 (OpenLayerMvt와 동일)
  useEffect(() => {
    if (!mapRef.current && !!mapStore.defaultOptions) {
      const initialMapBase = mapDawulayerBase(mapStore.defaultOptions);
      mapRef.current = initialMapBase;
      mapStore.setMap(initialMapBase);
      mapContainerRef.current?.addEventListener('contextmenu', event => {
        event.preventDefault();
        show({
          event,
          id: MENU_ID,
        });
      });
    }
  }, [mapStore.defaultOptions]);

  // fe처럼 무조건 zoom: 13, center: centerPointOL로 지도 생성
  useEffect(() => {
    mapStore.createMap(
      mapStore.defaultOptions?.target,
      {
        center: centerPointOL,
        zoom: 13,
      }
    );
  }, []);

  // [1] 레이어를 지도에 추가하는 함수 분리(fe_origin의 initLayer 참고)
  const initLayer = () => {
    if (mapRef.current && mapStore.layerData) {
      const zoom = Math.floor(mapRef.current?.getView()?.getZoom() ?? 0);
      setZoomDisplay(zoom);
      const isZoomForMVT = zoom >= 13;
      mapRef.current.highlightedLineLayer = [];
      mapRef.current.markerLayer = [];
      if (isZoomForMVT) {
        // 항상 기존 벡터타일 레이어 제거 후 새로 추가
        vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
        vectorTileLayers.current = mapStore.layerData.map(layer => {
          const vectorLayer = createVectorLayer(layer, mapStore.defaultStyles);
          if (themeCustom.layerName === layer.value) {
            vectorLayer.setThemematics({ customStyleName: themeCustom.stylesName });
          } else {
            vectorLayer.setDefaultStyle();
          }
          mapRef.current?.addLayer(vectorLayer);
          vectorLayer.setCurrentVisible(
            visibleLayer.layerName === layer.value ? visibleLayer.visible : !!layer.visible,
          );
          return vectorLayer;
        });
        if (tileWmsLayer.current) {
          tileWmsLayer.current.setVisible(false);
        }
      } else {
        // WMS 레이어 처리
        const layersFilter = mapStore.layerData
          .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
          .filter(item => item.visible);
        const styleNames = layersFilter.map(item => item.styleName);
        const layerNames = layersFilter.map(item => item.value);
        if (tileWmsLayer.current) {
          tileWmsLayer.current?.getSource()?.updateParams({ LAYERS: layerNames, STYLES: styleNames });
          tileWmsLayer.current.setVisible(true);
          tileWmsLayer.current?.getSource()?.refresh();
        } else {
          const newTileWmsLayer = createImageLayer(layerNames.join(','));
          mapRef?.current?.addLayer(newTileWmsLayer);
          tileWmsLayer.current = newTileWmsLayer;
        }
        vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
        vectorTileLayers.current = [];
      }
    }
  };

  // [2] mapStore.layerData, mapStore.defaultStyles, themeCustom이 준비되면 initLayer를 호출
  useEffect(() => {
    if (mapRef.current && mapStore.layerData && mapStore.defaultStyles) {
      initLayer();
      // 줌 변경 이벤트 핸들러 등록(중복 방지)
      const handleZoomChange = () => {
        initLayer();
      };
      mapRef.current.getView().on('change:resolution', handleZoomChange);
      return () => {
        mapRef.current?.getView().un('change:resolution', handleZoomChange);
      };
    }
  }, [mapStore.layerData, mapStore.defaultStyles, themeCustom]);

  // [줌 변경 이벤트에서 벡터타일 레이어를 무조건 새로 추가/제거]
  useEffect(() => {
    const { layerData: layerDataStore } = mapStore;
    if (mapRef.current && layerDataStore) {
      const handleZoomChange = () => {
        const zoom = Math.floor(mapRef.current?.getView()?.getZoom() ?? 0);
        setZoomDisplay(zoom);
        const isZoomForMVT = zoom >= 13;
        console.log('=== handleZoomChange ===');
        console.log('zoom:', zoom, 'isZoomForMVT:', isZoomForMVT);
        if (isZoomForMVT) {
          vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
          vectorTileLayers.current = layerDataStore.map(layer => {
            const vectorLayer = createVectorLayer(layer, mapStore.defaultStyles);
            mapRef.current?.addLayer(vectorLayer);
            console.log('addLayer:', layer.value, {
              minZoom: layer.minZoom,
              maxZoom: layer.maxZoom,
              visible: layer.visible,
              getVisible: vectorLayer.getVisible(),
            });
            return vectorLayer;
          });
          tileWmsLayer.current && tileWmsLayer.current.setVisible(false);
        } else {
          tileWmsLayer.current && tileWmsLayer.current.setVisible(true);
          vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
          vectorTileLayers.current = [];
        }
        // 현재 지도에 올라간 레이어 전체 출력
        console.log('map layers:', mapRef.current?.getLayers().getArray().map(l => l.get('layerName')));
      };
      mapRef.current.getView().on('change:resolution', handleZoomChange);
      // 최초에도 한 번 실행 (한 프레임 뒤에)
      setTimeout(() => {
        if (mapRef.current?.getView().getZoom() !== 13) {
          mapRef.current?.getView().setZoom(13);
        }
        handleZoomChange();
      }, 0);
      return () => {
        mapRef.current?.getView().un('change:resolution', handleZoomChange);
      };
    }
  }, [mapStore.layerData, visibleLayer, mapStore.defaultStyles, themeCustom]);

  // layerData와 mapStore.layerData 동기화
  useEffect(() => {
    if (layerData) {
      mapStore.setLayerData(layerData);
    }
  }, [layerData]);

  useEffect(() => {
    if (layerData) {
      // 최초 로딩 시 visible=true인 레이어만 체크 (undefined 제거)
      setCheckedLayers(layerData.filter(l => l.visible && typeof l.value === 'string').map(l => l.value as string));
    }
  }, [layerData]);

  // 전체 선택 체크박스 상태
  const allLayerValues = (layerData?.filter(l => typeof l.value === 'string').map(l => l.value as string)) ?? [];
  const isAllChecked = checkedLayers.length === allLayerValues.length && allLayerValues.length > 0;
  const isIndeterminate = checkedLayers.length > 0 && checkedLayers.length < allLayerValues.length;

  const handleCheckAll = (e: any) => {
    if (e.target.checked) {
      setCheckedLayers(allLayerValues);
      // 모든 벡터/타일 레이어 add, WMS updateParams
      if (layerData && mapRef.current) {
        if (vectorTileLayers.current && Array.isArray(vectorTileLayers.current)) {
          vectorTileLayers.current.forEach(layer => {
            if (!mapRef.current?.getLayers().getArray().includes(layer)) {
              mapRef.current?.addLayer(layer);
            }
          });
        }
        if (tileWmsLayer.current) {
          tileWmsLayer.current.getSource()?.updateParams({ LAYERS: allLayerValues.join(',') });
          tileWmsLayer.current.getSource()?.refresh();
          tileWmsLayer.current.setVisible(allLayerValues.length > 0);
        }
        layerData.forEach(layer => {
          if (typeof layer.value === 'string') {
            layer.visible = true;
          }
        });
      }
    } else {
      setCheckedLayers([]);
      // 모든 벡터/타일 레이어 remove, WMS updateParams
      if (layerData && mapRef.current) {
        if (vectorTileLayers.current && Array.isArray(vectorTileLayers.current)) {
          vectorTileLayers.current.forEach(layer => {
            if (mapRef.current?.getLayers().getArray().includes(layer)) {
              mapRef.current?.removeLayer(layer);
            }
          });
        }
        if (tileWmsLayer.current) {
          tileWmsLayer.current.getSource()?.updateParams({ LAYERS: '' });
          tileWmsLayer.current.getSource()?.refresh();
          tileWmsLayer.current.setVisible(false);
        }
        layerData.forEach(layer => {
          if (typeof layer.value === 'string') {
            layer.visible = false;
          }
        });
      }
    }
  };

  const handleLayerCheckboxChange = (checkedValues: any) => {
    const checked = checkedValues.filter((v: any) => typeof v === 'string') as string[];
    setCheckedLayers(checked);
    // 지도 레이어 add/remove 및 WMS updateParams
    if (layerData && mapRef.current) {
      // 1. 벡터타일/벡터레이어 add/remove
      if (vectorTileLayers.current && Array.isArray(vectorTileLayers.current)) {
        vectorTileLayers.current.forEach(layer => {
          const layerName = layer.get('layerName');
          if (typeof layerName === 'string') {
            if (checked.includes(layerName)) {
              if (!mapRef.current?.getLayers().getArray().includes(layer)) {
                mapRef.current?.addLayer(layer);
              }
            } else {
              if (mapRef.current?.getLayers().getArray().includes(layer)) {
                mapRef.current?.removeLayer(layer);
              }
            }
          }
        });
      }
      // 2. WMS LAYERS 파라미터 갱신
      if (tileWmsLayer.current) {
        tileWmsLayer.current.getSource()?.updateParams({ LAYERS: checked.join(',') });
        tileWmsLayer.current.getSource()?.refresh();
        // WMS 레이어 자체의 visible도 동기화
        tileWmsLayer.current.setVisible(checked.length > 0);
      }
      // 3. layerData.visible 동기화
      layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = checked.includes(layer.value);
        }
      });
    }
  };

  return (
    <div className="container mx-auto h-full">
      <div className="my-5 flex flex-col gap-2">
        {/* 상단 체크박스 레이어 선택 UI */}
        <div>레이어 선택</div>
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={handleCheckAll}
        >전체 선택</Checkbox>
        <Checkbox.Group
          options={layerData
            ?.filter(l => typeof l.value === 'string' && typeof l.label === 'string')
            .map(l => ({ label: l.label as string, value: l.value as string })) ?? []}
          value={checkedLayers}
          onChange={handleLayerCheckboxChange}
        />
      </div>
      <div className="my-5 flex  items-center gap-4">
        {/* <SelectSsgByCode sidoId={sido} /> */}
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