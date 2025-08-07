import { Map } from 'ol';
import proj4 from 'proj4';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { LatLng } from '~/models/Coords';
import { MapBase, MapbaseOption } from '~/models/MapBase';
import { useLayerStore } from './useLayer';
import { boundingExtent } from 'ol/extent';
import { useMapHistoryStore } from './useHistoryStore';
import { CustomVectorTileLayer } from '~/assets/OpenLayer/utils/customTileLayer';
import { getLayerNameApi } from '~/assets/OpenLayer/services/getLayerName';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { LayerModel } from '~/models/Layer';
import { FeatureBase } from '~/models/Coords';
import { ModeState, ActiveMode, SelectMode, DrawMode, MeasurementMode, EditMode } from '~/models/ModeDraw';

export const useMapbase = create<MapBase<Map>>((set, get) => ({
  map: null,
  defaultOptions: undefined,
  contextMenu: [],
  selectedFeatures: [],
  hoverFeature: null,
  trailCoords: [],
  isRefresh: false,
  customStyleDraw: [],
  layerData: undefined,
  defaultStyles: [],
  selectorMode: 'RECT' as 'RECT' | 'POLYGON' | 'CIRCLE',
  isDrawing: false,
  
  // 새로운 모드 관리 구조 초기화
  modeState: {
    activeMode: 'none',
    selectMode: 'none',
    pointDrawMode: 'none',
    lineDrawMode: 'none',
    polygonDrawMode: 'none',
    measurementMode: 'none',
    editMode: 'none',
    isSelectActive: false,
    isPointDrawActive: false,
    isLineDrawActive: false,
    isPolygonDrawActive: false,
    isMeasurementActive: false,
    isEditActive: false,
  },
  /**
   * Khởi tạo CustomMap và lưu vào store.
   * @param {string} target - ID của DOM element chứa map.
   * @param {MapbaseOption['mapOptions']} options - Tùy chọn khởi tạo map.
   * @returns {Promise<CustomMap>} - Trả về Promise với map đã khởi tạo.
   */
  createMap: (target?: string, options?: MapbaseOption['mapOptions']): void => {
    set({ defaultOptions: { target, mapOptions: options } });
  },

  getMap: () => {
    return get().map;
  },
  setLayerData: (data: LayerModel[]) => {
    set({ layerData: data });
  },
  setMap: instance => {
    set({ map: instance });
  },
  /**
   * Hàm lấy tọa độ center của map.
   * @returns {LatLng | null} - Tọa độ center {lat, lng} hoặc undefined nếu map chưa được khởi tạo.
   */
  getCenter: (): LatLng | null => {
    const { map } = get();
    if (map) {
      const coordinate = map?.getView().getCenter();
      if (coordinate) {
        const latLng = proj4('EPSG:5179', 'EPSG:4326', coordinate);
        return {
          lat: latLng[1],
          lng: latLng[0],
        };
      }
    }
    return null;
  },
  getLayer: (name: string) => {
    const layer = useLayerStore.getState().getLayer(name);
    return layer;
  },

  /**
   * Hàm lấy zoom của map.
   * @param {string} type - get current, min, max zoom.

   * @returns {number | undefined} - Trả ra number zoom của map
   */
  getZoom(type: 'current' | 'min' | 'max'): number {
    const { map } = get();
    if (map) {
      const zoom = map.getView().getZoom();
      const minZoom = map.getView().getMinZoom();
      const maxZoom = map.getView().getMaxZoom();
      switch (type) {
        case 'max':
          return maxZoom;
        case 'min':
          return minZoom;
        default:
          return zoom ?? 1;
      }
    }
    return 1;
  },

  /**
   * Refreshes the map by temporarily removing its target and reinitializing it.
   * This method is useful for resetting the map view or applying new configurations.
   * It uses a timeout to ensure the map is properly reinitialized.
   */
  refresh() {
    const { map } = get();
    if (map) {
      set({
        isRefresh: true,
      });
    }
  },
  /**
   * Pans the map to the specified coordinates and optionally sets the zoom level.
   *
   * @param coords - The target coordinates to pan to, in the format [longitude, latitude].
   * @param zoom - The zoom level to set after panning. Defaults to 13 if not specified.
   */
  panTo: (coords: number[], zoom = 13) => {
    const { map } = get();
    map?.getView().animate({ zoom }, { center: proj4('EPSG:4326', 'EPSG:5179', coords) });
  },

  /**
   * Adjusts the map view to fit the specified bounds.
   *
   * @param bounds - An object containing the minimum and maximum coordinates that define the bounds to fit.
   *                 The coordinates should be in the format { min: [longitude, latitude], max: [longitude, latitude] }.
   */

  fitBounds: bounds => {
    const { map } = get();
    const minCoordinate = proj4('EPSG:4326', 'EPSG:5179', bounds.min);
    const maxCoordinate = proj4('EPSG:4326', 'EPSG:5179', bounds.max);
    if (map) {
      const view = map.getView();
      const extent = boundingExtent([minCoordinate, maxCoordinate]);
      view?.fit(extent, {
        size: map?.getSize(),
        duration: 1000, // Animation trong 1 giây
        padding: [20, 10, 10, 20],
      });
    }
  },
  onHistoryAction: action => {
    const { back, forward } = useMapHistoryStore.getState();
    action === 'back' ? back() : forward();
  },
  zoomIn() {
    const { map } = get();
    if (map) {
      const zoom = map.getView().getZoom();
      const maxZoom = map.getView().getMaxZoom();
      if (!!zoom && zoom <= maxZoom) {
        map.getView().animate({ zoom: zoom < maxZoom ? zoom + 1 : maxZoom });
      }
    }
  },
  zoomOut() {
    const { map } = get();
    if (map) {
      const zoom = map.getView().getZoom();
      const minZoom = map.getView().getMinZoom();
      if (!!zoom && zoom >= minZoom) {
        map.getView().animate({ zoom: zoom > minZoom ? zoom - 1 : minZoom });
      }
    }
  },
  setZoom(targetZoom: number) {
    const { map } = get();
    if (map) {
      const maxZoom = map.getView().getMaxZoom();
      const minZoom = map.getView().getMinZoom();
      if (targetZoom >= minZoom && targetZoom <= maxZoom) {
        map.getView().animate({ zoom: targetZoom });
      }
    }
  },
  async getLayerById(id) {
    const { map, getZoom } = get();
    if (map) {
      const zoom = getZoom('current');
      set({ layerById: id });
      if (zoom >= 13) {
        const layers = map.getLayers().getArray();
        const findLayer = layers?.find(lay => lay.get('layerName') === id) as CustomVectorTileLayer;
        return findLayer;
      }
      const findLayer = await getLayerNameApi(id);
      const newVectorTileLayer = new CustomVectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
        }),
        map: map,
      });
      newVectorTileLayer.setProperties({
        id: findLayer?.id,
        layerName: findLayer?.value,
        tableName: findLayer?.tableName,
        aliasName: findLayer?.alias,
        selectable: findLayer?.selectable,
        type: 'geojson',
        geometryType: findLayer?.geometryType,
        maxZoom: findLayer?.maxZoom ?? 1,
        minZoom: findLayer?.minZoom,
      });
      return newVectorTileLayer;
    }
  },
  getCustomLayerByName(name) {
    return useLayerStore.getState().getLayer(name);
  },
  removeCustomLayerByName(name) {
    const layer = this.getCustomLayerByName(name);
    const { map } = get();
    if (layer) {
      map?.removeLayer(layer);
      useLayerStore.getState()?.removeLayerByName?.(name);
    }
  },
  addCustomLayerByName(name) {
    useLayerStore.getState().addLayer(name);
    const layer = useLayerStore.getState().getLayer(name);
    return layer;
  },
  setDefaultContextMenu(items) {
    set({
      contextMenu: items,
    });
  },
  setSelectedFeatures: (features: FeatureBase[]) => {
    set({ selectedFeatures: features });
  },
  setHoverFeature: (feature: FeatureBase | null) => {
    set({ hoverFeature: feature });
  },
  setSelectorMode: (mode: 'RECT' | 'POLYGON' | 'CIRCLE') => {
    set({ selectorMode: mode });
  },
  setIsDrawing: (isDrawing: boolean) => {
    set({ isDrawing });
  },

  isSelected: id => {
    const { selectedFeatures } = get();
    return selectedFeatures.some(feature => feature.id === id);
  },
  clearSelectedFeatures: () => set({ selectedFeatures: [] }),
  getSelectedFeatures() {
    return get().selectedFeatures;
  },
  getTrailCoordinates: () => {
    const { trailCoords } = get();
    return trailCoords;
  },
  setTrailCoordinates(coords) {
    set({ trailCoords: coords });
  },
  setRefresh: () => {
    set({ isRefresh: false });
  },
  setMode: (mode, options) => {
    set({ drawMode: { mode, options }, isDrawing: true });
    if (mode === 'trail-edit') {
      set({ editFeature: options?.feature });
    } else if (mode === 'draw-end') {
      set({ isDrawing: false });
    } else if (mode === 'select') {
      set({ editFeature: undefined, selectedFeatures: [], isDrawing: false });
    }
  },
  setCustomStyles(styles) {
    set({ customStyleDraw: styles });
  },
  resetLayerById: () => {
    set({ layerById: undefined });
  },
  setDefaultStyles: data => {
    set({
      defaultStyles: data,
    });
  },
  resetMapAll: () => {
    set({
      selectedFeatures: [],
      contextMenu: [],
      trailCoords: [],
    });
    useMapHistoryStore.getState().resetHistory?.();
  },
  
  // 새로운 모드 관리 메서드들
  setActiveMode: (mode: ActiveMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    console.log('🔄 모드 전환:', currentModeState.activeMode, '→', mode);
    
    // 모든 모드 비활성화
    const newModeState: ModeState = {
      activeMode: mode,
      selectMode: 'none',
      pointDrawMode: 'none',
      lineDrawMode: 'none',
      polygonDrawMode: 'none',
      measurementMode: 'none',
      editMode: 'none',
      isSelectActive: false,
      isPointDrawActive: false,
      isLineDrawActive: false,
      isPolygonDrawActive: false,
      isMeasurementActive: false,
      isEditActive: false,
    };
    
    // 새로운 모드에 따라 해당 모드 활성화
    switch (mode) {
      case 'select':
        newModeState.isSelectActive = true;
        break;
      case 'pointDraw':
        newModeState.isPointDrawActive = true;
        break;
      case 'lineDraw':
        newModeState.isLineDrawActive = true;
        break;
      case 'polygonDraw':
        newModeState.isPolygonDrawActive = true;
        break;
      case 'measurement':
        newModeState.isMeasurementActive = true;
        break;
      case 'edit':
        newModeState.isEditActive = true;
        break;
      case 'none':
      default:
        // 모든 모드 비활성화
        break;
    }
    
    set({ modeState: newModeState });
    console.log('✅ 모드 상태 업데이트 완료:', newModeState);
  },
  
  setSelectMode: (mode: SelectMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    console.log('🔄 Select 모드 전환:', currentModeState.selectMode, '→', mode);
    
    // 모든 모드 비활성화
    const newModeState: ModeState = {
      activeMode: mode !== 'none' ? 'select' : 'none',
      selectMode: mode,
      pointDrawMode: 'none',
      lineDrawMode: 'none',
      polygonDrawMode: 'none',
      measurementMode: 'none',
      editMode: 'none',
      isSelectActive: mode !== 'none',
      isPointDrawActive: false,
      isLineDrawActive: false,
      isPolygonDrawActive: false,
      isMeasurementActive: false,
      isEditActive: false,
    };
    
    set({ modeState: newModeState });
    console.log('✅ Select 모드 설정 완료:', mode);
  },
  
  setPointDrawMode: (mode: DrawMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    console.log('🔄 Point Draw 모드 전환:', currentModeState.pointDrawMode, '→', mode);
    
    // 모든 모드 비활성화
    const newModeState: ModeState = {
      activeMode: mode !== 'none' ? 'pointDraw' : 'none',
      selectMode: 'none',
      pointDrawMode: mode,
      lineDrawMode: 'none',
      polygonDrawMode: 'none',
      measurementMode: 'none',
      editMode: 'none',
      isSelectActive: false,
      isPointDrawActive: mode !== 'none',
      isLineDrawActive: false,
      isPolygonDrawActive: false,
      isMeasurementActive: false,
      isEditActive: false,
    };
    
    set({ modeState: newModeState });
    console.log('✅ Point Draw 모드 설정 완료:', mode);
  },
  
  setLineDrawMode: (mode: DrawMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    console.log('🔄 Line Draw 모드 전환:', currentModeState.lineDrawMode, '→', mode);
    
    // 모든 모드 비활성화
    const newModeState: ModeState = {
      activeMode: mode !== 'none' ? 'lineDraw' : 'none',
      selectMode: 'none',
      pointDrawMode: 'none',
      lineDrawMode: mode,
      polygonDrawMode: 'none',
      measurementMode: 'none',
      editMode: 'none',
      isSelectActive: false,
      isPointDrawActive: false,
      isLineDrawActive: mode !== 'none',
      isPolygonDrawActive: false,
      isMeasurementActive: false,
      isEditActive: false,
    };
    
    set({ modeState: newModeState });
    console.log('✅ Line Draw 모드 설정 완료:', mode);
  },
  
  setPolygonDrawMode: (mode: DrawMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    const newModeState = {
      ...currentModeState,
      polygonDrawMode: mode,
      isPolygonDrawActive: mode !== 'none',
      activeMode: mode !== 'none' ? 'polygonDraw' : 'none'
    };
    
    set({ modeState: newModeState });
    console.log('✅ Polygon Draw 모드 설정:', mode);
  },
  
  setMeasurementMode: (mode: MeasurementMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    console.log('🔄 Measurement 모드 전환:', currentModeState.measurementMode, '→', mode);
    
    // 모든 모드 비활성화
    const newModeState: ModeState = {
      activeMode: mode !== 'none' ? 'measurement' : 'none',
      selectMode: 'none',
      pointDrawMode: 'none',
      lineDrawMode: 'none',
      polygonDrawMode: 'none',
      measurementMode: mode,
      editMode: 'none',
      isSelectActive: false,
      isPointDrawActive: false,
      isLineDrawActive: false,
      isPolygonDrawActive: false,
      isMeasurementActive: mode !== 'none',
      isEditActive: false,
    };
    
    set({ modeState: newModeState });
    console.log('✅ Measurement 모드 설정 완료:', mode);
  },
  
  setEditMode: (mode: EditMode) => {
    const currentModeState = get().modeState;
    if (!currentModeState) return;
    
    const newModeState = {
      ...currentModeState,
      editMode: mode,
      isEditActive: mode !== 'none',
      activeMode: mode !== 'none' ? 'edit' : 'none'
    };
    
    set({ modeState: newModeState });
    console.log('✅ Edit 모드 설정:', mode);
  },
  
  deactivateAllModes: () => {
    const newModeState: ModeState = {
      activeMode: 'none',
      selectMode: 'none',
      pointDrawMode: 'none',
      lineDrawMode: 'none',
      polygonDrawMode: 'none',
      measurementMode: 'none',
      editMode: 'none',
      isSelectActive: false,
      isPointDrawActive: false,
      isLineDrawActive: false,
      isPolygonDrawActive: false,
      isMeasurementActive: false,
      isEditActive: false,
    };
    
    set({ modeState: newModeState });
    console.log('🔄 모든 모드 비활성화 완료');
  },
  
  getCurrentModeState: () => {
    return get().modeState;
  },
}));

window.mapbaseStore = useMapbase;
declare global {
  interface Window {
    mapbaseStore: UseBoundStore<StoreApi<MapBase<Map>>>;
  }
}
