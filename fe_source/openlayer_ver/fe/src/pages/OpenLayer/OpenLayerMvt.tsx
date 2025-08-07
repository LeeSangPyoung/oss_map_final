/* eslint-disable react-hooks/exhaustive-deps */
import { Collection, Feature, MapBrowserEvent } from 'ol';
import { useEffect, useRef, useState } from 'react';
import { useGetLayerList } from '~/assets/Home/services/useGetLayers';
import { mapDawulayerBase } from '~/assets/OpenLayer/utils/dawulerLayer';
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
} from '~/assets/OpenLayer/utils/mvtLayers';
import { Button, Checkbox } from 'antd';
import { MyMapRef } from '~/models/MapBase';
import { getFeatureById, getFeaturesFromWFS, getListFeaturesInPixel } from '~/assets/OpenLayer/services/getFeatures';
import { LineString, MultiLineString, Point, Polygon } from 'ol/geom';
import { FeatureBase } from '~/models/Coords';
import { centerPointOL, listButton, listButton2 } from '~/utils/common';
import { useGetLayerStyles } from '~/assets/Home/services/useGetStylesLayers';
import { ModeDraw, ModeOptions, ModeSelector } from '~/models/ModeDraw';
import { useRectangelSelection } from '~/assets/OpenLayer/hooks/useRectangleSelection';
import { useSelectionCircle } from '~/assets/OpenLayer/hooks/useCircleSelection';
import { usePolygonSelection } from '~/assets/OpenLayer/hooks/usePolygonSelection';
import { LayerModel } from '~/models/Layer';
import { useTrailDistance } from '~/assets/OpenLayer/hooks/useTrailDistance';
import { Draw, Modify, Snap } from 'ol/interaction';
import { useMapHistoryStore } from '~/store/useHistoryStore';
import { useTrailArea } from '~/assets/OpenLayer/hooks/useTrailArea';
import { useTrailSimple } from '~/assets/OpenLayer/hooks/useTrailSimple';
import { useAreaDraw } from '~/assets/OpenLayer/hooks/useAreaDraw';
import { useTrailDraw, useTrailDrawPoint, useTrailDrawPolygon } from '~/assets/OpenLayer/hooks/useTrailDraw';
import LayerGroup from 'ol/layer/Group';
import { MyEvents } from '~/main';
import { FeatureData } from '~/assets/OpenLayer/utils/customVectorLayer';
import { CustomVectorTileLayer } from '~/assets/OpenLayer/utils/customTileLayer';
import ModifyFeature from 'ol-ext/interaction/ModifyFeature';
import { boundaryStyle, nodeStylesTrailEdit, updateFeatureStyle } from '~/assets/OpenLayer/utils/stylesFeature';
import {
  calculateDistance,
  calculateDistanceToSegment,
  generateSegmentsFromPolygon,
} from '~/assets/OpenLayer/utils/common';
import proj4 from 'proj4';
import { useLayerStore } from '~/store/useLayer';
import { Item, Menu, useContextMenu } from 'react-contexify';

const MENU_ID = 'MENU_OPEN_LAYER';

export default function OpenLayerMvt() {
  const mapStore = useMapbase();
  const [zoom, setZoomDisplay] = useState(13);
  const [drawPolygon, setDrawPolygon] = useState(false);
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

  const { startSelectorFeature } = useRectangelSelection({
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

  const { startCircleSelection } = useSelectionCircle({
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
            geometry: new MultiLineString(featureSelected.geometry?.coordinates ?? []), // 전체 MultiLineString 사용
          });
        } else if (geometryType === 'LineString') {
          lineFeature = new Feature({
            geometry: new LineString(featureSelected.geometry?.coordinates ?? []), // 전체 MultiLineString 사용
          });
        } else if (geometryType === 'Polygon') {
          lineFeature = new Feature({
            geometry: new Polygon(featureSelected.geometry?.coordinates ?? []), // 전체 Polygon 사용
          });
        }
        lineFeature?.setStyle(selectedFeatureStyle);
        lineFeature?.setId(featureSelected.id);

        const lineLayer = new VectorLayer({
          source: new VectorSource({
            features: lineFeature ? [lineFeature] : [],
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

  const handleSelectedFeatureImg = async (event: MapBrowserEvent<any>) => {
    if (!mapRef.current) return;
    
    // OpenLayers의 getFeaturesAtPixel을 사용하여 정확한 feature 선택
    const features = mapRef.current.getFeaturesAtPixel(event.pixel);
    
    if (features && features.length > 0) {
      // 첫 번째 feature 선택 (가장 위에 있는 feature)
      const feature = features[0];
      const featureData = feature.getProperties();
      const geometry = feature.getGeometry();
      
      if (featureData && geometry) {
        try {
          const coordinates = (geometry as any).getCoordinates();
          const geometryType = (geometry as any).getType();
          
          if (coordinates && geometryType) {
            const selectedFeature = {
              id: `${feature.getId() || Date.now()}`,
              geometry: {
                coordinates: coordinates,
                type: geometryType,
              },
              properties: featureData,
            };
            
            mapStore.setSelectedFeatures([selectedFeature]);
          }
        } catch (error) {
          console.warn('Error getting feature geometry:', error);
        }
      }
    } else {
      console.log('No features found at pixel');
      mapStore.clearSelectedFeatures?.();
    }
  };

  const handleClick = (event: MapBrowserEvent<any>) => {
    if (!!drawPolygon) {
      return;
    }
    handleSelectedFeatureImg(event);
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

  // Khởi tạo map

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

  // load layer when  change zoom
  useEffect(() => {
    const { layerData: layerDataStore } = mapStore;
    if (mapRef.current && layerDataStore) {
      const handleZoomChange = () => {
        const zoom = Math.floor(mapRef.current?.getView().getZoom() ?? 0);
        setZoomDisplay(zoom);
        const isZoomForMVT = zoom >= 13;
        if (tileWmsLayer.current) {
          tileWmsLayer.current.setVisible(!isZoomForMVT);
        }
        if (isZoomForMVT && vectorTileLayers.current.length === 0) {
          vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
          vectorTileLayers.current = layerDataStore.map(layer => {
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
        } else if (!isZoomForMVT) {
          const layersFilter = layerDataStore
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
      };

      mapRef.current?.getView().on('change:resolution', handleZoomChange);

      return () => {
        mapRef.current?.getView().un('change:resolution', handleZoomChange);
      };
    }
  }, [mapStore.layerData, visibleLayer, mapStore.defaultStyles, themeCustom]);

  const initLayer = () => {
    if (mapRef.current && layerData) {
      mapStore.setLayerData(
        layerData.map(item => ({
          ...item,
          optionsStyle: dataStyles?.find(it => it.styleName === item.value)?.options,
          styleName: dataStyles?.find(it => it.id === item.styleId)?.styleName,
          visible: true, // 모든 레이어를 항상 visible로 강제
        })),
      );
      mapStore.setDefaultStyles(dataStyles ?? []);
      // vectorDrawRef.current.set('id', 'drawLayer');
      // mapRef.current.addLayer(vectorDrawRef.current);
      const zoom = Math.floor(mapRef.current?.getView().getZoom() ?? 0);
      const isZoomForMVT = zoom >= 13;
      mapRef.current.highlightedLineLayer = [];
      mapRef.current.markerLayer = [];
      if (isZoomForMVT) {
        vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
        vectorTileLayers.current = layerData.map(layer => {
          const vectorLayer = createVectorLayer({ ...layer, visible: true }, dataStyles);
          mapRef.current?.addLayer(vectorLayer);
          vectorLayer.setCurrentVisible(true);
          return vectorLayer;
        });
        tileWmsLayer.current && tileWmsLayer.current.setVisible(false);
      } else {
        const layerName = layerData
          .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
          .map(item => item.value)
          .join(',');
        if (tileWmsLayer.current) {
          tileWmsLayer.current?.getSource()?.updateParams({ LAYERS: layerName });
          tileWmsLayer.current.setVisible(true);
          tileWmsLayer.current?.getSource()?.refresh();
        } else {
          const newTileWmsLayer = createImageLayer(layerName);
          mapRef?.current.addLayer(newTileWmsLayer);
          tileWmsLayer.current = newTileWmsLayer;
        }
        vectorTileLayers.current.forEach(layer => mapRef.current?.removeLayer(layer));
        vectorTileLayers.current = [];
      }
    }
  };

  useEffect(() => {
    MyEvents.on('setVisibleLayer', payload => {
      setVisibleLayer(payload);
      tileWmsLayer.current?.getSource()?.refresh();
      // tileWmsLayer.current?.setVisible(payload);
    });
    MyEvents.on('layerRefresh', () => {
      tileWmsLayer.current?.getSource()?.refresh();
    });
    return () => {
      MyEvents.off('setVisibleLayer', _ => {
        setVisibleLayer({
          layerName: '',
          visible: false,
        });
        // tileWmsLayer.current?.setVisible(false);
      });
    };
  }, []);

  useEffect(() => {
    initLayer();
  }, [layerData, dataStyles]);

  useEffect(() => {
    if (!isEmpty(mapStore.layerData)) {
      mapRef.current?.on('click', handleClick);
      return () => {
        mapRef.current?.un('click', handleClick); // Clean up previous handler on `selected` change
      };
    }
  }, [drawPolygon, mapStore.layerData, mapRef.current]);

  useEffect(() => {
    if (!isEmpty(mapStore.layerData)) {
      switch (mapStore.selectorMode) {
        case 'RECT':
          startSelectorFeature(mapStore.layerData);
          break;
        case 'CIRCLE':
          startCircleSelection(mapStore.layerData);
          break;
        case 'POLYGON':
          startPolygonSelection(mapStore.layerData);
          break;
        default:
          return;
      }
    }
  }, [mapStore.selectorMode, mapStore.layerData]);

  useEffect(() => {
    if (!!mapStore.drawMode?.mode) {
      const geoType = mapStore.drawMode.options?.geoType;
      const options = mapStore.drawMode.options?.areaDrawOption;
      const layers =
        mapRef.current
          ?.getLayers()
          .getArray()
          .filter(item => item instanceof VectorLayer || item instanceof LayerGroup) ?? [];
      switch (mapStore.drawMode.mode) {
        case 'trail-distance':
          return startTrailDistance();
        case 'trail-area':
          return startTrailArea();
        case 'trail-simple':
          return startDrawSimple();
        case 'area-draw':
          return options ? startDrawRect(options) : undefined;
        case 'trail-draw':
          return geoType === 'LineString'
            ? startTrailDraw()
            : geoType === 'Point'
              ? startDrawPoint()
              : startTrailPolygon();
        case 'draw-end':
          return;
        case 'select':
          // eslint-disable-next-line no-case-declarations
          const interactions = mapRef.current
            ?.getInteractions()
            .getArray()
            .filter(item => {
              return item instanceof Draw || item instanceof Modify;
            });
          setDrawPolygon(false);
          interactions?.forEach(item => item.setActive(false));
          layers?.forEach(layer => {
            mapRef.current?.removeLayer(layer);
          });
          return;
        default:
          return;
      }
    }
  }, [mapStore.drawMode]);

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
      // setThemeCustom({
      //   layerName: layer.get('layerName'),
      //   stylesName: 'polygonHump-custom',
      // });
      layer?.setUserStyleConfig({
        customStyleName: 'polygonHump-custom',
      });
    }
  };

  const handleSetDefaultStyle = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    setThemeCustom({
      layerName: '',
      stylesName: '',
    });
    if (layer) {
      layer.setUserStyleConfig(null);
    }
  };

  const handleSetThemematics = async () => {
    const layer = await mapStore.getLayerById('polygonHump');
    if (layer) {
      setThemeCustom({
        layerName: layer.get('layerName'),
        stylesName: 'polygon-thematics',
      });
      layer.setThemematics({ customStyleName: 'polygon-thematics' });
    }
  };

  const handleZoomIn = debounce(mapStore.zoomIn, 300);
  const handleZoomOut = debounce(mapStore.zoomOut, 300);
  const clearSelectedLayer = () => {
    mapStore.clearSelectedFeatures?.();
    mapStore.setMode('select');
  };

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

  const handleGetSelectedFeatures = () => {
    const selectedFeatures = mapStore.getSelectedFeatures();
    if (selectedFeatures) {
      // console.log({ selectedFeatures });
      alert(JSON.stringify(selectedFeatures));
    }
  };

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

  const handleTrailEdit = async () => {
    if (isEmpty(mapStore.selectedFeatures) || mapStore.selectedFeatures.length > 1) {
      alert('Please select a trail feature to edit.');
      return;
    }
    const seletectedFeatures = mapStore.getSelectedFeatures();
    mapStore.setMode('trail-edit', { feature: seletectedFeatures[0] });
  };

  const onEditShape = async () => {
    setDrawPolygon(true);
    const zoom = mapRef.current?.getView().getZoom() ?? 0;
    const featureSelected = mapStore.selectedFeatures[0];
    const geometryType = featureSelected.geometry?.type;
    const featureId =
      geometryType === 'Polygon' ? featureSelected.properties?.polygon_id : featureSelected.properties?.link_id;

    if (featureSelected && zoom >= 13 && mapRef.current?.highlightedLineLayer) {
      const featureEdit: Feature = mapRef.current?.highlightedLineLayer[0]
        ?.getSource()
        ?.getFeatureById(featureSelected.id);
      const extent = mapRef.current?.getView()?.calculateExtent(mapRef.current.getSize());
      const layerNames = mapRef.current
        ?.getLayers()
        .getArray()
        .filter(layer => layer instanceof CustomVectorTileLayer)
        .filter(item => item.get('layerName') !== 'performanceTest')
        .map(layer => layer.get('layerName'))
        .filter(name => name);
      const allFeatures = extent ? await getFeaturesFromWFS(extent, layerNames) : [];

      const highlightedLayer = mapRef.current?.highlightedLineLayer[0];
      if (highlightedLayer) {
        const source = highlightedLayer.getSource() as VectorSource;
        source.clear();
        featureEdit.setStyle([boundaryStyle, nodeStylesTrailEdit]);
        source.addFeature(featureEdit);
      }
      const snappedNodes = new Set<string>();

      const filteredFeatures = allFeatures.filter(feature => {
        const properties = feature.getProperties();
        return !(
          properties?.node_id === featureId ||
          properties?.link_id === featureId ||
          properties?.polygon_id === featureId
        );
      });
      // Lọc các feature chưa được thêm vào snapSource
      const newFeaturesToSnap = filteredFeatures.filter(feature => {
        const featureId = feature.getId();
        return featureId && !addedFeatureIdsRef.current.has(featureId);
      });

      newFeaturesToSnap.forEach(feature => {
        snapSource.current.addFeature(feature);
        addedFeatureIdsRef.current.add(feature.getId());
      });

      const modify = new ModifyFeature({
        features: new Collection([featureEdit]),
        style: feature => {
          updateFeatureStyle(feature, snappedNodes);
          return feature.getStyle();
        },
      });
      const snap = new Snap({
        source: snapSource.current,
        edge: true, // 선분에도 스냅 가능
        vertex: true, // 꼭짓점에도 스냅 가능
        pixelTolerance: 5,
      });
      modify.on('modifying', event => {
        const modifyingFeature = event.features[0];
        const movingNode = event.coordinate;
        // 스냅 여부 확인
        const overlappingFeatures = snapSource.current.getFeatures().filter(otherFeature => {
          const otherGeometry = otherFeature.getGeometry();
          if (!otherGeometry) {
            return false;
          }
          const coords = otherGeometry.getCoordinates();

          // 폴리곤의 경우: 외곽 링 선분 생성 및 거리 계산
          if (otherGeometry.getType() === 'Polygon') {
            const segments = generateSegmentsFromPolygon(coords);
            return segments.some(segment => calculateDistanceToSegment(movingNode, segment) < 1);
          }

          // 포인트의 경우: 기본 거리 계산
          if (otherGeometry.getType() === 'Point') {
            return calculateDistance(movingNode, coords) < 1;
          }

          return false; // 처리하지 않는 타입
        });

        if (overlappingFeatures.length > 0) {
          snappedNodes.add(movingNode.toString());
        } else {
          snappedNodes.delete(movingNode.toString());
        }
        updateFeatureStyle(modifyingFeature, snappedNodes);
      });

      snap.on('snap', event => {
        const vertex = event.vertex; // 스냅된 좌표는 vertex로 제공됨
        if (!vertex || !Array.isArray(vertex)) {
          console.warn('Snap detected, but no valid vertex found.');
          return; // 좌표가 없거나 잘못된 경우 처리 중단
        }
        snappedNodes.add(vertex.toString()); // 좌표를 문자열로 저장
        updateFeatureStyle(featureEdit, snappedNodes); // 스타일 업데이트
      });
      mapRef.current?.addInteraction(modify);
      mapRef.current?.addInteraction(snap);

      // Thêm listener cho moveend để cập nhật snapSource
      const handleMoveEnd = async () => {
        const newExtent = mapRef.current?.getView().calculateExtent(mapRef.current.getSize());
        const newLayerNames = mapRef.current
          .getLayers()
          .getArray()
          .filter(layer => layer instanceof CustomVectorTileLayer)
          .filter(item => item.get('layerName') !== 'performanceTest')
          .map(layer => layer.get('layerName'))
          .filter(name => name);

        const newFeatures = newExtent ? await getFeaturesFromWFS(newExtent, newLayerNames) : [];

        // Lọc các feature chưa được thêm vào snapSource
        const newFeaturesToSnap = newFeatures.filter(feature => {
          const featureId = feature.getId();
          return featureId && !addedFeatureIdsRef.current.has(featureId);
        });

        // Thêm các feature mới vào snapSource và cập nhật Set
        newFeaturesToSnap.forEach(feature => {
          snapSource.current?.addFeature(feature);
          addedFeatureIdsRef.current.add(feature.getId());
        });
      };

      // Debounce để tối ưu hiệu suất khi map di chuyển liên tục
      const debouncedHandleMoveEnd = debounce(handleMoveEnd, 300);
      mapRef.current?.on('moveend', debouncedHandleMoveEnd);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          mapRef.current?.removeInteraction(modify);
          mapRef.current?.removeInteraction(snap);
          debouncedHandleMoveEnd.cancel();
          mapStore.setMode('select');
          // if (highlightedLayer) {
          //   highlightedLayer.getSource()?.clear();
          //   mapRef.current?.removeLayer(highlightedLayer);
          // }

          document.removeEventListener('keydown', handleKeyDown);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        mapRef.current?.removeInteraction(modify);
        mapRef.current?.removeInteraction(snap);
        mapRef.current?.un('moveend', debouncedHandleMoveEnd);
        debouncedHandleMoveEnd.cancel();
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  };

  useEffect(() => {
    if (mapStore.editFeature) {
      onEditShape();
    }
  }, [mapStore.editFeature]);

  useEffect(() => {
    if (mapStore.isRefresh) {
      const view = mapRef.current?.getView();
      view?.setCenter(proj4('EPSG:4326', 'EPSG:5179', mapStore.defaultOptions?.mapOptions?.center));
      view?.setZoom(mapStore.defaultOptions?.mapOptions?.zoom ?? 0);
      setThemeCustom({
        layerName: '',
        stylesName: '',
      });
      resetHistory?.();
      mapStore.setMode('select');
      mapRef.current?.getLayers().forEach(layer => {
        if (layer instanceof LayerGroup && layer.get('id')) {
          mapRef.current?.removeLayer(layer);
        }
      });
      useLayerStore.getState().clearLayers();
      mapStore.setSelectorMode('RECT');
      setTimeout(() => {
        mapStore.setRefresh();
      }, 200);
    }
    return () => {
      mapStore.setRefresh();
    };
  }, [mapStore.isRefresh]);

  const handleGetTrailCoords = () => {
    const trailCoords = mapStore.getTrailCoordinates();
    alert(JSON.stringify(trailCoords));
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

  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);

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
            if (!mapRef.current.getLayers().getArray().includes(layer)) {
              mapRef.current.addLayer(layer);
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
            if (mapRef.current.getLayers().getArray().includes(layer)) {
              mapRef.current.removeLayer(layer);
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
              if (!mapRef.current.getLayers().getArray().includes(layer)) {
                mapRef.current.addLayer(layer);
              }
            } else {
              if (mapRef.current.getLayers().getArray().includes(layer)) {
                mapRef.current.removeLayer(layer);
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
          layer.visible = checked.includes(layer.value);
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
