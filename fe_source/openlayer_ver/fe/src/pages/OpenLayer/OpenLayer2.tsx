// /* eslint-disable react-hooks/exhaustive-deps */
// import { Collection, Feature, Map } from 'ol';
// import { useEffect, useRef } from 'react';
// import { useGetLayerList } from '~/packages/Home/services/useGetLayers';
// import { mapDawulayerBase, onTransformLayer } from '~/packages/OpenLayer/utils/dawulerLayer';
// import { useMapHistoryStore } from '~/store/useHistoryStore';
// import { useMapbase } from '~/store/useMapbase';
// import { isEmpty, get, includes, delay, omit } from 'lodash';
// import { Item, Menu, useContextMenu } from 'react-contexify';
// import 'react-contexify/dist/ReactContexify.css';
// import { Button } from 'antd';
// import VectorLayer from 'ol/layer/Vector';
// import { FeatureBase } from '~/models/Coords';
// import VectorSource from 'ol/source/Vector';
// import { createSelectedStyle } from '~/packages/OpenLayer/utils/selectedStyle';
// import { useTrailDistance } from '~/packages/OpenLayer/hooks/useTrailDistance';
// import { useTrailArea } from '~/packages/OpenLayer/hooks/useTrailArea';
// import { useRectangelSelection } from '~/packages/OpenLayer/hooks/useRectangleSelection';
// import { useGetLayerStyles } from '~/packages/Home/services/useGetStylesLayers';
// import { useSelectionCircle } from '~/packages/OpenLayer/hooks/useCircleSelection';
// import { usePolygonSelection } from '~/packages/OpenLayer/hooks/usePolygonSelection';
// import { useTrailSimple } from '~/packages/OpenLayer/hooks/useTrailSimple';
// import { Fill, Stroke, Style } from 'ol/style';
// import CircleStyle from 'ol/style/Circle';
// import { LineString, Point } from 'ol/geom';
// import proj4 from 'proj4';
// import { centerPointOL, listButton, listButton2 } from '~/utils/common';
// import { useAreaDraw } from '~/packages/OpenLayer/hooks/useAreaDraw';
// import { useTrailDraw, useTrailDrawPoint, useTrailDrawPolygon } from '~/packages/OpenLayer/hooks/useTrailDraw';
// import { useMapSelection } from '~/packages/OpenLayer/hooks/useMapSelection';
// import { ModeDraw, ModeOptions, ModeSelector } from '~/models/ModeDraw';
// import { CustomVectorLayer } from '~/packages/OpenLayer/utils/customVectorLayer';
// import { Draw, Modify } from 'ol/interaction';
// import useDeepCompareEffect from '~/hooks/useDeepCompareEffect';

// // Khởi tạo vector draw
// const vectorSource = new VectorSource();
// const vectorLayerDraw = new VectorLayer({
//   source: vectorSource,
// });
// vectorLayerDraw.set('id', 'drawLayer');

// const MENU_ID = 'MENU_OPEN_LAYER';
// export default function OpenLayer2() {
//   const mapStore = useMapbase();
//   const mapRef = useRef<Map | null>(null); // Dùng useRef để lưu map đã khởi tạo
//   const mapContainerRef = useRef<HTMLDivElement>(null);

//   // const [selectInteract, setSelectInteract] = useState<Select | null>(null);

//   const { show } = useContextMenu({ id: MENU_ID });
//   const { initSelect, selectInteraction } = useMapSelection();
//   const { data } = useGetLayerList();
//   const { data: dataStyles } = useGetLayerStyles();

//   const { onMoveEnd } = useMapHistoryStore();

//   const { startDrawing: startTrailDistance } = useTrailDistance({
//     map: mapStore.map,
//     vectorSource,
//   });
//   const { startDrawing: startTrailArea } = useTrailArea({
//     map: mapStore.map,
//     vectorSource,
//   });

//   const { startDrawSimple } = useTrailSimple({ map: mapStore.map, vectorSource });
//   const { startDraw: startDrawRect } = useAreaDraw({
//     map: mapStore.map,
//     vectorSource,
//   });

//   const { startDraw: startTrailDraw } = useTrailDraw({ map: mapStore.map, vectorSource });
//   const { startDraw: startTrailPolygon } = useTrailDrawPolygon({ map: mapStore.map });
//   const { startDraw: startDrawPoint } = useTrailDrawPoint({ map: mapStore.map });
//   const { startSelectorFeature } = useRectangelSelection({
//     map: mapStore.map,
//   });

//   const { startCircleSelection } = useSelectionCircle({ map: mapStore.map });
//   const { startPolygonSelection } = usePolygonSelection({ map: mapStore.map });

//   function createStyleLayer(layerIds: string[]) {
//     delay(() => {
//       const layers2 = mapRef.current?.getLayers().getArray();
//       const vectorLayers = layers2?.filter(layer =>
//         includes(layerIds, layer.get('id')),
//       ) as unknown as CustomVectorLayer[];
//       vectorLayers?.forEach(layer => {
//         const findStyle = dataStyles?.find(item => item.styleName === layer.get('id'));
//         if (findStyle) {
//           const style = JSON.parse(findStyle?.layout);
//           const option = {
//             opacity: get(style, 'circle-opacity', 1),
//             color: get(style, 'circle-color', 'blue'),
//             weight: get(style, 'line-width', 1),
//             fillColor: get(style, 'fill-color', '#333'),
//             radius: get(style, 'circle-radius', 2),
//             lineColor: get(style, 'line-color', '#333'),
//           };
//           const type: any = {
//             MULTILINESTRING: 'LINE',
//             POLYGON: 'POLYGON',
//             POINT: 'POINT',
//           };
//           layer.setDefaultStyle({
//             type: type[layer.get('geometryType')],
//             options: option,
//           });
//         }
//       });
//     }, 1000);
//   }

//   useDeepCompareEffect(() => {
//     if (!!data && mapRef.current) {
//       const layers = onTransformLayer(data);
//       layers?.forEach(layer => {
//         mapRef.current?.addLayer(layer);
//       });
//       const layerIds = data.map(item => item.value ?? '');
//       createStyleLayer(layerIds);
//       initSelect({ map: mapRef.current, layers: [vectorLayerDraw, ...layers] });
//       return () => {
//         layers.forEach(layer => {
//           mapRef.current?.removeLayer(layer);
//         });
//       };
//     }
//   }, [mapRef.current, data]);

//   useEffect(() => {
//     if (!!selectInteraction) {
//       selectInteraction?.on('select', event => {
//         if (isEmpty(event.selected)) {
//           mapStore.setSelectedFeatures([]);
//         }
//         event.selected.forEach(feature => {
//           if (feature.getGeometry()?.getType() === 'Point') {
//             feature.setStyle(createSelectedStyle(feature));
//           } else {
//             // setSelected(feature);
//           }
//           const geometryType = feature.getGeometry()?.getType();
//           const mode = feature.get('mode');

//           if (geometryType && !mode) {
//             const featureState: FeatureBase = {
//               id: feature.get('property'),
//               type: 'Geometry',
//               geometry: {
//                 type: feature.getGeometry()?.getType() ?? '',
//                 // @ts-ignore
//                 coordinates: feature.getGeometry()?.getCoordinates(),
//               },
//               nativeFeature: feature,
//               isSelected: true,
//             };
//             event.selected.length === 1
//               ? mapStore.setSelectedFeatures([featureState])
//               : mapStore.setSelectedFeatures(
//                 event.selected.map(item => ({
//                   id: item.get('property'),
//                   type: 'Geometry',
//                   geometry: {
//                     type: item.getGeometry()?.getType() ?? '',
//                     // @ts-ignore
//                     coordinates: item.getGeometry()?.getCoordinates(),
//                   },
//                   nativeFeature: item,
//                   isSelected: true,
//                 })),
//               );
//           }
//         });

//         event.deselected.forEach(feature => {
//           if (feature.getGeometry()?.getType() === 'Point') {
//             feature.setStyle(undefined);
//           }
//           // mapStore?.clearSelectedFeatures?.();
//         });
//       });
//     }
//   }, [selectInteraction]);

//   useEffect(() => {
//     if (mapStore.editFeature) {
//       const newCollection = new Collection([mapStore.editFeature]);
//       const modify = new Modify({
//         features: newCollection,
//         insertVertexCondition: function () {
//           // @ts-ignore
//           return /Polygon/.test(mapStore.editFeature?.getGeometry()?.getType());
//         },
//       });
//       mapRef.current?.addInteraction(modify);
//     }
//   }, [selectInteraction, mapStore.editFeature]);

//   // Add history move map
//   useEffect(() => {
//     if (mapStore.map !== null && !!mapStore.map) {
//       mapStore.map.on('moveend', onMoveEnd);
//       return () => {
//         mapStore?.map?.un('moveend', onMoveEnd);
//       };
//     }
//   }, [mapStore.map]);

//   // Khởi tạo map

//   useEffect(() => {
//     if (!mapRef.current && !!mapStore.defaultOptions) {
//       const initialMapBase = mapDawulayerBase(mapStore.defaultOptions);
//       mapRef.current = initialMapBase;
//       mapStore.setMap(initialMapBase);
//       mapRef.current.addLayer(vectorLayerDraw);
//       mapContainerRef.current?.addEventListener('contextmenu', event => {
//         event.preventDefault();
//         show({
//           event,
//           id: MENU_ID,
//         });
//       });
//     }
//   }, [mapStore.defaultOptions]);

//   useEffect(() => {
//     if (mapStore.isRefresh) {
//       mapRef.current?.setTarget(undefined);
//       // const layers = mapRef.current?.getLayers().getArray();
//       // layers?.forEach(layer => mapRef.current?.removeLayer(layer));
//       mapRef.current = null;
//       setTimeout(() => {
//         const initialMapBase = mapDawulayerBase(mapStore.defaultOptions);
//         mapRef.current = initialMapBase;
//         mapRef.current.addLayer(vectorLayerDraw);
//         // mapRef.current.addLayer(circleLayer);
//         mapStore.setMap(initialMapBase);
//       }, 200);
//     }
//   }, [mapStore.isRefresh]);

//   useEffect(() => {
//     if (!!mapStore.drawMode?.mode) {
//       const geoType = mapStore.drawMode.options?.geoType;
//       const options = mapStore.drawMode.options?.areaDrawOption;

//       switch (mapStore.drawMode.mode) {
//         case 'trail-distance':
//           return startTrailDistance();
//         case 'trail-area':
//           return startTrailArea();
//         case 'trail-simple':
//           return startDrawSimple();
//         case 'area-draw':
//           return options ? startDrawRect(options) : undefined;
//         case 'trail-draw':
//           return geoType === 'LineString'
//             ? startTrailDraw()
//             : geoType === 'Point'
//               ? startDrawPoint()
//               : startTrailPolygon();
//         case 'select':
//           // eslint-disable-next-line no-case-declarations
//           const interactions = mapStore.map
//             ?.getInteractions()
//             .getArray()
//             .filter(item => {
//               return item instanceof Draw || item instanceof Modify;
//             });
//           interactions?.forEach(item => mapRef.current?.removeInteraction(item));
//           return;
//         default:
//           return;
//       }
//     }
//   }, [mapStore.drawMode]);

//   const handleGetCenter = () => {
//     const latLng = mapStore.getCenter();
//     alert(JSON.stringify(latLng));
//   };

//   const handleGetZoom = (type: 'current' | 'min' | 'max') => () => {
//     const zoom = mapStore.getZoom(type);
//     const title = type === 'current' ? 'Zoom: ' : type === 'min' ? 'Min Zoom: ' : 'Max Zoom:';
//     alert(title + zoom);
//   };

//   const refreshMap = () => {
//     mapStore.refresh();
//   };
//   const panToView = () => {
//     mapStore.panTo([126.76202, 37.68216]);
//   };

//   const panToView2 = () => {
//     mapStore.panTo([126.76202, 37.68216], 10);
//   };

//   const handleFitBounds = () => {
//     mapStore.fitBounds({ min: [126.937554, 37.523505], max: [127.03003, 37.577724] });
//   };

//   const handleGetLayerById = (id: string) => () => {
//     const layer = mapStore.getLayerById(id);
//     alert(id);
//     return layer;
//   };
//   const handleGetLayerAlias = () => {
//     const layer = mapStore.getLayerById('polygonHump');
//     const alias = layer?.getAliasName();
//     alert('Alias: ' + alias);
//   };

//   const handleGetTableName = () => {
//     const layer = mapStore.getLayerById('polygonHump');
//     const tableName = layer?.getTableName();
//     alert('Table Name: ' + tableName);
//   };
//   const isSelectableLayer = () => {
//     const myLayer = mapStore.getLayerById('polygonHump');
//     const isSelectable = myLayer?.isSelectable();
//     alert('Layer  is selectable: ' + isSelectable);
//   };
//   const getLayerProperties = () => {
//     const myLayer = mapStore.getLayerById('polygonHump');
//     const properties: any = myLayer?.getProperties();
//     const objDisplay = {
//       id: properties.id,
//       aliasName: properties.aliasName,
//       isSelectable: properties.isSelectable,
//       tableName: properties.tableName,
//       minZoom: properties.minZoom,
//       maxZoom: properties.maxZoom,
//       visible: properties.visible,
//       type: properties.type,
//       geometryType: properties.geometryType,
//     };
//     alert(JSON.stringify(objDisplay));
//   };

//   const handleGetZoomLayer = (type: string) => () => {
//     const myLayer = mapStore.getLayerById('polygonHump');
//     type === 'min' ? alert('Min zoom: ' + myLayer?.getMinZoom()) : alert('Max zoom: ' + myLayer?.getMaxZoom());
//   };

//   const showLayer = () => {
//     const myLayer = mapStore.getLayerById('polygonHump');
//     if (!myLayer) {
//       return;
//     }
//     const layers = mapRef.current?.getLayers().getArray();
//     const vectorLayers = layers?.filter(item => !!item.get('id'));
//     vectorLayers?.forEach(item => item.setVisible(!item.getVisible()));
//     // myLayer?.getVisible() ? myLayer?.setVisible(false) : myLayer?.setVisible(true);
//   };

//   const refreshLayer = () => {
//     const layers = mapRef.current?.getLayers().getArray();
//     const vectorLayers = layers?.filter(item => !!item.get('id')) as CustomVectorLayer[];
//     console.log("vector layer: ", vectorLayers)

//     vectorLayers?.forEach(item => {
//       console.log("Item source: ", item.getSource())
//       item.getSource()?.refresh()
//     });
//   };

//   const handleHistoryAction = (type: 'back' | 'forward') => () => {
//     mapStore.onHistoryAction(type);
//   };

//   const addLayer = () => {
//     let layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
//     if (!layer) {
//       layer = mapStore.addCustomLayerByName('TEST_USER_LAYER');
//     }
//     const pointStyle = new Style({
//       image: new CircleStyle({
//         radius: 10,
//         fill: new Fill({
//           color: '#FFE400',
//         }),
//         stroke: new Stroke({
//           color: '#FF0000',
//           width: 3,
//         }),
//       }),
//     });
//     const lineStyle = new Style({
//       stroke: new Stroke({
//         color: '#000000',
//         width: 3,
//         lineDash: [10, 10],
//       }),
//     });
//     const features = [
//       new Feature(new Point(proj4('EPSG:4326', 'EPSG:5179', centerPointOL))),
//       new Feature(
//         // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
//         new LineString([
//           proj4('EPSG:4326', 'EPSG:5179', centerPointOL),
//           proj4('EPSG:4326', 'EPSG:5179', [127.88156485557558, 37.531623181]),
//         ]),
//       ),
//     ];
//     layer?.addData(features);
//     layer?.setStyle([pointStyle, lineStyle]);
//   };

//   const removeLayerByName = (name: string) => {
//     mapStore.removeCustomLayerByName(name);
//   };
//   const clearAllLayers = () => {
//     const layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
//     if (layer) {
//       layer.clearLayers();
//     }
//   };

//   const getLayerBounds = () => {
//     const layer = mapStore.getCustomLayerByName('TEST_USER_LAYER');
//     if (!layer) {
//       return;
//     }
//     const bounds = layer?.getBounds();
//     if (bounds) {
//       mapStore.fitBounds({
//         min: [bounds[0], bounds[1]],
//         max: [bounds[2], bounds[3]],
//       });
//     }
//   };

//   const handleSetUserConfigLevel = () => {
//     const layer = mapStore.getLayerById('polygonHump');
//     layer?.setUserLayerConfig({ minZoom: 11, maxZoom: 17 });
//   };

//   const handleSetUserStyleConfig = () => {
//     const layer = mapStore.getLayerById('polygonHump');
//     const styleConfig = dataStyles?.find(item => item.styleName === 'polygonHump');
//     if (styleConfig) {
//       layer?.setUserStyleConfig({
//         type: 'POLYGON',
//         options: {
//           fillColor: '#4632a8',
//           color: '#c92626',
//         },
//       });
//     }
//   };

//   const handleSetThemematics = () => {
//     const layer = mapStore.getLayerById('nodeBusinessPlan');
//     if (layer) {
//       layer.setThemematics([
//         {
//           type: 'POINT',
//           filter: [
//             {
//               left: { column: 'node_id' },
//               right: 221020,
//               operation: '>=',
//             },
//             {
//               left: { column: 'node_id' },
//               right: 279890,
//               operation: '<=',
//             },
//           ],
//           options: {
//             // weight: 7,
//             // color: '#e61097',
//             fillColor: '#f58231',
//           },
//         },
//       ]);
//     }
//   };

//   const getLayerOfFeature = (feature: Feature) => {
//     let layerFound = null;
//     mapRef.current
//       ?.getLayers()
//       .getArray()
//       .filter(item => item.get('id'))
//       .forEach((layer: CustomVectorLayer) => {
//         const source = layer.getSource();
//         if (source && source.hasFeature(feature)) {
//           layerFound = layer;
//         }
//       });
//     return layerFound;
//   };

//   const handleClearSelectLayer = () => {
//     mapStore.clearSelectedFeatures?.();
//     selectInteraction
//       ?.getFeatures()
//       .getArray()
//       .forEach(feat => {
//         const layerFound: any = getLayerOfFeature(feat);
//         layerFound.getSource().removeFeature(feat);
//       });
//   };

//   const handleClick = (action: string) => () => {
//     const myActionClick: any = {
//       center: handleGetCenter,
//       currentZoom: handleGetZoom('current'),
//       miniZoom: handleGetZoom('min'),
//       maxZoom: handleGetZoom('max'),
//       refresh: refreshMap,
//       panTo: panToView,
//       setView: panToView2,
//       fitBounds: handleFitBounds,
//       back: handleHistoryAction('back'),
//       forward: handleHistoryAction('forward'),
//       zoomin: mapStore.zoomIn,
//       zoomout: mapStore.zoomOut,
//       setZoom: () => mapStore.setZoom(10),
//       getLayer: handleGetLayerById(`polygonHump`),
//       getLayerAliasName: handleGetLayerAlias,
//       getTableNameLayer: handleGetTableName,
//       layerMinZoom: handleGetZoomLayer('min'),
//       layerMaxZoom: handleGetZoomLayer('max'),
//       isSelectable: isSelectableLayer,
//       getProperties: getLayerProperties,
//       layerVisible: showLayer,
//       layerRefresh: refreshLayer,
//       addData: addLayer,
//       clearLayers: clearAllLayers,
//       removeCustomLayerByName: () => removeLayerByName('TEST_USER_LAYER'),
//       layerBounds: getLayerBounds,
//       defaultContextMenu: () => {
//         mapStore.setDefaultContextMenu?.([
//           {
//             label: 'ZoomIn',
//             onClick: function () {
//               mapStore.zoomIn();
//             },
//           },
//           {
//             label: 'Zoomout',
//             onClick: function () {
//               mapStore.zoomOut();
//             },
//           },
//         ]);
//       },
//       editContextMenu: () => {
//         mapStore.setDefaultContextMenu?.([
//           {
//             label: 'Menu1',
//             onClick: function () {
//               alert('Edit context menu item 1');
//             },
//           },
//           {
//             label: 'Menu2',
//             onClick: function () {
//               alert('Edit context menu item 2');
//             },
//           },
//         ]);
//       },
//       layerLevel: handleSetUserConfigLevel,
//       setUserStyleConfig: handleSetUserStyleConfig,
//       setUserStyleConfig2: () => {
//         const layer = mapStore.getLayerById('polygonHump');
//         const styleConfig = dataStyles?.find(item => item.styleName === 'polygonHump');
//         if (styleConfig) {
//           layer?.setUserStyleConfig(null);
//         }
//       },
//       setThemematics: handleSetThemematics,
//       clearSelectLayer: handleClearSelectLayer,
//     };
//     myActionClick[action]();
//   };

//   const handleSetMode = (type: ModeDraw, options?: ModeOptions) => () => {
//     mapStore.setMode(type, options);
//   };

//   useEffect(() => {
//     if (!!mapStore.map && !!selectInteraction) {
//       switch (mapStore.selectorMode) {
//         case 'RECT':
//           startSelectorFeature(selectInteraction);
//           break;
//         case 'CIRCLE':
//           startCircleSelection(selectInteraction);
//           break;
//         case 'POLYGON':
//           startPolygonSelection(selectInteraction);
//           break;
//         default:
//           return;
//       }
//     }
//   }, [mapStore.selectorMode, mapStore.map, selectInteraction]);

//   const handleSelection = (type: ModeSelector) => () => {
//     mapStore.setSelectorMode(type);
//   };

//   const handleGetSelectedFeatures = () => {
//     const selectedFeatures = mapStore.getSelectedFeatures();
//     if (selectedFeatures) {
//       const displayFeatures = selectedFeatures.map(feat => omit(feat, ['nativeFeature']));
//       alert(JSON.stringify(displayFeatures));
//     }
//   };
//   const handleGetTrailCoords = () => {
//     const trailCoords = mapStore.getTrailCoordinates();
//     alert(JSON.stringify(trailCoords));
//   };

//   const handleTrailEdit = () => {
//     if (isEmpty(mapStore.selectedFeatures)) {
//       alert('Please select a trail feature to edit.');
//       return;
//     }
//     const polygonHump = mapStore.selectedFeatures.find(item => item.nativeFeature?.get('type') === 'polygonHump');
//     if (polygonHump) {
//       mapStore.setMode('trail-edit', {
//         features: polygonHump.nativeFeature,
//         geoType: 'Polygon',
//       });
//     }
//   };

//   const handleClick2 = (action: string) => () => {
//     const myActionClick: any = {
//       trailDistance: handleSetMode('trail-distance'),
//       trailArea: handleSetMode('trail-area'),
//       rectSelection: handleSelection('RECT'),
//       circleSelection: handleSelection('CIRCLE'),
//       polygonSelection: handleSelection('POLYGON'),
//       trailSimple: handleSetMode('trail-simple'),
//       areaRect: handleSetMode('area-draw', { geoType: 'Rect' }),
//       areaCircle: handleSetMode('area-draw', { geoType: 'Circle' }),
//       areaPolygon: handleSetMode('area-draw', { geoType: 'Polygon' }),
//       trailLine: handleSetMode('trail-draw', { geoType: 'LineString' }),
//       trailPoint: handleSetMode('trail-draw', { geoType: 'Point' }),
//       trailPolygon: handleSetMode('trail-draw', { geoType: 'Polygon' }),
//       getSelectedFeatures: handleGetSelectedFeatures,
//       getTrailCoordinates: handleGetTrailCoords,
//       trailEdit: handleTrailEdit,
//       select: () => {
//         mapStore.setMode('select');
//         selectInteraction?.getFeatures().clear();
//       },
//     };
//     myActionClick[action]();
//   };

//   return (
//     <div className="container mx-auto h-full">
//       <div id="map-open-layer" className="size-full" ref={mapContainerRef}></div>
//       {!isEmpty(mapStore.contextMenu) && (
//         <Menu id={MENU_ID}>
//           {mapStore.contextMenu?.map(item => (
//             <Item key={item.label} onClick={item.onClick}>
//               {item.label}
//             </Item>
//           ))}
//         </Menu>
//       )}
//       <div className="mt-5 flex flex-wrap items-center gap-4">
//         {listButton.map(item => (
//           <Button key={item.id} size="large" onClick={handleClick(item.action)}>
//             {item.label}
//           </Button>
//         ))}
//         {listButton2.map(item => (
//           <Button key={item.id} size="large" onClick={handleClick2(item.action)}>
//             {item.label}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
