import React, { useRef, useEffect, useState } from 'react';
import { Map } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import { fromLonLat, get as getProjection, transform } from 'ol/proj';
import { useMapbase } from '~/store/useMapbase';
import { useGetLayerList } from '~/assets/Home/services/useGetLayers';
import { useGetLayerStyles } from '~/assets/Home/services/useGetStylesLayers';
import { createImageLayer } from '~/assets/OpenLayer/utils/mvtLayers';
import { createVectorLayer } from '~/assets/OpenLayer/utils/mvtLayers';
import { updateFeatureViaWFS } from '~/assets/OpenLayer/services/getFeatures';
import LayerControl from '~/components/LayerControl';
import { FiMousePointer, FiMove, FiMaximize2, FiMinimize2, FiRotateCw, FiLayers, FiCircle, FiMapPin, FiSquare, FiHexagon, FiArrowUpRight, FiHome, FiRotateCcw, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiTarget, FiSettings, FiMinus, FiBarChart } from 'react-icons/fi';
import { useBasicSelect, useAdvancedSelect, activateSelectMode, activateAdvancedSelectMode, activateRectSelectionMode, activateCircleSelectionMode, activatePolygonSelectionMode, useRectangleSelection, useCircleSelection, usePolygonSelection } from '~/assets/Selection';
import { useLayerDelete } from '~/assets/LayerControl';
import { useMapPan, useMapHistory } from '~/assets/Navigation';
import { useLayerOpacity } from '~/assets/LayerStyle';
import { useMapHistoryStore } from '~/store/useHistoryStore';
import { useTrailDrawPoint } from '~/assets/Drawing/hooks/useTrailDraw';
import { useAdvancedTrailDrawPoint } from '~/assets/Drawing/hooks/useAdvancedTrailDrawPoint';
import { useTrailDistance } from '~/assets/Drawing/hooks/useTrailDistance';
import { useTrailArea } from '~/assets/Drawing/hooks/useTrailArea';
import { activateTrailDistanceMode, activateTrailAreaMode } from '~/assets/Drawing';
import { activateTrailDrawPointMode, TrailDrawPointService, activateTrailDrawLineMode, TrailDrawLineService, activateAdvancedTrailDrawLineMode, AdvancedTrailDrawLineService, activateAdvancedTrailDrawPointMode, AdvancedTrailDrawPointService, activateTrailDrawPolygonMode, TrailDrawPolygonService, activateAdvancedTrailDrawPolygonMode, AdvancedTrailDrawPolygonService } from '~/assets/Drawing';
import { Feature } from 'ol';
import { Point, LineString, Polygon, MultiLineString } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';
import { getLength } from 'ol/sphere';
import { formatLength2 } from '~/assets/OpenLayer/utils/common';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { EditContextMenuService } from '~/assets/ContextMenu';
import { activateTrailEditMode, activateTrailDeleteMode } from '~/assets/Editing';
import { Modify, Snap, Translate, Draw } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';

// geometry 변환 함수 (메인 페이지에서 가져옴)
function createOLGeometry(geojson: any) {
  if (!geojson || !geojson.type || !geojson.coordinates) {
    console.error('Invalid GeoJSON:', geojson);
    return null;
  }

  const validateCoordinates = (coords: any, type: string): boolean => {
    if (!Array.isArray(coords)) {
      console.error(`Invalid coordinates for ${type}:`, coords);
      return false;
    }

    const hasInvalidValues = (arr: any[]): boolean => {
      return arr.some(item => {
        if (Array.isArray(item)) {
          return hasInvalidValues(item);
        }
        return item === undefined || item === null || isNaN(item);
      });
    };

    if (hasInvalidValues(coords)) {
      console.error(`Invalid coordinate values for ${type}:`, coords);
      return false;
    }

    return true;
  };

  try {
    if (geojson.type === 'Point') {
      console.log('Creating Point geometry');
      if (!validateCoordinates(geojson.coordinates, 'Point')) return null;
      return new Point(geojson.coordinates);
    } else if (geojson.type === 'LineString') {
      console.log('Creating LineString geometry');
      if (!validateCoordinates(geojson.coordinates, 'LineString')) return null;
      return new LineString(geojson.coordinates);
    } else if (geojson.type === 'MultiLineString') {
      console.log('Creating MultiLineString geometry');
      if (!validateCoordinates(geojson.coordinates, 'MultiLineString')) return null;
      return new MultiLineString(geojson.coordinates);
    } else if (geojson.type === 'Polygon') {
      console.log('Creating Polygon geometry');
      if (!validateCoordinates(geojson.coordinates, 'Polygon')) return null;
      return new Polygon(geojson.coordinates);
    } else {
      console.error('Unsupported geometry type:', geojson.type);
      return null;
    }
  } catch (error) {
    console.error('Error creating geometry:', error);
    return null;
  }
}

const OSSMAPPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const drawnFeatureRef = useRef<any>(null);
  const [mapInfo, setMapInfo] = useState({
    center: [127.0, 37.5],
    zoom: 10
  });

  // 레이어 컨트롤 상태들
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
  const [layerControlPosition, setLayerControlPosition] = useState({ 
    x: window.innerWidth - 60, 
    y: 80 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // 선택 도구 상태들
  const [activeTool, setActiveTool] = useState<'select' | 'advancedSelect' | 'rectSelect' | 'circleSelect' | 'polygonSelect' | 'drawPoint' | 'advancedDrawPoint' | 'drawLine' | 'advancedDrawLine' | 'drawPolygon' | 'advancedDrawPolygon' | 'trailDistance' | 'trailArea' | 'pan' | 'zoomIn' | 'zoomOut' | 'reset' | 'rotate'>('select');
  const activeToolRef = useRef(activeTool);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);
  const [showToolbar, setShowToolbar] = useState(true);
  
  // 드롭다운 메뉴 상태들
  const [showSelectDropdown, setShowSelectDropdown] = useState(false);
  const [currentSelectTool, setCurrentSelectTool] = useState<'select' | 'advancedSelect' | 'rectSelect' | 'circleSelect' | 'polygonSelect'>('select');
  
  const [showPointDropdown, setShowPointDropdown] = useState(false);
  const [currentPointTool, setCurrentPointTool] = useState<'drawPoint' | 'advancedDrawPoint'>('drawPoint');
  
  const [showLineDropdown, setShowLineDropdown] = useState(false);
  const [currentLineTool, setCurrentLineTool] = useState<'drawLine' | 'advancedDrawLine'>('drawLine');
  
  const [showPolygonDropdown, setShowPolygonDropdown] = useState(false);
  const [currentPolygonTool, setCurrentPolygonTool] = useState<'drawPolygon' | 'advancedDrawPolygon'>('drawPolygon');
  const [currentRotateTool, setCurrentRotateTool] = useState<'rotateCw' | 'rotateCcw'>('rotateCw');
  const [showRotateDropdown, setShowRotateDropdown] = useState(false);
  const [currentZoomTool, setCurrentZoomTool] = useState<'zoomIn' | 'zoomOut'>('zoomIn');
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);
  const [currentMoveTool, setCurrentMoveTool] = useState<'panUp' | 'panDown' | 'panLeft' | 'panRight' | 'panCoordinate' | 'panPrevious' | 'panForward'>('panUp');
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [showCoordinateModal, setShowCoordinateModal] = useState(false);
  const [coordinateX, setCoordinateX] = useState('');
  const [coordinateY, setCoordinateY] = useState('');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showOpacityModal, setShowOpacityModal] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [opacityValue, setOpacityValue] = useState(1.0);
  
  // 측정 도구 상태들
  const [showMeasurementDropdown, setShowMeasurementDropdown] = useState(false);
  const [currentMeasurementTool, setCurrentMeasurementTool] = useState<'trailDistance' | 'trailArea'>('trailDistance');
  const [isMeasurementModeActive, setIsMeasurementModeActive] = useState(false);
  const isMeasurementModeActiveRef = useRef(isMeasurementModeActive);
  useEffect(() => {
    isMeasurementModeActiveRef.current = isMeasurementModeActive;
  }, [isMeasurementModeActive]);
  const [isDrawing, setIsDrawing] = useState(false);

  // 편집 모드 관련 상태들
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const editModeRef = useRef<{ mode: string; featureId: string | null }>({ mode: '', featureId: null });

  // 우클릭 메뉴 관련 상태들
  const MENU_ID = 'ossmap-context-menu';
  const { show } = useContextMenu({ id: MENU_ID });
  const state = useMapbase();
  const contextMenuData = useMapbase(state => state.contextMenu);
  const [contextMenuEnabled, setContextMenuEnabled] = useState(true); // 자동 활성화

  // 포인트 그리기 상태들 (MainPage와 동일)
  const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
  const [drawnPointCoordinate, setDrawnPointCoordinate] = useState<number[] | null>(null);
  const [drawnPointPixel, setDrawnPointPixel] = useState<number[] | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('');
  const [availableNodeTypes] = useState([
    { value: 'nodeBusinessPlan', label: 'nodeBusinessPlan (Point)' }
  ]);

  // 라인 그리기 상태들 (MainPage와 동일)
  const [showLineTypeSelector, setShowLineTypeSelector] = useState(false);
  const [drawnLineCoordinate, setDrawnLineCoordinate] = useState<number[] | null>(null);
  const [drawnLinePixel, setDrawnLinePixel] = useState<number[] | null>(null);
  const [selectedLineType, setSelectedLineType] = useState<string>('');
  const [availableLineTypes] = useState([
    { value: 'lineBusinessPlan', label: 'lineBusinessPlan (Line)' }
  ]);

  // 폴리곤 그리기 상태들 (MainPage와 동일)
  const [showPolygonTypeSelector, setShowPolygonTypeSelector] = useState(false);
  const [drawnPolygonCoordinate, setDrawnPolygonCoordinate] = useState<number[] | null>(null);
  const [drawnPolygonPixel, setDrawnPolygonPixel] = useState<number[] | null>(null);
  const [selectedPolygonType, setSelectedPolygonType] = useState<string>('');
  const [availablePolygonTypes] = useState([
    { value: 'polygonHump', label: 'polygonHump (Polygon)' }
  ]);

  // 레이어 데이터 가져오기
  const { data: layerData } = useGetLayerList();
  const { data: dataStyles } = useGetLayerStyles();

  // Layer Delete 훅 초기화
  const layerDelete = useLayerDelete();

  // Selection hooks 초기화 (mapRef.current가 준비된 후에만)
  const basicSelect = useBasicSelect({
    map: mapRef.current && layerData ? mapRef.current : null,
    layerData: layerData || [],
    onFeatureSelect: (feature: any) => {
      console.log('BasicSelect: 피처 선택됨', feature);
    },
    onFeatureDeselect: () => {
      console.log('BasicSelect: 피처 선택 해제됨');
    }
  });

  // 측정 훅들 초기화 (MainPage와 동일)
  const trailDistance = useTrailDistance({ 
  onEndDraw: () => {
    console.log('=== Trail Distance ended ===');
    console.log('🔧 현재 activeToolRef.current:', activeToolRef.current);
    console.log('🔧 현재 isMeasurementModeActiveRef.current:', isMeasurementModeActiveRef.current);
    
    // 측정 모드가 활성화되어 있고, 현재 도구가 trailDistance일 때만 연속 측정
    if (activeToolRef.current === 'trailDistance' && isMeasurementModeActiveRef.current) {
      setTimeout(() => {
        // 다시 한번 확인 (모드가 바뀌었을 수 있음)
        if (activeToolRef.current === 'trailDistance' && isMeasurementModeActiveRef.current) {
          console.log('🔧 길이 측정 연속 모드 - startDrawing 호출');
          trailDistance.startDrawing(true);
        } else {
          console.log('🔧 모드가 변경됨 - 연속 측정 중단');
        }
      }, 200);
    } else {
      console.log('🔧 측정 모드 비활성화 - 연속 측정 중단');
    }
  }
});
  const trailArea = useTrailArea({ 
    onEndDraw: () => {
      console.log('=== Trail Area ended ===');
      console.log('🔧 현재 activeToolRef.current:', activeToolRef.current);
      console.log('🔧 현재 isMeasurementModeActiveRef.current:', isMeasurementModeActiveRef.current);
      if (activeToolRef.current === 'trailArea' && isMeasurementModeActiveRef.current) {
        setTimeout(() => {
          if (activeToolRef.current === 'trailArea' && isMeasurementModeActiveRef.current) {
            console.log('🔧 면적 측정 연속 모드 - startDrawing 호출');
            trailArea.startDrawing(true);
          }
        }, 200);
      }
    }
  });

  // 측정 모드 상태 변경 감지
  useEffect(() => {
    console.log('🔧 측정 모드 상태 변경:', { activeTool, isMeasurementModeActive });
  }, [activeTool, isMeasurementModeActive]);

  // MainPage 방식의 useEffect 추가 (모드 변경 시 자동 활성화)
  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'trail-distance') {
      console.log('🔧 OSSMAP trail-distance 모드 감지 - startDrawing 호출');
      trailDistance.startDrawing();
    }
  }, [useMapbase.getState().drawMode?.mode]);

  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'trail-area') {
      console.log('🔧 OSSMAP trail-area 모드 감지 - startDrawing 호출');
      trailArea.startDrawing();
    }
  }, [useMapbase.getState().drawMode?.mode]);

  // mapRef.current와 layerData가 모두 준비된 후 선택 기능 강제 활성화
  useEffect(() => {
    if (mapRef.current && layerData && layerData.length > 0) {
      console.log('🔄 mapRef와 layerData 준비 완료 - 선택 기능 강제 활성화');
      
      // 기존 인터랙션 완전 정리
      const existingInteractions = mapRef.current.getInteractions().getArray();
      existingInteractions.forEach(interaction => {
        if (interaction.get('isSelectInteraction')) {
          mapRef.current?.removeInteraction(interaction);
        }
      });
      
      // 기본 select 모드 강제 활성화
      activateSelectMode(mapRef.current);
      useMapbase.getState().setMode('select');
      
      // 지도 강제 렌더링
      mapRef.current.render();
      
      console.log('✅ 선택 기능 강제 활성화 완료');
    }
  }, [mapRef.current, layerData]);



  const advancedSelect = useAdvancedSelect({
    map: mapRef.current && layerData ? mapRef.current : null,
    layerData: layerData || [],
    onFeatureSelect: (feature: any) => {
      console.log('AdvancedSelect: 피처 선택됨', feature);
    },
    onFeatureDeselect: () => {
      console.log('AdvancedSelect: 피처 선택 해제됨');
    },
    onFeatureHover: (feature: any) => {
      console.log('AdvancedSelect: 피처 hover', feature);
      // hover 상태를 useMapbase에 저장
      useMapbase.getState().setHoverFeature(feature);
    },
    onFeatureHoverEnd: () => {
      console.log('AdvancedSelect: 피처 hover 종료');
      // hover 상태 초기화
      useMapbase.getState().setHoverFeature(null);
    }
  });

  // 포인트 그리기 hooks 초기화 (MainPage와 동일)
  const trailDrawPoint = useTrailDrawPoint({ 
    onEndDraw: () => console.log('OSSMAP Trail Draw Point ended') 
  });
  
  const advancedTrailDrawPoint = useAdvancedTrailDrawPoint();

  // 도형 선택 hooks
  const { startSelectorFeature: startRectSelection } = useRectangleSelection({
    map: mapRef.current,
    onEndDraw: () => {
      console.log('🔧 사각형 선택 완료');
    }
  });

  const { startCircleSelection } = useCircleSelection({
    map: mapRef.current,
    onEndDraw: () => {
      console.log('🔧 원형 선택 완료');
    }
  });

  const { startPolygonSelection } = usePolygonSelection({
    map: mapRef.current,
    onEndDraw: () => {
      console.log('🔧 폴리곤 선택 완료');
    }
  });

  // Navigation 패키지 초기화
  const mapPan = useMapPan();
  const mapHistory = useMapHistory();
  const { setLayerOpacity, getLayerOpacity, resetLayerOpacity } = useLayerOpacity();

  // 그린 피처 정리 함수
  const cleanupDrawnFeature = () => {
    console.log('🔧 그린 피처 정리 시작');
    
    if (!mapRef.current) {
      console.log('🔧 맵 참조 없음');
      return;
    }

    try {
      // 측정 도구 레이어는 제거하지 않음 (연속 측정을 위해 유지)
      const layers = mapRef.current.getLayers().getArray();
      let removedCount = 0;
      
      layers.forEach((layer, index) => {
        const layerId = layer.get('id');
        // 측정 도구 레이어는 제거하지 않음
        if (layerId === 'trail-distance' || layerId === 'trail-area') {
          console.log(`🔧 측정 도구 레이어 유지: ${layerId}`);
        } else if (layer instanceof VectorLayer) {
          const source = layer.getSource();
          if (source) {
            const features = source.getFeatures();
            console.log(`🔧 레이어 ${index}에서 ${features.length}개 피처 검사 중...`);
            
            // 모든 피처를 제거 (임시 레이어의 모든 피처는 그린 피처)
            features.forEach((feature: any) => {
              source.removeFeature(feature);
              removedCount++;
              console.log('🔧 피처 제거됨:', feature);
            });
          }
        }
      });
      
      console.log(`🔧 총 ${removedCount}개의 피처 제거됨`);
      
      // drawnFeatureRef 초기화
      drawnFeatureRef.current = null;
      
      // TrailDrawPointService 정리
      try {
        TrailDrawPointService.cleanupAll();
        console.log('🔧 TrailDrawPointService 정리 완료');
      } catch (error) {
        console.log('🔧 TrailDrawPointService 정리 중 오류:', error);
      }
      
    } catch (error) {
      console.error('🔧 그린 피처 정리 중 오류:', error);
    }
  };

  // 노드 타입 선택기 표시 함수 (MainPage와 동일)
  const showNodeTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    console.log('=== OSSMAP showNodeTypeSelectorPopup 호출됨 ===');
    console.log('좌표:', coordinate);
    console.log('픽셀:', pixel);
    
    try {
      setDrawnPointCoordinate(coordinate);
      console.log('drawnPointCoordinate 설정 완료');
      
      setDrawnPointPixel(pixel);
      console.log('drawnPointPixel 설정 완료');
      
      setSelectedNodeType(''); // 선택된 값 초기화
      console.log('selectedNodeType 초기화 완료');
      
      setShowNodeTypeSelector(true);
      console.log('showNodeTypeSelector true 설정 완료');
      
      console.log('=== OSSMAP 노드 타입 선택기 상태 설정 완료 ===');
    } catch (error) {
      console.error('OSSMAP showNodeTypeSelectorPopup에서 오류 발생:', error);
    }
  };

  // 라인 타입 선택기 표시 함수 (MainPage와 동일)
  const showLineTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    console.log('=== OSSMAP showLineTypeSelectorPopup 호출됨 ===');
    console.log('좌표:', coordinate);
    console.log('픽셀:', pixel);
    
    try {
      setDrawnLineCoordinate(coordinate);
      console.log('drawnLineCoordinate 설정 완료');
      
      setDrawnLinePixel(pixel);
      console.log('drawnLinePixel 설정 완료');
      
      setSelectedLineType(''); // 선택된 값 초기화
      console.log('selectedLineType 초기화 완료');
      
      setShowLineTypeSelector(true);
      console.log('showLineTypeSelector true 설정 완료');
      
      console.log('=== OSSMAP 라인 타입 선택기 상태 설정 완료 ===');
    } catch (error) {
      console.error('OSSMAP showLineTypeSelectorPopup에서 오류 발생:', error);
    }
  };

  // 폴리곤 타입 선택기 표시 함수 (MainPage와 동일)
  const showPolygonTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    console.log('=== OSSMAP showPolygonTypeSelectorPopup 호출됨 ===');
    console.log('좌표:', coordinate);
    console.log('픽셀:', pixel);
    
    try {
      setDrawnPolygonCoordinate(coordinate);
      console.log('drawnPolygonCoordinate 설정 완료');
      
      setDrawnPolygonPixel(pixel);
      console.log('drawnPolygonPixel 설정 완료');
      
      setSelectedPolygonType(''); // 선택된 값 초기화
      console.log('selectedPolygonType 초기화 완료');
      
      setShowPolygonTypeSelector(true);
      console.log('showPolygonTypeSelector true 설정 완료');
      
      console.log('=== OSSMAP 폴리곤 타입 선택기 상태 설정 완료 ===');
    } catch (error) {
      console.error('OSSMAP showPolygonTypeSelectorPopup에서 오류 발생:', error);
    }
  };

  // 선택된 피처 하이라이트 관리 (MainPage와 동일)
  const selectedFeatures = useMapbase(state => state.selectedFeatures);

  // 선택된 피처 스타일 (MainPage와 동일)
  const selectedFeatureStyle = new Style({
    image: new CircleStyle({
      radius: 16,
      fill: new Fill({ color: 'rgba(255, 255, 255, 0)' }), // 투명 (fill 없음)
      stroke: new Stroke({ color: '#ff0000', width: 4 }), // 빨간 테두리
    }),
    fill: new Fill({ color: 'rgba(255, 255, 255, 0)' }), // Polygon 등도 fill 없음
    stroke: new Stroke({ color: '#ff0000', width: 4 }),
  });

  // 마우스 오버 시 애플 스타일 (MainPage와 동일)
  const hoverFeatureStyle = new Style({
    image: new CircleStyle({
      radius: 20,
      fill: new Fill({ 
        color: 'rgba(255, 255, 255, 0.15)' 
      }),
      stroke: new Stroke({ 
        color: 'rgba(0, 122, 255, 0.8)', 
        width: 3,
        lineDash: [6, 3]
      }),
    }),
    fill: new Fill({ 
      color: 'rgba(255, 255, 255, 0.1)' 
    }),
    stroke: new Stroke({ 
      color: 'rgba(0, 122, 255, 0.8)', 
      width: 3,
      lineDash: [6, 3]
    }),
  });

  // 하이라이트 레이어 관리 (MainPage와 동일)
  useEffect(() => {
    console.log('🎯 OSSMAP 하이라이트 useEffect 실행:', { selectedFeatures });
    
    // 맵이 완전히 준비될 때까지 지연
    const timer = setTimeout(() => {
      if (!mapRef.current || !mapRef.current.getView()) {
        console.log('❌ 맵 참조 없음 또는 맵 뷰가 준비되지 않음');
        return;
      }
    
    if (highlightLayerRef.current) {
      console.log('🗑️ 기존 하이라이트 레이어 제거');
      mapRef.current.removeLayer(highlightLayerRef.current);
      highlightLayerRef.current = null;
    }
    
    if (!selectedFeatures || selectedFeatures.length === 0) {
      console.log('❌ 선택된 피처 없음');
      return;
    }

    const olFeatures: Feature[] = [];
    
    selectedFeatures.forEach((feature, index) => {
      if (!feature.geometry) {
        return;
      }

      let olFeature: Feature | null = null;
      try {
        if (feature.geometry.type === 'Point') {
          olFeature = new Feature(new Point(feature.geometry.coordinates));
        } else if (feature.geometry.type === 'LineString') {
          olFeature = new Feature(new LineString(feature.geometry.coordinates));
        } else if (feature.geometry.type === 'Polygon') {
          olFeature = new Feature(new Polygon(feature.geometry.coordinates));
        } else if (feature.geometry.type === 'MultiLineString') {
          olFeature = new Feature(new MultiLineString(feature.geometry.coordinates));
        }
      } catch (e) {
        console.error(`geometry ${index} 생성 오류:`, e);
      }
      
      if (olFeature) {
        olFeature.setStyle(selectedFeatureStyle);
        olFeatures.push(olFeature);
      }
    });
    
    if (olFeatures.length > 0) {
      console.log('✅ OSSMAP 하이라이트 레이어 생성:', olFeatures.length, '개 피처');
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features: olFeatures }),
        zIndex: 999,
      });
      mapRef.current.addLayer(vectorLayer);
      highlightLayerRef.current = vectorLayer;
      console.log('✅ OSSMAP 하이라이트 레이어 추가 완료');
    } else {
      console.log('❌ OSSMAP 하이라이트할 피처 없음');
    }
    }, 100); // 100ms 지연

    return () => clearTimeout(timer);
  }, [selectedFeatures, mapRef.current, layerData]);

  // 마우스 오버 미리보기 레이어 관리 (MainPage와 동일)
  const hoverFeature = useMapbase(state => state.hoverFeature);

  useEffect(() => {
    if (!mapRef.current) return;
    if (hoverLayerRef.current) {
      mapRef.current.removeLayer(hoverLayerRef.current);
      hoverLayerRef.current = null;
    }
    if (!hoverFeature || !hoverFeature.geometry) return;

    let olFeature: Feature | null = null;
    try {
      if (hoverFeature.geometry.type === 'Point') {
        olFeature = new Feature(new Point(hoverFeature.geometry.coordinates));
      } else if (hoverFeature.geometry.type === 'LineString') {
        olFeature = new Feature(new LineString(hoverFeature.geometry.coordinates));
      } else if (hoverFeature.geometry.type === 'Polygon') {
        olFeature = new Feature(new Polygon(hoverFeature.geometry.coordinates));
      } else if (hoverFeature.geometry.type === 'MultiLineString') {
        olFeature = new Feature(new MultiLineString(hoverFeature.geometry.coordinates));
      }
    } catch (e) {
      console.error('OSSMAP hover feature geometry 생성 오류:', e);
    }
    
    if (olFeature) {
      olFeature.setStyle(hoverFeatureStyle);
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features: [olFeature] }),
        zIndex: 998, // 선택된 피처보다 낮은 zIndex
      });
      mapRef.current.addLayer(vectorLayer);
      hoverLayerRef.current = vectorLayer;
      console.log('✅ OSSMAP 호버 레이어 추가 완료');
    }
  }, [hoverFeature]);

  // Selection hooks 관리 (간단한 방식)
  useEffect(() => {
    if (!mapRef.current || !layerData) return;

    // 초기 모드 설정 - 기본 선택 모드로 시작
    useMapbase.getState().setMode('select');
    
    return () => {
      // hooks 정리
      basicSelect.deactivate();
      advancedSelect.deactivate();
    };
  }, [mapRef.current, layerData]);

  // 레이어 참조들
  const tileWmsLayerRef = useRef<any>(null);
  const vectorTileLayersRef = useRef<any[]>([]);
  const highlightLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const hoverLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // 지도 초기화
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // EPSG:5179 중심좌표로 변환
    const center5179 = transform([127.062289345605, 37.5087805938127], 'EPSG:4326', 'EPSG:5179');
    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        projection: getProjection('EPSG:5179') ?? 'EPSG:5179',
        center: center5179,
        zoom: 13
      }),
      interactions: [] // 기본 인터랙션 제거 (더블클릭 줌 포함)
    });

    mapRef.current = map;

    // 전역 상태에 지도 등록
    useMapbase.getState().setMap(map);

    // 필요한 인터랙션들만 추가 (더블클릭 줌 제외)
    import('ol/interaction').then(({ defaults }) => {
      const defaultInteractions = defaults({
        doubleClickZoom: false, // 더블클릭 줌 비활성화
        mouseWheelZoom: true,   // 마우스 휠 줌 활성화
        dragPan: true,          // 드래그 팬 활성화
        keyboard: true,         // 키보드 네비게이션 활성화
        pinchZoom: true,        // 핀치 줌 활성화
        shiftDragZoom: true     // Shift+드래그 줌 활성화
      });
      
      defaultInteractions.forEach(interaction => {
        map.addInteraction(interaction);
      });
    });

    // 지도 이벤트 리스너
    const updateMapInfo = () => {
      const view = map.getView();
      const center = view.getCenter();
      const zoom = view.getZoom();
      
      if (center && zoom !== undefined) {
        setMapInfo({
          center: center,
          zoom: zoom
        });
      }
    };

    map.on('moveend' as any, () => {
      updateMapInfo();
      // 히스토리 저장
      useMapHistoryStore.getState().onMoveEnd();
    });
    map.on('zoomend' as any, () => {
      updateMapInfo();
      // 히스토리 저장
      useMapHistoryStore.getState().onMoveEnd();
    });

    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, []);

  // 레이어 데이터 동기화 및 초기 체크된 레이어 설정
  useEffect(() => {
    if (layerData) {
      useMapbase.getState().setLayerData(layerData);
      
      // 초기 체크된 레이어 설정 (visible이 true인 레이어들)
      const initialCheckedLayers = layerData
        .filter(layer => layer.visible)
        .map(layer => layer.value)
        .filter(value => typeof value === 'string') as string[];
      
      setCheckedLayers(initialCheckedLayers);
    }
  }, [layerData]);

  // 페이지 로드 시 select 기능 자동 활성화
  useEffect(() => {
    if (mapRef.current && layerData) {
      console.log('🔄 페이지 로드 시 select 기능 자동 활성화');
      
      // 기존 인터랙션 정리
      const existingInteractions = mapRef.current.getInteractions().getArray();
      existingInteractions.forEach(interaction => {
        if (interaction.get('isSelectInteraction')) {
          mapRef.current?.removeInteraction(interaction);
        }
      });
      
      // 기본 select 모드 활성화
      activateSelectMode(mapRef.current);
      
      // useMapbase 상태도 select로 설정
      useMapbase.getState().setMode('select');
      
      // 지도 강제 렌더링
      mapRef.current.render();
      
      console.log('✅ select 기능 자동 활성화 완료');
      
      // 추가: 지연된 재활성화 (더 확실한 초기화)
      setTimeout(() => {
        console.log('🔄 지연된 select 기능 재활성화');
        
        // 다시 한번 기존 인터랙션 정리
        const existingInteractions2 = mapRef.current?.getInteractions().getArray() || [];
        existingInteractions2.forEach(interaction => {
          if (interaction.get('isSelectInteraction')) {
            mapRef.current?.removeInteraction(interaction);
          }
        });
        
        // select 모드 재활성화
        activateSelectMode(mapRef.current);
        useMapbase.getState().setMode('select');
        
        mapRef.current?.render();
        
        console.log('✅ 지연된 select 기능 재활성화 완료');
      }, 500);
    }
  }, [mapRef.current, layerData]);

  // 벡터타일 레이어 추가 (줌 레벨 13 이상)
  useEffect(() => {
    const mapStore = useMapbase.getState();
    const { layerData: layerDataStore } = mapStore;
    if (mapRef.current && layerDataStore) {
      const handleZoomChange = () => {
        if (!mapRef.current) return;
        const zoom = Math.floor(mapRef.current.getView()?.getZoom() ?? 0);
        const isZoomForMVT = zoom >= 13;
        
        // 현재 활성 모드 확인
        const currentMode = useMapbase.getState().drawMode?.mode;
        const isAdvancedTrailDrawPointMode = currentMode === 'advanced-trail-draw-point';
        
        if (isZoomForMVT) {
          // 기존 벡터타일 레이어 제거
          vectorTileLayersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
          
          // 새로운 벡터타일 레이어 추가
          vectorTileLayersRef.current = layerDataStore.map(layer => {
            const vectorLayer = createVectorLayer(layer, mapStore.defaultStyles);
            mapRef.current?.addLayer(vectorLayer);
            return vectorLayer;
          });
        } else {
          // 줌 레벨이 낮으면 벡터타일 레이어 제거
          vectorTileLayersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
          vectorTileLayersRef.current = [];
        }
        
        // Advanced Trail Draw Point 모드인 경우 모드 유지
        if (isAdvancedTrailDrawPointMode) {
          console.log('🔧 줌 변경 시 Advanced Trail Draw Point 모드 유지');
          // 모드를 다시 설정하여 유지
          useMapbase.getState().setMode('advanced-trail-draw-point');
        }
      };

      mapRef.current.getView().on('change:resolution', handleZoomChange);
      setTimeout(() => {
        handleZoomChange();
      }, 0);
      
      return () => {
        if (mapRef.current) {
          mapRef.current.getView().un('change:resolution', handleZoomChange);
        }
      };
    }
  }, [useMapbase.getState().layerData, useMapbase.getState().defaultStyles]);

  // WMS 이미지 레이어 추가
  useEffect(() => {
    if (mapRef.current && layerData && dataStyles) {
      const zoom = Math.floor(mapRef.current?.getView().getZoom() ?? 0);
      const layersFilter = layerData
        .filter((item: any) => item.minZoom <= zoom && zoom <= item.maxZoom)
        .filter((item: any) => item.visible);
      const layerNames = layersFilter.map((item: any) => item.value);
      const styleNames = layerNames.map((layerName: any) => {
        const found = layerData.find((item: any) => item.value === layerName);
        return found && found.styleName ? found.styleName : '';
      });
      
      if (tileWmsLayerRef.current) {
        tileWmsLayerRef.current?.getSource()?.updateParams({ LAYERS: layerNames, STYLES: styleNames });
        tileWmsLayerRef.current.setVisible(true);
        tileWmsLayerRef.current?.getSource()?.refresh();
      } else {
        const newTileWmsLayer = createImageLayer(layerNames.join(','), styleNames.join(','));
        mapRef.current?.addLayer(newTileWmsLayer);
        tileWmsLayerRef.current = newTileWmsLayer;
      }
    }
  }, [mapRef.current, layerData, dataStyles]);

  // 레이어 컨트롤 토글 핸들러
  const handleToggleLayerControl = () => {
    setShowLayerControl(v => !v);
  };

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    if (e.target instanceof HTMLElement) {
      const rect = e.target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setHasMoved(false);
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 드래그 중 핸들러
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - dragStartPos.x, 2) + 
        Math.pow(e.clientY - dragStartPos.y, 2)
      );
      
      if (moveDistance > 3) {
        setHasMoved(true);
      }
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - 48;
      const maxY = window.innerHeight - 48;
      
      setLayerControlPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // 레이어 체크박스 변경 핸들러
  const handleLayerCheckboxChange = (checkedValues: any) => {
    const checked = checkedValues.filter((v: any) => typeof v === 'string') as string[];
    setCheckedLayers(checked);
    
    if (layerData) {
      layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = checked.includes(layer.value);
        }
      });
      
      if (mapRef.current) {
        // 기존 벡터 타일 레이어 제거
        vectorTileLayersRef.current.forEach(layer => {
          mapRef.current?.removeLayer(layer);
        });
        
        // 새로운 벡터 타일 레이어 추가
        const zoom = Math.floor(mapRef.current.getView()?.getZoom() ?? 0);
        const isZoomForMVT = zoom >= 13;
        if (isZoomForMVT) {
          const visibleLayers = layerData.filter(layer => layer.visible);
          vectorTileLayersRef.current = visibleLayers.map(layer => {
            const vectorLayer = createVectorLayer(layer, useMapbase.getState().defaultStyles);
            mapRef.current?.addLayer(vectorLayer);
            return vectorLayer;
          });
        }
        
        // WMS 레이어 업데이트
        if (tileWmsLayerRef.current) {
          const layersFilter = layerData
            .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
            .filter(item => item.visible);
          const layerNames = layersFilter.map(item => item.value);
          tileWmsLayerRef.current.getSource()?.updateParams({ LAYERS: layerNames.join(',') });
          tileWmsLayerRef.current.setVisible(layerNames.length > 0);
          tileWmsLayerRef.current.getSource()?.refresh();
        }
        
        mapRef.current.render();
      }
    }
  };

  // 모든 레이어 보기
  const handleShowAllLayers = () => {
    if (layerData) {
      const allLayerValues = layerData
        .filter(l => typeof l.value === 'string')
        .map(l => l.value as string);
      setCheckedLayers(allLayerValues);
      
      layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = true;
        }
      });
      
      if (mapRef.current) {
        vectorTileLayersRef.current.forEach(layer => {
          mapRef.current?.removeLayer(layer);
        });
        
        const zoom = Math.floor(mapRef.current.getView()?.getZoom() ?? 0);
        const isZoomForMVT = zoom >= 13;
        if (isZoomForMVT) {
          vectorTileLayersRef.current = layerData.map(layer => {
            const vectorLayer = createVectorLayer(layer, useMapbase.getState().defaultStyles);
            mapRef.current?.addLayer(vectorLayer);
            return vectorLayer;
          });
        }
        
        if (tileWmsLayerRef.current) {
          const layersFilter = layerData
            .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
            .filter(item => item.visible);
          const layerNames = layersFilter.map(item => item.value);
          tileWmsLayerRef.current.getSource()?.updateParams({ LAYERS: layerNames.join(',') });
          tileWmsLayerRef.current.setVisible(layerNames.length > 0);
          tileWmsLayerRef.current.getSource()?.refresh();
        }
        
        mapRef.current.render();
      }
    }
  };

  // 모든 레이어 숨기기
  const handleHideAllLayers = () => {
    setCheckedLayers([]);
    
    if (layerData) {
      layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = false;
        }
      });
      
      if (mapRef.current) {
        vectorTileLayersRef.current.forEach(layer => {
          mapRef.current?.removeLayer(layer);
        });
        vectorTileLayersRef.current = [];
        
        if (tileWmsLayerRef.current) {
          tileWmsLayerRef.current.setVisible(false);
          tileWmsLayerRef.current.getSource()?.updateParams({ LAYERS: '' });
          tileWmsLayerRef.current.getSource()?.refresh();
        }
        
        mapRef.current.render();
      }
    }
  };

  // 도구 모음 토글 핸들러
  const handleToggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  // select 드롭다운 토글 핸들러
  const handleSelectDropdownToggle = () => {
    setShowSelectDropdown(!showSelectDropdown);
  };

  // select 도구 선택 핸들러
  const handleSelectToolSelect = (tool: 'select' | 'advancedSelect' | 'rectSelect' | 'circleSelect' | 'polygonSelect') => {
    setCurrentSelectTool(tool);
    setShowSelectDropdown(false);
    
    console.log('🔄 Select 도구 선택:', tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 기존 모든 훅 비활성화
    try {
      basicSelect.deactivate();
      advancedSelect.deactivate();
      // Drawing 훅들은 cleanup 함수로 정리
      TrailDrawPointService.cleanupAll();
      AdvancedTrailDrawPointService.cleanupAll();
      TrailDrawLineService.cleanupAll();
      AdvancedTrailDrawLineService.cleanupAll();
      TrailDrawPolygonService.cleanupAll();
      AdvancedTrailDrawPolygonService.cleanupAll();
      console.log('✅ 기존 훅들 비활성화 완료');
    } catch (error) {
      console.log('⚠️ 기존 훅 비활성화 중 오류:', error);
    }
    
    // 새로운 모드 관리 구조 사용
    const mapbase = useMapbase.getState();
    
    // Select 모드 설정 및 훅 활성화
    switch (tool) {
      case 'select':
        mapbase.setSelectMode?.('basic');
        // 기존 선택 인터랙션들 정리 (사각형, 원형, 폴리곤 선택)
        const map = mapRef.current;
        if (map) {
          const interactions = map.getInteractions().getArray();
          interactions.forEach(interaction => {
            const id = interaction.get('id');
            if (id === 'rect-selection' || id === 'circle-selection' || id === 'polygon-selection') {
              map.removeInteraction(interaction);
              console.log('🗑️ 기존 선택 인터랙션 제거:', id);
            }
          });
        }
        basicSelect.activate();
        console.log('✅ 기본 Select 모드 활성화');
        break;
      case 'advancedSelect':
        mapbase.setSelectMode?.('advanced');
        // 기존 선택 인터랙션들 정리 (사각형, 원형, 폴리곤 선택)
        const map2 = mapRef.current;
        if (map2) {
          const interactions = map2.getInteractions().getArray();
          interactions.forEach(interaction => {
            const id = interaction.get('id');
            if (id === 'rect-selection' || id === 'circle-selection' || id === 'polygon-selection') {
              map2.removeInteraction(interaction);
              console.log('🗑️ 기존 선택 인터랙션 제거:', id);
            }
          });
        }
        // Advanced Select 활성화 (비동기로 Vector 레이어 생성)
        advancedSelect.activate().then(() => {
          console.log('✅ 고급 Select 모드 활성화 완료');
        }).catch((error) => {
          console.error('❌ 고급 Select 모드 활성화 오류:', error);
        });
        break;
      case 'rectSelect':
        mapbase.setSelectMode?.('rect');
        // Drawing 훅들 추가 정리 (Selection 훅의 checkInteraction이 Drawing 인터랙션을 제거하지 않음)
        TrailDrawPointService.cleanupAll();
        AdvancedTrailDrawPointService.cleanupAll();
        TrailDrawLineService.cleanupAll();
        AdvancedTrailDrawLineService.cleanupAll();
        startRectSelection(layerData);
        console.log('✅ 사각형 Select 모드 활성화');
        break;
      case 'circleSelect':
        mapbase.setSelectMode?.('circle');
        // Drawing 훅들 추가 정리
        TrailDrawPointService.cleanupAll();
        AdvancedTrailDrawPointService.cleanupAll();
        TrailDrawLineService.cleanupAll();
        AdvancedTrailDrawLineService.cleanupAll();
        startCircleSelection(layerData);
        console.log('✅ 원형 Select 모드 활성화');
        break;
      case 'polygonSelect':
        mapbase.setSelectMode?.('polygon');
        // Drawing 훅들 추가 정리
        TrailDrawPointService.cleanupAll();
        AdvancedTrailDrawPointService.cleanupAll();
        TrailDrawLineService.cleanupAll();
        AdvancedTrailDrawLineService.cleanupAll();
        startPolygonSelection(layerData);
        console.log('✅ 폴리곤 Select 모드 활성화');
        break;
    }
    
    // UI 상태 업데이트
    setActiveToolWithLog(tool);
  };

  // point 드롭다운 토글 핸들러
  const handlePointDropdownToggle = () => {
    setShowPointDropdown(!showPointDropdown);
  };

  // point 도구 선택 핸들러
  const handlePointToolSelect = (tool: 'drawPoint' | 'advancedDrawPoint') => {
    setCurrentPointTool(tool);
    setShowPointDropdown(false);
    
    console.log('🔄 Point 도구 선택:', tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 기존 모든 훅 비활성화
    try {
      basicSelect.deactivate();
      advancedSelect.deactivate();
      // Drawing 훅들은 cleanup 함수로 정리
      TrailDrawPointService.cleanupAll();
      AdvancedTrailDrawPointService.cleanupAll();
      TrailDrawLineService.cleanupAll();
      AdvancedTrailDrawLineService.cleanupAll();
      TrailDrawPolygonService.cleanupAll();
      AdvancedTrailDrawPolygonService.cleanupAll();
      
      // 측정 도구에서 전환 시 레이어 정리
      if (activeTool === 'trailDistance' || activeTool === 'trailArea') {
        console.log('🔧 측정 도구에서 Point 도구로 전환 - 측정 레이어 정리');
        cleanupMeasurementLayers();
      }
      
      console.log('✅ 기존 훅들 비활성화 완료');
    } catch (error) {
      console.log('⚠️ 기존 훅 비활성화 중 오류:', error);
    }
    
    // 새로운 모드 관리 구조 사용
    const mapbase = useMapbase.getState();
    
    // Point Draw 모드 설정 및 훅 활성화
    switch (tool) {
      case 'drawPoint':
        mapbase.setPointDrawMode?.('basic');
        activateTrailDrawPointMode({
          showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 기본 Point Draw 모드 활성화');
        break;
      case 'advancedDrawPoint':
        mapbase.setPointDrawMode?.('advanced');
        activateAdvancedTrailDrawPointMode({
          showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 고급 Point Draw 모드 활성화');
        break;
    }
    
    // UI 상태 업데이트
    setActiveToolWithLog(tool);
  };

  // line 드롭다운 토글 핸들러
  const handleLineDropdownToggle = () => {
    setShowLineDropdown(!showLineDropdown);
  };

  // line 도구 선택 핸들러
  const handleLineToolSelect = (tool: 'drawLine' | 'advancedDrawLine') => {
    setCurrentLineTool(tool);
    setShowLineDropdown(false);
    
    console.log('🔄 Line 도구 선택:', tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 기존 모든 훅 비활성화
    try {
      basicSelect.deactivate();
      advancedSelect.deactivate();
      // Drawing 훅들은 cleanup 함수로 정리
      TrailDrawPointService.cleanupAll();
      AdvancedTrailDrawPointService.cleanupAll();
      TrailDrawLineService.cleanupAll();
      AdvancedTrailDrawLineService.cleanupAll();
      TrailDrawPolygonService.cleanupAll();
      AdvancedTrailDrawPolygonService.cleanupAll();
      
      // 측정 도구에서 전환 시 레이어 정리
      if (activeTool === 'trailDistance' || activeTool === 'trailArea') {
        console.log('🔧 측정 도구에서 Line 도구로 전환 - 측정 레이어 정리');
        cleanupMeasurementLayers();
      }
      
      console.log('✅ 기존 훅들 비활성화 완료');
    } catch (error) {
      console.log('⚠️ 기존 훅 비활성화 중 오류:', error);
    }
    
    // 새로운 모드 관리 구조 사용
    const mapbase = useMapbase.getState();
    
    // Line Draw 모드 설정 및 훅 활성화
    switch (tool) {
      case 'drawLine':
        mapbase.setLineDrawMode?.('basic');
        activateTrailDrawLineMode({
          showLineTypeSelectorPopup: showLineTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 기본 Line Draw 모드 활성화');
        break;
      case 'advancedDrawLine':
        mapbase.setLineDrawMode?.('advanced');
        activateAdvancedTrailDrawLineMode({
          showLineTypeSelectorPopup: showLineTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 고급 Line Draw 모드 활성화');
        break;
    }
    
    // UI 상태 업데이트
    setActiveToolWithLog(tool);
  };

  // polygon 드롭다운 토글 핸들러
  const handlePolygonDropdownToggle = () => {
    setShowPolygonDropdown(!showPolygonDropdown);
  };

  // polygon 도구 선택 핸들러
  const handlePolygonToolSelect = (tool: 'drawPolygon' | 'advancedDrawPolygon') => {
    setCurrentPolygonTool(tool);
    setShowPolygonDropdown(false);
    
    console.log('🔄 Polygon 도구 선택:', tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 기존 모든 훅 비활성화
    try {
      basicSelect.deactivate();
      advancedSelect.deactivate();
      // Drawing 훅들은 cleanup 함수로 정리
      TrailDrawPointService.cleanupAll();
      AdvancedTrailDrawPointService.cleanupAll();
      TrailDrawLineService.cleanupAll();
      AdvancedTrailDrawLineService.cleanupAll();
      TrailDrawPolygonService.cleanupAll();
      AdvancedTrailDrawPolygonService.cleanupAll();
      
      // 측정 도구에서 전환 시 레이어 정리
      if (activeTool === 'trailDistance' || activeTool === 'trailArea') {
        console.log('🔧 측정 도구에서 Polygon 도구로 전환 - 측정 레이어 정리');
        cleanupMeasurementLayers();
      }
      
      console.log('✅ 기존 훅들 비활성화 완료');
    } catch (error) {
      console.log('⚠️ 기존 훅 비활성화 중 오류:', error);
    }
    
    // 새로운 모드 관리 구조 사용
    const mapbase = useMapbase.getState();
    
    // Polygon Draw 모드 설정 및 훅 활성화
    switch (tool) {
      case 'drawPolygon':
        mapbase.setPolygonDrawMode?.('basic');
        activateTrailDrawPolygonMode({
          showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 기본 Polygon Draw 모드 활성화');
        break;
      case 'advancedDrawPolygon':
        mapbase.setPolygonDrawMode?.('advanced');
        activateAdvancedTrailDrawPolygonMode({
          showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            drawnFeatureRef.current = feature;
          }
        });
        console.log('✅ 고급 Polygon Draw 모드 활성화');
        break;
    }
    
    // UI 상태 업데이트
    setActiveToolWithLog(tool);
  };

  const handleRotateDropdownToggle = () => {
    setShowRotateDropdown(!showRotateDropdown);
    setShowSelectDropdown(false);
    setShowPointDropdown(false);
    setShowLineDropdown(false);
  };

  const handleRotateToolSelect = (tool: 'rotateCw' | 'rotateCcw') => {
    setCurrentRotateTool(tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 드롭다운을 닫지 않음 - 연속 회전을 위해
    
    if (tool === 'rotateCw') {
      // 시계방향 회전
      const result = mapPan.rotate({ angle: Math.PI / 4, duration: 500 });
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } else {
      // 반시계방향 회전
      const result = mapPan.rotate({ angle: -Math.PI / 4, duration: 500 });
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    }
  };

  const handleZoomDropdownToggle = () => {
    setShowZoomDropdown(!showZoomDropdown);
    setShowSelectDropdown(false);
    setShowPointDropdown(false);
    setShowLineDropdown(false);
    setShowRotateDropdown(false);
  };

  const handleZoomToolSelect = (tool: 'zoomIn' | 'zoomOut') => {
    setCurrentZoomTool(tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 드롭다운을 닫지 않음 - 연속 줌을 위해
    
    if (tool === 'zoomIn') {
      // 줌 인
      handleZoomIn();
    } else {
      // 줌 아웃
      handleZoomOut();
    }
  };

  const handleMoveDropdownToggle = () => {
    setShowMoveDropdown(!showMoveDropdown);
    setShowSelectDropdown(false);
    setShowPointDropdown(false);
    setShowLineDropdown(false);
    setShowRotateDropdown(false);
    setShowZoomDropdown(false);
  };

  const handleMoveToolSelect = (tool: 'panUp' | 'panDown' | 'panLeft' | 'panRight' | 'panCoordinate' | 'panPrevious' | 'panForward') => {
    setCurrentMoveTool(tool);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 드롭다운을 닫지 않음 - 연속 이동을 위해
    
    switch (tool) {
      case 'panUp':
        // 위로 이동 (픽셀 단위)
        const resultUp = mapPan.panBy({ offsetX: 0, offsetY: -100, duration: 300 });
        if (resultUp.success) {
          console.log(resultUp.message);
        } else {
          console.error(resultUp.message);
        }
        break;
      case 'panDown':
        // 아래로 이동 (픽셀 단위)
        const resultDown = mapPan.panBy({ offsetX: 0, offsetY: 100, duration: 300 });
        if (resultDown.success) {
          console.log(resultDown.message);
        } else {
          console.error(resultDown.message);
        }
        break;
      case 'panLeft':
        // 왼쪽으로 이동 (픽셀 단위)
        const resultLeft = mapPan.panBy({ offsetX: -100, offsetY: 0, duration: 300 });
        if (resultLeft.success) {
          console.log(resultLeft.message);
        } else {
          console.error(resultLeft.message);
        }
        break;
      case 'panRight':
        // 오른쪽으로 이동 (픽셀 단위)
        const resultRight = mapPan.panBy({ offsetX: 100, offsetY: 0, duration: 300 });
        if (resultRight.success) {
          console.log(resultRight.message);
        } else {
          console.error(resultRight.message);
        }
        break;

      case 'panCoordinate':
        // 특정 좌표로 이동 - 모달 표시
        setShowCoordinateModal(true);
        setShowMoveDropdown(false);
        break;
      case 'panPrevious':
        // 이전 위치로 이동 (Previous Screen)
        const resultPrevious = mapHistory.prevScreen();
        if (resultPrevious.success) {
          console.log(resultPrevious.message);
        } else {
          console.error(resultPrevious.message);
        }
        break;
      case 'panForward':
        // 다음 위치로 이동 (Forward Screen)
        const resultForward = mapHistory.forwardScreen();
        if (resultForward.success) {
          console.log(resultForward.message);
        } else {
          console.error(resultForward.message);
        }
        break;
    }
  };

  // 측정 도구 핸들러들
  const handleMeasurementDropdownToggle = () => {
    setShowMeasurementDropdown(!showMeasurementDropdown);
  };

  const handleMeasurementToolSelect = (tool: 'trailDistance' | 'trailArea') => {
    setCurrentMeasurementTool(tool);
    setShowMeasurementDropdown(false);
    
    // 팝업 정리
    cleanupDrawingPopups();
    
    // 측정 도구 간 전환 시 레이어 정리
    if ((activeTool === 'trailDistance' && tool === 'trailArea') || 
        (activeTool === 'trailArea' && tool === 'trailDistance')) {
      console.log('🔧 측정 도구 간 전환 - 측정 결과 정리');
      cleanupMeasurementLayers();
    }
    
    // MainPage 방식으로 수정: useMapbase의 setMode 사용
    const mapbase = useMapbase.getState();
    
    // Measurement 모드 설정 (MainPage와 동일한 방식)
    switch (tool) {
      case 'trailDistance':
        mapbase.setMode('trail-distance');
        break;
      case 'trailArea':
        mapbase.setMode('trail-area');
        break;
    }
    
    // UI 상태 업데이트
    setActiveToolWithLog(tool);
  };

  // 좌표 입력 모달 핸들러들
  const handleCoordinateSubmit = () => {
    const x = parseFloat(coordinateX);
    const y = parseFloat(coordinateY);
    
    if (isNaN(x) || isNaN(y)) {
      alert('올바른 좌표를 입력해주세요.');
      return;
    }
    
    // 특정 좌표로 이동
    const resultCoordinate = mapPan.panTo({ center: [x, y], duration: 500 });
    if (resultCoordinate.success) {
      console.log(resultCoordinate.message);
    } else {
      console.error(resultCoordinate.message);
    }
    
    // 모달 닫기 및 입력값 초기화
    setShowCoordinateModal(false);
    setCoordinateX('');
    setCoordinateY('');
  };

  const handleCoordinateCancel = () => {
    setShowCoordinateModal(false);
    setCoordinateX('');
    setCoordinateY('');
  };

  // 투명도 설정 모달 핸들러들
  const handleOpacitySubmit = async () => {
    if (!selectedLayer) {
      alert('레이어를 선택해주세요.');
      return;
    }
    
    try {
      const result = await setLayerOpacity(selectedLayer, opacityValue);
      if (result.success) {
        console.log(result.message);
        alert(`레이어 투명도가 ${opacityValue}로 설정되었습니다.`);
      } else {
        console.error(result.message);
        alert('레이어 투명도 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('투명도 설정 중 오류:', error);
      alert('투명도 설정 중 오류가 발생했습니다.');
    }
    
    // 모달 닫기
    setShowOpacityModal(false);
  };

  const handleOpacityCancel = () => {
    setShowOpacityModal(false);
    setSelectedLayer('');
    setOpacityValue(1.0);
  };

  const handleOpacityReset = async () => {
    if (!selectedLayer) {
      alert('레이어를 선택해주세요.');
      return;
    }
    
    try {
      const result = await resetLayerOpacity(selectedLayer);
      if (result.success) {
        console.log(result.message);
        alert('레이어 투명도가 초기화되었습니다.');
        setOpacityValue(1.0);
      } else {
        console.error(result.message);
        alert('레이어 투명도 초기화 실패: ' + result.message);
      }
    } catch (error) {
      console.error('투명도 초기화 중 오류:', error);
      alert('투명도 초기화 중 오류가 발생했습니다.');
    }
  };

  // 설정 드롭다운 핸들러들
  const handleSettingsDropdownToggle = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
    setShowSelectDropdown(false);
    setShowPointDropdown(false);
    setShowLineDropdown(false);
    setShowRotateDropdown(false);
    setShowZoomDropdown(false);
    setShowMoveDropdown(false);
  };

  const handleSettingsOptionSelect = (option: string) => {
    setShowSettingsDropdown(false);
    
    switch (option) {
      case 'layerOpacity':
        setShowOpacityModal(true);
        break;

      // 향후 다른 설정 옵션들을 여기에 추가
      default:
        console.log('알 수 없는 설정 옵션:', option);
    }
  };

  // 우클릭 메뉴 핸들러
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    
    console.log('Right-click detected:', {
      contextMenuEnabled: contextMenuEnabled,
      contextMenuDataLength: contextMenuData?.length,
      contextMenuData: contextMenuData,
      selectedFeaturesLength: selectedFeatures?.length
    });
    
    if (contextMenuEnabled && contextMenuData && contextMenuData.length > 0 && selectedFeatures && selectedFeatures.length > 0) {
      show({ event: e });
    }
  };

  const handleMenuClick = (item: any) => {
    console.log('메뉴 클릭:', item);
    
    // 메뉴 아이템의 onClick 함수가 있으면 실행
    if (item.onClick && typeof item.onClick === 'function') {
      item.onClick();
    }
  };

  // 우클릭 메뉴 이벤트 리스너 설정
  useEffect(() => {
    const mapDiv = mapContainerRef.current;
    if (!mapDiv) return;

    const handleContextMenuEvent = (e: MouseEvent) => {
      handleContextMenu(e);
    };

    mapDiv.addEventListener('contextmenu', handleContextMenuEvent);
    return () => {
      mapDiv.removeEventListener('contextmenu', handleContextMenuEvent);
    };
  }, [mapContainerRef, contextMenuEnabled, contextMenuData, show]);



  // 전역 함수 설정 (ContextMenu에서 사용)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // mapRef를 전역으로 설정
      (window as any).mapbaseStore = {
        getState: () => ({
          mapRef: { current: mapRef.current },
          setDefaultContextMenu: () => {
            console.log('setDefaultContextMenu 호출됨');
            return { success: true };
          },
          setEditContextMenu: () => {
            console.log('setEditContextMenu 호출됨');
            return { success: true };
          }
        })
      };
      
      (window as any).activateTrailEditMode = (map: any) => {
        try {
          activateTrailEditMode(mapRef.current);
          console.log('Trail Edit 모드 활성화됨');
        } catch (error) {
          console.error('Trail Edit 모드 활성화 실패:', error);
        }
      };
      
      (window as any).activateTrailDeleteMode = async (map: any) => {
        try {
          console.log('🔧 activateTrailDeleteMode 호출됨');
          
          const selected = useMapbase.getState().selectedFeatures;
          
          if (!selected || selected.length !== 1) {
            alert('삭제할 피처를 하나만 선택하세요.');
            return;
          }

          const selectedFeature = selected[0];
          console.log('🗑️ 삭제할 피처:', {
            id: selectedFeature.id,
            type: selectedFeature.geometry?.type,
            coordinates: selectedFeature.geometry?.coordinates
          });

          // layerDelete를 사용하여 삭제 실행
          const result = await layerDelete.deleteFeature({ feature: selectedFeature });
          
          if (result.success) {
            alert('피처가 성공적으로 삭제되었습니다.');
            
            // 선택 해제
            useMapbase.getState().setSelectedFeatures([]);
            
            // WMS 레이어 새로고침
            if (mapRef.current) {
              const layers = mapRef.current.getLayers().getArray() || [];
              layers.forEach(layer => {
                const source = (layer as any).getSource?.();
                if (source && typeof source.refresh === 'function') {
                  console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                  source.refresh();
                }
              });
            }
            
            // WMS 새로고침 후 선택 기능 재활성화 (수정과 동일한 방식)
            setTimeout(() => {
              console.log('🔄 삭제 후 선택 기능 재활성화');
              
              // 모든 선택 관련 인터랙션 제거
              const existingInteractions = mapRef.current?.getInteractions().getArray() || [];
              existingInteractions.forEach(interaction => {
                if (interaction.get('isSelectInteraction')) {
                  mapRef.current?.removeInteraction(interaction);
                }
              });
              
              // 선택 모드 재활성화
              if (activeTool === 'advancedSelect') {
                console.log('🔄 Advanced Select 모드 재활성화');
                activateAdvancedSelectMode(mapRef.current);
              } else if (activeTool === 'select') {
                console.log('🔄 Basic Select 모드 재활성화');
                activateSelectMode(mapRef.current);
              }
              
              // 지도 렌더링 강제 업데이트
              mapRef.current?.render();
              
              console.log('✅ 삭제 후 선택 기능 재활성화 완료');
            }, 500);
            
            // bbox 기반 피처 로드는 제거하고 수정과 동일한 방식으로만 처리
          } else {
            alert('삭제 실패: ' + result.message);
          }
        } catch (error) {
          console.error('🗑️ 삭제 중 오류:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      };
    }
  }, [mapRef.current]);

  // 편집 모드 체크 useEffect (메인 페이지와 동일한 로직)
  useEffect(() => {
    const checkEditMode = () => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      const currentFeatureId = useMapbase.getState().drawMode?.options?.feature?.id;
      
      if (currentMode === 'trail-edit') {
        const selectedFeature = useMapbase.getState().drawMode?.options?.feature;
        const geoType = useMapbase.getState().drawMode?.options?.geoType;
        
        if (!selectedFeature || !mapRef.current) {
          return;
        }
        
        // 중복 실행 방지 - 더 엄격한 체크
        if (editModeRef.current.mode === 'trail-edit' && editModeRef.current.featureId === currentFeatureId) {
          return;
        }
        
        // 편집 모드 상태 업데이트
        editModeRef.current = { mode: currentMode || '', featureId: currentFeatureId || null };
        setIsEditModeActive(true);
        
        console.log('🔧 편집 모드 활성화됨:', { selectedFeature, geoType });

        // 기존 편집 인터랙션과 레이어 정리
        const existingInteractions = mapRef.current.getInteractions().getArray();
        existingInteractions.forEach(interaction => {
          if (interaction instanceof Translate || interaction instanceof Modify || interaction instanceof Snap) {
            mapRef.current?.removeInteraction(interaction);
          }
        });

        // 기존 편집용 레이어 제거
        const existingLayers = mapRef.current.getLayers().getArray();
        existingLayers.forEach(layer => {
          if (layer.get('isEditLayer')) {
            mapRef.current?.removeLayer(layer);
          }
        });

        // 선택된 feature를 직접 사용하여 편집용 레이어 생성
        const originalGeometry = selectedFeature.geometry;
        if (!originalGeometry) {
          console.error('선택된 객체의 geometry를 찾을 수 없습니다.');
          return;
        }
        
        console.log('Original geometry:', originalGeometry);
        console.log('Geometry type:', originalGeometry.type);
        console.log('Geometry coordinates:', originalGeometry.coordinates);
        
        const olGeometry = createOLGeometry(originalGeometry);
        if (!olGeometry) {
          console.error('Geometry 변환 실패 - originalGeometry:', originalGeometry);
          return;
        }

        // 편집용 feature 생성
        const editFeature = new Feature(olGeometry);
        editFeature.setId(selectedFeature.id);
        editFeature.setProperties(selectedFeature.properties || {});
        
        // 편집용 레이어 생성
        const editSource = new VectorSource();
        const editLayer = new VectorLayer({
          source: editSource,
          zIndex: 1000,
          style: new Style({
            stroke: new Stroke({ color: '#00ff00', width: 5 }),
            fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({ color: '#00ff00' }),
              stroke: new Stroke({ color: '#ffffff', width: 2 })
            })
          })
        });
        editLayer.set('isEditLayer', true);
        editSource.addFeature(editFeature);
        mapRef.current.addLayer(editLayer);

        // 편집 인터랙션 추가
        const modify = new Modify({
          source: editSource
        });

        const snap = new Snap({
          source: editSource
        });

        mapRef.current.addInteraction(modify);
        mapRef.current.addInteraction(snap);

        // 수정 완료 이벤트 처리 (메인 페이지와 동일한 로직)
        modify.on('modifyend', async (event) => {
          console.log('🔧 수정 완료:', event);
          const modifiedFeature = event.features.getArray()[0];
          if (modifiedFeature) {
            const geometry = modifiedFeature.getGeometry();
            if (geometry) {
              const coordinates = (geometry as any).getCoordinates?.();
              
              // 좌표 유효성 검증
              console.log('Modified coordinates:', coordinates);
              if (!coordinates || !Array.isArray(coordinates)) {
                console.error('Invalid coordinates after modification:', coordinates);
                alert('편집 후 좌표가 유효하지 않습니다. 다시 시도해주세요.');
                return;
              }
              
              // 좌표 내부에 undefined, null, NaN 값이 있는지 확인
              const hasInvalidValues = (arr: any[]): boolean => {
                return arr.some(item => {
                  if (Array.isArray(item)) {
                    return hasInvalidValues(item);
                  }
                  return item === undefined || item === null || isNaN(item);
                });
              };
              
              if (hasInvalidValues(coordinates)) {
                console.error('Coordinates contain invalid values:', coordinates);
                alert('편집 후 좌표에 유효하지 않은 값이 포함되어 있습니다. 다시 시도해주세요.');
                return;
              }
              
              // Polygon의 경우 최소 3개 점이 필요
              if (geometry.getType() === 'Polygon' && coordinates.length > 0 && coordinates[0].length < 3) {
                console.error('Polygon has insufficient points:', coordinates[0].length);
                alert('폴리곤은 최소 3개의 점이 필요합니다. 다시 시도해주세요.');
                return;
              }
              
              // WFS를 통해 서버에 저장
              try {
                const geometryType = geometry.getType();
                
                // 선택된 feature에서 정보 추출
                const featureId = selectedFeature.id;
                const layerName = featureId ? featureId.split('.')[0] : 'unknown';
                
                const newGeometry = {
                  type: geometryType,
                  coordinates: coordinates
                };
                
                console.log('=== OSSMAP updateFeatureViaWFS 호출 ===');
                console.log('Layer Name:', layerName);
                console.log('Feature ID:', featureId);
                console.log('New Geometry:', newGeometry);
                
                const result = await updateFeatureViaWFS(layerName, featureId, newGeometry);
                
                // WFS 응답에서 성공 여부 확인
                let isSuccess = false;
                const resultStr = String(result);
                if (resultStr.includes('totalUpdated="1"') || !resultStr.includes('Exception')) {
                  isSuccess = true;
                } else if (result && typeof result === 'object') {
                  isSuccess = (result as any).totalUpdated > 0 || (result as any).totalUpdated === 1;
                } else {
                  isSuccess = true;
                }
                
                if (isSuccess) {
                  alert('편집이 성공적으로 저장되었습니다.');
                  
                  // 1. 녹색 편집용 레이어 제거
                  mapRef.current?.removeLayer(editLayer);
                  
                  // 2. WMS 레이어 새로고침 강화 (이동된 위치에 feature 표시)
                  const layers = mapRef.current?.getLayers().getArray() || [];
                  layers.forEach(layer => {
                    if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                      const source = layer.getSource();
                      if (source && source.refresh) {
                        console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                        source.refresh();
                      }
                    }
                  });
                  
                  // 2-1. 추가 WMS 레이어 새로고침 (더 강력한 새로고침)
                  setTimeout(() => {
                    console.log('🔄 추가 WMS 레이어 새로고침 시작');
                    const layers2 = mapRef.current?.getLayers().getArray() || [];
                    layers2.forEach(layer => {
                      if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                        const source = layer.getSource();
                        if (source && source.refresh) {
                          console.log('🔄 추가 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                          source.refresh();
                        }
                      }
                    });
                    mapRef.current?.render();
                  }, 300);
                  
                  // 3. 선택된 feature를 새로운 위치로 업데이트
                  const updatedFeature = {
                    ...selectedFeature,
                    geometry: newGeometry
                  };
                  useMapbase.getState().setSelectedFeatures([updatedFeature]);
                  
                  // 4. 지도 렌더링 강화
                  mapRef.current?.render();
                  
                                    // 5. WMS 레이어가 완전히 새로고침될 때까지 대기
                  setTimeout(() => {
                    console.log('✅ WMS 레이어 새로고침 완료');
                    mapRef.current?.render();
                    
                                      // 5-1. 편집된 피처 강제 선택 가능하도록 추가 처리 (메인 페이지와 동일한 방식)
                  setTimeout(() => {
                    console.log('🔄 편집된 피처 선택 가능하도록 처리');
                    
                    // WMS 레이어 새로고침 (메인 페이지와 동일)
                    const allLayers = mapRef.current?.getLayers().getArray() || [];
                    allLayers.forEach(layer => {
                      if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                        const source = layer.getSource();
                        if (source && source.refresh) {
                          console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                          source.refresh();
                        }
                      }
                    });
                    
                    // 지도 강제 렌더링 (메인 페이지와 동일)
                    mapRef.current?.render();
                    
                    // 추가: 줌 레벨을 살짝 변경했다가 되돌려서 강제 렌더링 트리거
                    setTimeout(() => {
                      console.log('🔄 줌 레벨 변경으로 강제 렌더링 트리거');
                      const view = mapRef.current?.getView();
                      if (view) {
                        const currentZoom = view.getZoom();
                        const currentCenter = view.getCenter();
                        
                        // 줌 레벨을 살짝 변경
                        view.setZoom(currentZoom + 0.001);
                        mapRef.current?.render();
                        
                        // 즉시 원래 줌 레벨로 되돌림
                        setTimeout(() => {
                          view.setZoom(currentZoom);
                          view.setCenter(currentCenter);
                          mapRef.current?.render();
                          
                          // 선택 기능 재활성화
                          setTimeout(() => {
                            console.log('🔄 선택 기능 재활성화');
                            if (activeTool === 'advancedSelect') {
                              activateAdvancedSelectMode(mapRef.current);
                            } else if (activeTool === 'select') {
                              activateSelectMode(mapRef.current);
                            }
                            mapRef.current?.render();
                            console.log('✅ 선택 기능 재활성화 완료');
                          }, 100);
                        }, 50);
                      }
                    }, 300);
                    
                    console.log('✅ 편집된 피처 처리 완료');
                  }, 200);
                    
                    // 6. 편집 완료 후 선택 해제 (새로운 위치에서 재선택 가능하도록)
                    setTimeout(() => {
                      console.log('🔄 편집 완료 - 선택 해제');
                      useMapbase.getState().setSelectedFeatures([]);
                      
                      // 7. 편집 모드 완전 종료
                      console.log('🔄 편집 모드 종료');
                      useMapbase.getState().setMode('select');
                      setIsEditModeActive(false);
                      editModeRef.current = { mode: '', featureId: null };
                      
                      // 8. 편집 인터랙션 완전 제거
                      const existingInteractions = mapRef.current?.getInteractions().getArray() || [];
                      existingInteractions.forEach(interaction => {
                        if (interaction instanceof Translate || interaction instanceof Modify || interaction instanceof Snap) {
                          mapRef.current?.removeInteraction(interaction);
                        }
                      });
                      
                      // 9. 편집용 레이어 완전 제거
                      const existingLayers = mapRef.current?.getLayers().getArray() || [];
                      existingLayers.forEach(layer => {
                        if (layer.get('isEditLayer')) {
                          mapRef.current?.removeLayer(layer);
                        }
                      });
                      
                      // 10. 선택 기능 강제 재활성화 (WMS 새로고침 후 선택 기능 복구)
                      setTimeout(() => {
                        console.log('🔄 선택 기능 재활성화');
                        
                        // 모든 선택 관련 인터랙션 제거
                        const existingInteractions = mapRef.current?.getInteractions().getArray() || [];
                        existingInteractions.forEach(interaction => {
                          if (interaction.get('isSelectInteraction')) {
                            mapRef.current?.removeInteraction(interaction);
                          }
                        });
                        
                        // 선택 모드 재활성화
                        if (activeTool === 'advancedSelect') {
                          console.log('🔄 Advanced Select 모드 재활성화');
                          activateAdvancedSelectMode(mapRef.current);
                        } else if (activeTool === 'select') {
                          console.log('🔄 Basic Select 모드 재활성화');
                          activateSelectMode(mapRef.current);
                        }
                        
                        // 지도 렌더링 강제 업데이트
                        mapRef.current?.render();
                        
                        console.log('✅ 선택 기능 재활성화 완료');
                      }, 500);
                      
                      console.log('✅ 편집 모드 완전 종료 완료');
                    }, 500);
                  }, 1000);
                
                console.log('✅ 편집 저장 완료');
                } else {
                  console.error('❌ 편집 저장 실패:', result);
                  alert('편집 저장에 실패했습니다. 다시 시도해주세요.');
                }
              } catch (error) {
                console.error('❌ 편집 저장 중 오류:', error);
                alert('편집 저장 중 오류가 발생했습니다: ' + error);
              }
            }
          }
        });

        console.log('✅ 편집 모드 설정 완료');
      }
    };

    // 주기적으로 편집 모드 체크 (메인 페이지와 동일)
    const interval = setInterval(checkEditMode, 100);
    return () => clearInterval(interval);
  }, [mapRef.current]);

  // 우클릭 메뉴 자동 활성화
  useEffect(() => {
    console.log('🔧 우클릭 메뉴 자동 활성화 useEffect 실행됨');
    console.log('🔧 mapRef.current:', mapRef.current);
    
    if (!mapRef.current) {
      console.log('❌ mapRef.current가 없음 - 나중에 다시 시도');
      return;
    }
    
    const timer = setTimeout(() => {
      console.log('🔧 우클릭 메뉴 자동 활성화 시작 (3초 후)');
      console.log('🔧 mapRef.current:', mapRef.current);
      
      if (mapRef.current) {
        const editContextMenuService = new EditContextMenuService(mapRef.current);
        const result = editContextMenuService.setEditContextMenu({
          enabled: true,
          theme: 'light'
        });

        console.log('🔧 우클릭 메뉴 설정 결과:', result);

        if (result.success) {
          setContextMenuEnabled(true);
          if (result.menuConfig?.items) {
            state?.setDefaultContextMenu(result.menuConfig.items);
            console.log('✅ 우클릭 메뉴 자동 활성화 완료');
            console.log('✅ 메뉴 데이터:', result.menuConfig.items);
          } else {
            console.error('❌ 메뉴 데이터가 없음');
          }
        } else {
          console.error('❌ 우클릭 메뉴 자동 활성화 실패:', result.message);
        }
      } else {
        console.log('❌ mapRef.current가 없음');
      }
    }, 3000); // 3초 후 실행

    return () => clearTimeout(timer);
  }, [mapRef.current]);



  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-dropdown-container')) {
        setShowSelectDropdown(false);
      }
      if (!target.closest('.point-dropdown-container')) {
        setShowPointDropdown(false);
      }
      if (!target.closest('.line-dropdown-container')) {
        setShowLineDropdown(false);
      }
      if (!target.closest('.rotate-dropdown-container')) {
        setShowRotateDropdown(false);
      }
      if (!target.closest('.zoom-dropdown-container')) {
        setShowZoomDropdown(false);
      }
      if (!target.closest('.move-dropdown-container')) {
        setShowMoveDropdown(false);
      }
      if (!target.closest('.measurement-dropdown-container')) {
        setShowMeasurementDropdown(false);
      }
      if (!target.closest('.settings-dropdown-container')) {
        setShowSettingsDropdown(false);
      }
    };

    if (showSelectDropdown || showPointDropdown || showLineDropdown || showRotateDropdown || showZoomDropdown || showMoveDropdown || showMeasurementDropdown || showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSelectDropdown, showPointDropdown, showLineDropdown, showRotateDropdown, showZoomDropdown, showMoveDropdown, showMeasurementDropdown, showSettingsDropdown]);

  // 도구 선택 핸들러들 (모드 전환 로직 포함)
  const handleToolSelect = (tool: typeof activeTool) => {
    const now = Date.now();
    const timeSinceLastAction = now - lastUserActionRef.current;
    lastUserActionRef.current = now;
    
    console.log('�� OSSMAP 도구 선택:', { 
      이전모드: activeTool, 
      새모드: tool,
      사용자의도: userIntentRef.current,
      마지막액션후시간: timeSinceLastAction
    });
    
    // 같은 도구를 다시 클릭한 경우 무시
    if (activeTool === tool) {
      console.log('🔧 같은 도구 재클릭 무시:', tool);
      return;
    }
    
    // 사용자 의도 업데이트
    if (tool === 'select' || tool === 'advancedSelect' || tool === 'rectSelect' || tool === 'circleSelect' || tool === 'polygonSelect') {
      userIntentRef.current = 'selection';
    } else if (tool === 'trailDistance' || tool === 'trailArea') {
      userIntentRef.current = 'measurement';
    } else if (tool === 'drawPoint' || tool === 'advancedDrawPoint' || tool === 'drawLine' || tool === 'advancedDrawLine') {
      userIntentRef.current = 'drawing';
    }
    
    // 사용자가 명시적으로 메뉴를 클릭한 경우는 무조건 허용
    // (연속 측정 중에도 사용자 의도는 존중)
    
    // 모드 전환 시 정리
    console.log(`🔧 모드 전환: ${activeTool} → ${tool}`);
    
      // 측정 도구에서 다른 도구로 전환할 때 측정 결과 정리
  if ((activeTool === 'trailDistance' || activeTool === 'trailArea') && 
      (tool !== 'trailDistance' && tool !== 'trailArea')) {
    console.log('🔧 측정 도구에서 다른 도구로 전환 - 측정 모드 완전 OFF');
    
    // 측정 모드 완전 OFF
    setIsMeasurementModeActive(false);
    
    // 측정 도구 레이어 직접 제거 (강화)
    if (mapRef.current) {
      const layers = mapRef.current.getLayers().getArray();
      layers.forEach((layer) => {
        const layerId = layer.get('id');
        if (layerId === 'trail-distance' || layerId === 'trail-area') {
          mapRef.current?.removeLayer(layer);
          console.log(`🔧 측정 도구 레이어 제거됨: ${layerId}`);
        }
      });
      
      // LayerGroup 내부의 레이어도 확인하여 제거
      layers.forEach((layer) => {
        if (layer instanceof LayerGroup) {
          const groupLayers = layer.getLayers().getArray();
          groupLayers.forEach((groupLayer) => {
            const groupLayerId = groupLayer.get('id');
            if (groupLayerId === 'trail-distance' || groupLayerId === 'trail-area') {
              layer.getLayers().remove(groupLayer);
              console.log(`🔧 LayerGroup 내 측정 도구 레이어 제거됨: ${groupLayerId}`);
            }
          });
        }
      });
    }
    
    // 측정 도구 인터랙션 완전 제거 (강화)
    const interactions = mapRef.current?.getInteractions().getArray() || [];
    interactions.forEach((interaction: any) => {
      const interactionId = interaction.get('id');
      if (interactionId && (interactionId.includes('trail-distance') || interactionId.includes('trail-area'))) {
        mapRef.current?.removeInteraction(interaction);
        console.log(`🔧 측정 도구 인터랙션 제거됨: ${interactionId}`);
      }
    });
    
    // Draw 인터랙션 강제 제거 (측정 도구 관련)
    const allInteractions = mapRef.current?.getInteractions().getArray() || [];
    allInteractions.forEach((interaction: any) => {
      if (interaction instanceof Draw) {
        const interactionName = interaction.get('name') || '';
        const interactionId = interaction.get('id') || '';
        if (interactionName.includes('draw') || interactionName.includes('trail') || 
            interactionId.includes('trail-distance') || interactionId.includes('trail-area')) {
          mapRef.current?.removeInteraction(interaction);
          console.log('🔧 측정 관련 Draw 인터랙션 강제 제거됨:', interactionName || interactionId);
        }
      }
    });
    
    // useMapbase 모드도 초기화
    useMapbase.getState().setMode('select');
  }
    
    // 측정 도구 간 전환할 때도 측정 결과 정리 (강화)
    if ((activeTool === 'trailDistance' && tool === 'trailArea') || 
        (activeTool === 'trailArea' && tool === 'trailDistance')) {
      console.log('🔧 측정 도구 간 전환 - 측정 결과 정리');
      
      // 측정 도구 레이어 직접 제거 (강화)
      if (mapRef.current) {
        const layers = mapRef.current.getLayers().getArray();
        layers.forEach((layer) => {
          const layerId = layer.get('id');
          if (layerId === 'trail-distance' || layerId === 'trail-area') {
            mapRef.current?.removeLayer(layer);
            console.log(`🔧 측정 도구 레이어 제거됨: ${layerId}`);
          }
        });
        
        // LayerGroup 내부의 레이어도 확인하여 제거
        layers.forEach((layer) => {
          if (layer instanceof LayerGroup) {
            const groupLayers = layer.getLayers().getArray();
            groupLayers.forEach((groupLayer) => {
              const groupLayerId = groupLayer.get('id');
              if (groupLayerId === 'trail-distance' || groupLayerId === 'trail-area') {
                layer.getLayers().remove(groupLayer);
                console.log(`🔧 LayerGroup 내 측정 도구 레이어 제거됨: ${groupLayerId}`);
              }
            });
          }
        });
      }
      
      // 측정 도구 인터랙션 완전 제거 (강화)
      const interactions = mapRef.current?.getInteractions().getArray() || [];
      interactions.forEach((interaction: any) => {
        if (interaction instanceof Draw) {
          const interactionId = interaction.get('id');
          if (interactionId && (interactionId.includes('trail-distance') || interactionId.includes('trail-area'))) {
            mapRef.current?.removeInteraction(interaction);
            console.log(`🔧 측정 도구 Draw 인터랙션 제거됨: ${interactionId}`);
          }
        }
      });
      
      setIsMeasurementModeActive(false);
    }
    
    // 조건 체크 로그
    console.log('🔧 handleToolSelect 조건 체크 - activeTool:', activeTool, 'tool:', tool);
    
    // 이전 모드 해제 및 상태 정리
    if (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') {
      console.log('🔧 기본 선택 모드 해제');
      try {
        basicSelect.deactivate();
        advancedSelect.deactivate();
        useMapbase.getState().setSelectedFeatures([]);
        console.log('🔧 선택된 피처 하이라이트 제거됨');
      } catch (error) {
        console.log('🔧 기본 선택 모드 해제 중 오류:', error);
      }
    }
    
    // 기존 그리기 모드 정리
    if (activeTool === 'drawPoint' || activeTool === 'advancedDrawPoint') {
      console.log('🔧 포인트 그리기 모드 해제');
      try {
        cleanupDrawnFeature();
        TrailDrawPointService.cleanupAll();
        console.log('🔧 TrailDrawPointService 정리 완료');
      } catch (error) {
        console.log('🔧 포인트 그리기 모드 해제 중 오류:', error);
      }
      
      // 포인트 그리기 팝업 및 상태 정리
      setShowNodeTypeSelector(false);
      setDrawnPointCoordinate(null);
      drawnFeatureRef.current = null;
      console.log('🔧 포인트 그리기 팝업 및 상태 정리됨');
      
      // 그리기 모드에서 그린 피처 추가 정리
      cleanupDrawnFeature();
    }
    
    if (activeTool === 'drawLine' || activeTool === 'advancedDrawLine') {
      console.log('🔧 라인 그리기 모드 해제');
      try {
        cleanupDrawnFeature();
        TrailDrawLineService.cleanupAll();
        AdvancedTrailDrawLineService.cleanupAll();
        console.log('🔧 TrailDrawLineService 정리 완료');
      } catch (error) {
        console.log('🔧 라인 그리기 모드 해제 중 오류:', error);
      }
      
      // 라인 그리기 팝업 및 상태 정리
      setShowLineTypeSelector(false);
      setDrawnLineCoordinate(null);
      drawnFeatureRef.current = null;
      console.log('🔧 라인 그리기 팝업 및 상태 정리됨');
      
      // 그리기 모드에서 그린 피처 추가 정리
      cleanupDrawnFeature();
    }
    
      // 새 모드 설정 (UI 상태와 실제 기능 상태 동기화)
  setActiveTool(tool);
  
  // 이전 모드 완전 중단
  if (activeTool === 'trailDistance' || activeTool === 'trailArea') {
    setIsMeasurementModeActive(false);
    console.log('🔧 측정 모드 완전 중단');
    
    // 모든 인터랙션 제거
    if (mapRef.current) {
      const allInteractions = mapRef.current.getInteractions().getArray();
      allInteractions.forEach((interaction: any) => {
        mapRef.current?.removeInteraction(interaction);
        console.log('🔧 모든 인터랙션 제거됨');
      });
    }
  }
    
    // 새 모드 활성화 (약간의 지연 후)
    setTimeout(() => {
      try {
        switch (tool) {
                  case 'select':
          // 기본 선택 모드
          console.log('🔧 기본 선택 모드 활성화 시작');
          
          // 측정 모드 완전 중단
          setIsMeasurementModeActive(false);
          
          // 모든 측정 관련 인터랙션 강제 제거
          if (mapRef.current) {
            const allInteractions = mapRef.current.getInteractions().getArray();
            allInteractions.forEach((interaction: any) => {
              const interactionName = interaction.get('name') || '';
              if (interactionName.includes('draw') || interactionName.includes('trail')) {
                mapRef.current?.removeInteraction(interaction);
                console.log('🔧 측정 관련 인터랙션 강제 제거됨:', interactionName);
              }
            });
          }
          
          try {
            // 기존 select 인터랙션 정리
            basicSelect.deactivate();
            advancedSelect.deactivate();
            console.log('🔧 기존 select 인터랙션 정리 완료');
          } catch (error) {
            console.log('🔧 기존 select 인터랙션 정리 중 오류:', error);
          }
          
          // 새로운 select 모드 활성화
          basicSelect.activate();
          console.log('🔧 기본 선택 모드 활성화 완료');
          break;
          case 'advancedSelect':
            // 고급 선택 모드
            console.log('🔧 고급 선택 모드 활성화 시작');
            try {
              // 기존 select 인터랙션 정리
              basicSelect.deactivate();
              advancedSelect.deactivate();
              console.log('🔧 기존 select 인터랙션 정리 완료');
            } catch (error) {
              console.log('🔧 기존 select 인터랙션 정리 중 오류:', error);
            }
            
            // 새로운 advanced select 모드 활성화
            advancedSelect.activate();
            console.log('🔧 고급 선택 모드 활성화 완료');
            break;
          case 'rectSelect':
            // 사각형 선택 모드
            console.log('🔧 사각형 선택 모드 활성화 시작');
            try {
              // 기존 select 인터랙션 정리
              basicSelect.deactivate();
              advancedSelect.deactivate();
              console.log('🔧 기존 select 인터랙션 정리 완료');
            } catch (error) {
              console.log('🔧 기존 select 인터랙션 정리 중 오류:', error);
            }
            
            // 사각형 선택 모드 활성화
            activateRectSelectionMode(mapRef.current, layerData);
            startRectSelection(layerData);
            console.log('🔧 사각형 선택 모드 활성화 완료');
            break;
          case 'circleSelect':
            // 원형 선택 모드
            console.log('🔧 원형 선택 모드 활성화 시작');
            try {
              // 기존 select 인터랙션 정리
              basicSelect.deactivate();
              advancedSelect.deactivate();
              console.log('🔧 기존 select 인터랙션 정리 완료');
            } catch (error) {
              console.log('🔧 기존 select 인터랙션 정리 중 오류:', error);
            }
            
            // 원형 선택 모드 활성화
            activateCircleSelectionMode(mapRef.current, layerData);
            startCircleSelection(layerData);
            console.log('🔧 원형 선택 모드 활성화 완료');
            break;
          case 'polygonSelect':
            // 폴리곤 선택 모드
            console.log('🔧 폴리곤 선택 모드 활성화 시작');
            try {
              // 기존 select 인터랙션 정리
              basicSelect.deactivate();
              advancedSelect.deactivate();
              console.log('🔧 기존 select 인터랙션 정리 완료');
            } catch (error) {
              console.log('🔧 기존 select 인터랙션 정리 중 오류:', error);
            }
            
            // 폴리곤 선택 모드 활성화
            activatePolygonSelectionMode(mapRef.current, layerData);
            startPolygonSelection(layerData);
            console.log('🔧 폴리곤 선택 모드 활성화 완료');
            break;
          case 'drawPoint':
            // 포인트 그리기 모드
            console.log('🔧 OSSMAP 포인트 그리기 모드 활성화');
            activateTrailDrawPointMode({
              showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
            break;
          case 'advancedDrawPoint':
            // 고급 포인트 그리기 모드
            console.log('🔧 OSSMAP 고급 포인트 그리기 모드 활성화');
            advancedTrailDrawPoint.activateAdvancedTrailDrawPointMode({
              showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
            break;
          case 'drawLine':
            // 라인 그리기 모드
            console.log('🔧 OSSMAP 라인 그리기 모드 활성화');
            activateTrailDrawLineMode({
              showLineTypeSelectorPopup: showLineTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
            break;
          case 'advancedDrawLine':
            // 고급 라인 그리기 모드
            console.log('🔧 OSSMAP 고급 라인 그리기 모드 활성화');
            activateAdvancedTrailDrawLineMode({
              showLineTypeSelectorPopup: showLineTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
            break;
          case 'pan':
            // 팬 모드 - 기본 맵 인터랙션 사용
            console.log('🔧 팬 모드 활성화');
            break;
          case 'zoomIn':
            // 줌인 모드
            console.log('🔧 줌인 모드 활성화');
            break;
          case 'zoomOut':
            // 줌아웃 모드
            console.log('🔧 줌아웃 모드 활성화');
            break;
          case 'reset':
            // 뷰 리셋
            handleResetView();
            setActiveTool('select'); // 리셋 후 기본 선택 모드로
            basicSelect.activate();
            break;
          case 'rotate':
            // 회전 모드
            console.log('🔧 회전 모드 활성화');
            break;
          case 'trailDistance':
            // 길이 측정 모드 (MainPage 방식으로 수정)
            console.log('🔧 OSSMAP 길이 측정 모드 활성화');
            console.log('🔧 이전 activeTool:', activeTool);
            console.log('🔧 이전 isMeasurementModeActiveRef.current:', isMeasurementModeActiveRef.current);
            
            // MainPage 방식: useMapbase의 setMode 사용
            useMapbase.getState().setMode('trail-distance');
            
            // 첫 번째 측정이 아닌 경우에만 정리 (연속 측정을 위해)
            if (activeTool !== 'trailDistance') {
              console.log('🔧 다른 도구에서 전환 - cleanupDrawnFeature 호출');
              cleanupDrawnFeature(); // 이전 측정 결과 정리
            } else {
              console.log('🔧 같은 도구 재선택 - cleanupDrawnFeature 호출 안함');
            }
            
            setIsMeasurementModeActive(true);
            console.log('🔧 setIsMeasurementModeActive(true) 호출됨');
            break;
          case 'trailArea':
            // 면적 측정 모드 (MainPage 방식으로 수정)
            console.log('🔧 OSSMAP 면적 측정 모드 활성화');
            
            // MainPage 방식: useMapbase의 setMode 사용
            useMapbase.getState().setMode('trail-area');
            
            // 첫 번째 측정이 아닌 경우에만 정리 (연속 측정을 위해)
            if (activeTool !== 'trailArea') {
              cleanupDrawnFeature(); // 이전 측정 결과 정리
            }
            setIsMeasurementModeActive(true);
            break;
        }
      } catch (error) {
        console.error('🔧 새 모드 활성화 중 오류:', error);
      }
    }, 50); // 50ms 지연
  };

  // 기본 지도 제어 함수들
  const handleZoomIn = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const currentZoom = view.getZoom() || 0;
      view.animate({
        zoom: currentZoom + 1,
        duration: 300
      });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const currentZoom = view.getZoom() || 0;
      view.animate({
        zoom: currentZoom - 1,
        duration: 300
      });
    }
  };

  const handleResetView = () => {
    const result = mapPan.resetView({ center: [127.062289345605, 37.5087805938127], zoom: 13, duration: 800 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 포인트 저장 함수 (MainPage와 동일)
  const saveDrawnPoint = async (nodeType: string) => {
    console.log('=== OSSMAP saveDrawnPoint 호출됨 ===');
    console.log('nodeType:', nodeType);
    console.log('drawnPointCoordinate:', drawnPointCoordinate);
    
    if (!drawnPointCoordinate) {
      console.error('drawnPointCoordinate가 없습니다!');
      return;
    }
    
    try {
      const { insertFeatureViaWFS } = await import('~/assets/OpenLayer/services/getFeatures');
      
      // EPSG:5179에서 EPSG:4326으로 좌표 변환
      const transform = mapRef.current?.getView().getProjection().getCode() === 'EPSG:5179' ? 
        async (coord: number[]) => {
          const { transform } = await import('ol/proj');
          return transform(coord, 'EPSG:5179', 'EPSG:4326');
        } : 
        (coord: number[]) => coord;
      
      const transformedCoordinate = await transform(drawnPointCoordinate);
      
      const geometry = {
        type: 'Point',
        coordinates: transformedCoordinate
      };
      
      const properties = {
        type: nodeType,
        property: `새로운 ${nodeType} ${new Date().toLocaleString()}`
      };
      
      const result = await insertFeatureViaWFS(nodeType, geometry, properties);
      
      // 성공 여부 확인 (WFS 응답 분석)
      const resultStr = String(result);
      if (resultStr.includes('SUCCESS') || resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>') || resultStr.includes('FeatureId')) {
        alert('포인트가 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침
        if (mapRef.current) {
          const layers = mapRef.current.getLayers().getArray() || [];
          layers.forEach(layer => {
            if (layer instanceof TileLayer || layer instanceof ImageLayer) {
              const source = layer.getSource();
              if (source && source.refresh) {
                console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
                source.refresh();
              }
            }
          });
          mapRef.current.render();
        }
        
        // 성공 후 그린 피처 정리 및 모드 재설정
        setTimeout(async () => {
          // 그린 피처 정리
          cleanupDrawnFeature();
          console.log('🔧 저장 완료 후 그린 피처 정리 완료');
          
          if (activeTool === 'drawPoint') {
            // 일반 Trail Draw Point 모드 다시 활성화
            console.log('🔍 OSSMAP 일반 Trail Draw Point 모드 - 정리 및 재설정');
            TrailDrawPointService.cleanupAll();
            
            // Trail Draw Point 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'Point' });
            
            const { activateTrailDrawPointMode } = await import('~/assets/Drawing');
            activateTrailDrawPointMode({
              showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
          } else if (activeTool === 'advancedDrawPoint') {
            // Advanced Trail Draw Point 모드 다시 활성화
            console.log('🔍 OSSMAP Advanced Trail Draw Point 모드 - 다시 활성화');
            
            // Advanced Trail Draw Point Service 정리
            try {
              const { AdvancedTrailDrawPointService } = await import('~/assets/Drawing/services/advancedTrailDrawPointService');
              AdvancedTrailDrawPointService.cleanupAll();
              console.log('🔧 AdvancedTrailDrawPointService 정리 완료');
            } catch (error) {
              console.log('🔧 AdvancedTrailDrawPointService 정리 중 오류:', error);
            }
            
            // 레이어 리로드 후 Vector 데이터가 사라졌으므로 다시 생성
            console.log('🔍 OSSMAP Advanced Trail Draw Point - Vector 데이터 재생성');
            
            // Advanced Trail Draw Point Service 다시 활성화 (Vector 데이터 재생성 포함)
            const { activateAdvancedTrailDrawPointMode } = await import('~/assets/Drawing');
            activateAdvancedTrailDrawPointMode({
              showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
            console.log('🔍 OSSMAP AdvancedTrailDrawPointService 다시 활성화 완료');
          }
        }, 100);
        
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('OSSMAP 포인트 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 상태 초기화
      setShowNodeTypeSelector(false);
      setDrawnPointCoordinate(null);
      setDrawnPointPixel(null);
      setSelectedNodeType('');
      drawnFeatureRef.current = null; // 그린 feature 참조 초기화
    }
  };

  // 노드 타입 선택 핸들러들 (MainPage와 동일)
  const handleNodeTypeSelect = (nodeType: string) => {
    console.log('=== OSSMAP handleNodeTypeSelect 호출됨 ===');
    console.log('선택된 노드 타입:', nodeType);
    setSelectedNodeType(nodeType);
    console.log('selectedNodeType 설정 완료');
  };

  // 라인 타입 선택 핸들러들 (MainPage와 동일)
  const handleLineTypeSelect = (lineType: string) => {
    console.log('=== OSSMAP handleLineTypeSelect 호출됨 ===');
    console.log('선택된 라인 타입:', lineType);
    setSelectedLineType(lineType);
    console.log('selectedLineType 설정 완료');
  };

  // 폴리곤 타입 선택 핸들러들 (MainPage와 동일)
  const handlePolygonTypeSelect = (polygonType: string) => {
    console.log('=== OSSMAP handlePolygonTypeSelect 호출됨 ===');
    console.log('선택된 폴리곤 타입:', polygonType);
    setSelectedPolygonType(polygonType);
    console.log('selectedPolygonType 설정 완료');
  };

  // 라인 저장 함수 (MainPage와 동일)
  const saveDrawnLine = async (lineType: string) => {
    try {
      console.log('=== OSSMAP saveDrawnLine 호출됨 ===');
      console.log('lineType:', lineType);
      
      if (!mapRef.current) {
        console.error('mapRef가 null입니다.');
        return;
      }

      // 그린 feature가 있는지 확인
      if (!drawnFeatureRef.current) {
        console.error('그린 feature를 찾을 수 없습니다.');
        alert('그린 Line을 찾을 수 없습니다. 다시 그려주세요.');
        return;
      }

      const { insertFeatureViaWFS } = await import('~/assets/OpenLayer/services/getFeatures');
      
      // 좌표 변환 - Line은 기존 방식 유지 (변환 없이 그대로 사용)
      const transform = (coord: number[]) => coord; // 변환 없이 그대로 사용
      
      // 그린 feature에서 좌표 추출
      const geometry = drawnFeatureRef.current.getGeometry();
      if (!geometry || geometry.getType() !== 'LineString') {
        console.error('LineString geometry를 찾을 수 없습니다.');
        alert('LineString geometry를 찾을 수 없습니다.');
        return;
      }
      
      const coords = geometry.getCoordinates();
      if (!coords || coords.length < 2) {
        console.error('유효하지 않은 Line 좌표입니다.');
        alert('유효하지 않은 Line 좌표입니다.');
        return;
      }
      
      console.log('그린 Line 좌표:', coords);
      
      // 좌표 변환 (기존 방식 유지)
      const lineCoordinates = coords.map(transform);
      console.log('변환된 좌표:', lineCoordinates);
      
      const geometryData = {
        type: 'LineString',
        coordinates: lineCoordinates
      };
      
      const properties = {
        property: `새로운 ${lineType} ${new Date().toLocaleString()}`
      };
      
      console.log('Inserting geometry:', geometryData);
      console.log('Properties:', properties);
      
      const result = await insertFeatureViaWFS('linkDsWay', geometryData, properties);
      
      // 성공 여부 확인
      const resultStr = String(result);
      if (resultStr.includes('SUCCESS') || resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>')) {
        alert('라인이 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침 (WMS + Vector Tile)
        const layers = mapRef.current?.getLayers().getArray() || [];
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              source.refresh();
            }
          } else if (layer.get('layerName') === 'linkDsWay' && 'getSource' in layer) {
            // Vector Tile 레이어인 경우 타일 캐시 무효화 및 강제 새로고침
            const source = (layer as any).getSource();
            if (source && source.clear) {
              source.clear();
              // 타일을 강제로 다시 로드
              source.refresh();
            }
          }
        });
        
        // 성공 후 그린 피처 정리 및 모드 재설정
        setTimeout(async () => {
          // 그린 피처 정리
          cleanupDrawnFeature();
          console.log('🔧 저장 완료 후 그린 피처 정리 완료');
          
          if (activeTool === 'drawLine') {
            // 일반 Trail Draw Line 모드 다시 활성화
            console.log('🔍 OSSMAP 일반 Trail Draw Line 모드 - 정리 및 재설정');
            TrailDrawLineService.cleanupAll();
            
            // Trail Draw Line 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'LineString' });
            
            const { activateTrailDrawLineMode } = await import('~/assets/Drawing');
            activateTrailDrawLineMode({
              showLineTypeSelectorPopup: showLineTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
          } else if (activeTool === 'advancedDrawLine') {
            // Advanced Trail Draw Line 모드 다시 활성화
            console.log('🔍 OSSMAP Advanced Trail Draw Line 모드 - 정리 및 재설정');
            
            // Advanced Trail Draw Line Service 정리
            try {
              AdvancedTrailDrawLineService.cleanupAll();
              console.log('🔧 AdvancedTrailDrawLineService 정리 완료');
            } catch (error) {
              console.log('🔧 AdvancedTrailDrawLineService 정리 중 오류:', error);
            }
            
            // 레이어 리로드 후 Vector 데이터가 사라졌으므로 다시 생성
            console.log('🔍 OSSMAP Advanced Trail Draw Line - Vector 데이터 재생성');
            
            // Advanced Trail Draw Line Service 다시 활성화 (Vector 데이터 재생성 포함)
            const { activateAdvancedTrailDrawLineMode } = await import('~/assets/Drawing');
            activateAdvancedTrailDrawLineMode({
              showLineTypeSelectorPopup: showLineTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
          }
        }, 100);
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('라인 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 상태 초기화 (MainPage와 동일)
      setShowLineTypeSelector(false);
      setSelectedLineType('');
      setDrawnLineCoordinate(null);
      setDrawnLinePixel(null);
      drawnFeatureRef.current = null; // 그린 feature 참조 초기화
      
      // Trail Draw Line Service 정리
      try {
        TrailDrawLineService.cleanupAll();
        console.log('🔧 TrailDrawLineService 정리 완료');
      } catch (error) {
        console.log('🔧 TrailDrawLineService 정리 중 오류:', error);
      }
    }
  };

  // 폴리곤 저장 함수 (MainPage와 동일)
  const saveDrawnPolygon = async (polygonType: string) => {
    try {
      console.log('=== OSSMAP saveDrawnPolygon 호출됨 ===');
      console.log('polygonType:', polygonType);
      
      if (!mapRef.current) {
        console.error('mapRef가 null입니다.');
        return;
      }

      // 그린 feature가 있는지 확인
      if (!drawnFeatureRef.current) {
        console.error('그린 feature를 찾을 수 없습니다.');
        alert('그린 Polygon을 찾을 수 없습니다. 다시 그려주세요.');
        return;
      }

      const { insertFeatureViaWFS } = await import('~/assets/OpenLayer/services/getFeatures');
      
      // 좌표 변환 - Polygon도 Point처럼 EPSG:5179에서 EPSG:4326으로 변환
      const transform = async (coord: number[]) => {
        try {
          const { transform } = await import('ol/proj');
          const transformedCoord = transform(coord, 'EPSG:5179', 'EPSG:4326');
          return transformedCoord;
        } catch (error) {
          console.error('좌표 변환 오류:', error);
          return coord; // 변환 실패시 원본 좌표 반환
        }
      };
      
      // 그린 feature에서 좌표 추출
      const geometry = drawnFeatureRef.current.getGeometry();
      if (!geometry || geometry.getType() !== 'Polygon') {
        console.error('Polygon geometry를 찾을 수 없습니다.');
        alert('Polygon geometry를 찾을 수 없습니다.');
        return;
      }
      
      const coords = geometry.getCoordinates();
      if (!coords || coords.length === 0) {
        console.error('유효하지 않은 Polygon 좌표입니다.');
        alert('유효하지 않은 Polygon 좌표입니다.');
        return;
      }
      
      console.log('그린 Polygon 좌표:', coords);
      
      // 좌표 변환 (비동기 처리)
      const polygonCoordinates = await Promise.all(
        coords.map(async (ring: number[][]) => 
          Promise.all(ring.map(async (coord: number[]) => await transform(coord)))
        )
      );
      console.log('변환된 좌표:', polygonCoordinates);
      
      const geometryData = {
        type: 'Polygon',
        coordinates: polygonCoordinates
      };
      
      const properties = {
        property: `새로운 ${polygonType} ${new Date().toLocaleString()}`
      };
      
      console.log('Inserting geometry:', geometryData);
      console.log('Properties:', properties);
      
      const result = await insertFeatureViaWFS(polygonType, geometryData, properties);
      
      // 성공 여부 확인
      const resultStr = String(result);
      if (resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>') || resultStr.includes('FeatureId') || resultStr.includes('SUCCESS')) {
        alert('폴리곤이 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침 (WMS + Vector Tile)
        const layers = mapRef.current?.getLayers().getArray() || [];
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              source.refresh();
            }
          } else if (layer.get('layerName') === polygonType && 'getSource' in layer) {
            // Vector Tile 레이어인 경우 타일 캐시 무효화 및 강제 새로고침
            const source = (layer as any).getSource();
            if (source && source.clear) {
              source.clear();
              // 타일을 강제로 다시 로드
              source.refresh();
            }
          }
        });
        
        // 성공 후 그린 피처 정리 및 모드 재설정
        setTimeout(async () => {
          // 그린 피처 정리
          cleanupDrawnFeature();
          console.log('🔧 저장 완료 후 그린 피처 정리 완료');
          
          if (activeTool === 'drawPolygon') {
            // 일반 Trail Draw Polygon 모드 다시 활성화
            console.log('🔍 OSSMAP 일반 Trail Draw Polygon 모드 - 정리 및 재설정');
            TrailDrawPolygonService.cleanupAll();
            
            // Trail Draw Polygon 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'Polygon' });
            
            const { activateTrailDrawPolygonMode } = await import('~/assets/Drawing');
            activateTrailDrawPolygonMode({
              showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
          } else if (activeTool === 'advancedDrawPolygon') {
            // Advanced Trail Draw Polygon 모드 다시 활성화
            console.log('🔍 OSSMAP Advanced Trail Draw Polygon 모드 - 다시 활성화');
            
            // Advanced Trail Draw Polygon Service 정리
            try {
              const { AdvancedTrailDrawPolygonService } = await import('~/assets/Drawing/services/advancedTrailDrawPolygonService');
              AdvancedTrailDrawPolygonService.cleanupAll();
              console.log('🔧 AdvancedTrailDrawPolygonService 정리 완료');
            } catch (error) {
              console.log('🔧 AdvancedTrailDrawPolygonService 정리 중 오류:', error);
            }
            
            // 레이어 리로드 후 Vector 데이터가 사라졌으므로 다시 생성
            console.log('🔍 OSSMAP Advanced Trail Draw Polygon - Vector 데이터 재생성');
            
            // Advanced Trail Draw Polygon Service 다시 활성화 (Vector 데이터 재생성 포함)
            const { activateAdvancedTrailDrawPolygonMode } = await import('~/assets/Drawing');
            activateAdvancedTrailDrawPolygonMode({
              showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                drawnFeatureRef.current = feature;
              }
            });
          }
        }, 100);
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('폴리곤 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 상태 초기화 (MainPage와 동일)
      setShowPolygonTypeSelector(false);
      setSelectedPolygonType('');
      setDrawnPolygonCoordinate(null);
      setDrawnPolygonPixel(null);
      drawnFeatureRef.current = null; // 그린 feature 참조 초기화
      
      // Trail Draw Polygon Service 정리
      try {
        TrailDrawPolygonService.cleanupAll();
        console.log('🔧 TrailDrawPolygonService 정리 완료');
      } catch (error) {
        console.log('🔧 TrailDrawPolygonService 정리 중 오류:', error);
      }
    }
  };

  // 저장 버튼 클릭 처리
  const handleSaveClick = () => {
    console.log('=== OSSMAP handleSaveClick 호출됨 ===');
    console.log('현재 selectedNodeType:', selectedNodeType);
    console.log('현재 selectedLineType:', selectedLineType);
    console.log('현재 selectedPolygonType:', selectedPolygonType);
    console.log('현재 drawnPointCoordinate:', drawnPointCoordinate);
    console.log('현재 drawnLineCoordinate:', drawnLineCoordinate);
    console.log('현재 drawnPolygonCoordinate:', drawnPolygonCoordinate);
    
    if (selectedNodeType) {
      console.log('노드 타입이 선택됨, 확인 다이얼로그 표시');
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        console.log('사용자가 저장을 확인함, saveDrawnPoint 호출');
        saveDrawnPoint(selectedNodeType);
      } else {
        console.log('사용자가 저장을 취소함');
      }
    } else if (selectedLineType) {
      console.log('라인 타입이 선택됨, 확인 다이얼로그 표시');
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        console.log('사용자가 저장을 확인함, saveDrawnLine 호출');
        saveDrawnLine(selectedLineType);
      } else {
        console.log('사용자가 저장을 취소함');
      }
    } else if (selectedPolygonType) {
      console.log('폴리곤 타입이 선택됨, 확인 다이얼로그 표시');
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        console.log('사용자가 저장을 확인함, saveDrawnPolygon 호출');
        saveDrawnPolygon(selectedPolygonType);
      } else {
        console.log('사용자가 저장을 취소함');
      }
    } else {
      console.log('타입이 선택되지 않음');
    }
  };

  // setActiveTool 추적용 래퍼 함수 생성
  const setActiveToolWithLog = (tool: typeof activeTool) => {
    console.log('🟢 setActiveTool 호출:', tool, '(이전 activeTool:', activeTool, ')');
    setActiveTool(tool);
  };

  // 사용자 의도 추적을 위한 ref
  const userIntentRef = useRef<'none' | 'measurement' | 'selection' | 'drawing'>('none');
  const lastUserActionRef = useRef<number>(0);

  // 팝업 정리 공통 함수
  const cleanupDrawingPopups = () => {
    // 라인 그리기 팝업 정리
    if (showLineTypeSelector) {
      console.log('🔧 라인 그리기 팝업 정리');
      setShowLineTypeSelector(false);
      setDrawnLineCoordinate(null);
      setDrawnLinePixel(null);
      setSelectedLineType('');
      drawnFeatureRef.current = null;
    }
    
    // 포인트 그리기 팝업 정리
    if (showNodeTypeSelector) {
      console.log('🔧 포인트 그리기 팝업 정리');
      setShowNodeTypeSelector(false);
      setDrawnPointCoordinate(null);
      setDrawnPointPixel(null);
      setSelectedNodeType('');
      drawnFeatureRef.current = null;
    }
    
    // 폴리곤 그리기 팝업 정리
    if (showPolygonTypeSelector) {
      console.log('🔧 폴리곤 그리기 팝업 정리');
      setShowPolygonTypeSelector(false);
      setDrawnPolygonCoordinate(null);
      setDrawnPolygonPixel(null);
      setSelectedPolygonType('');
      drawnFeatureRef.current = null;
    }
  };

  // 측정 도구 레이어 정리 함수
  const cleanupMeasurementLayers = () => {
    console.log('🔧 측정 도구 레이어 정리 시작');
    
    if (mapRef.current) {
      const layers = mapRef.current.getLayers().getArray();
      
      // 일반 레이어에서 측정 도구 레이어 제거
      layers.forEach((layer) => {
        const layerId = layer.get('id');
        if (layerId === 'trail-distance' || layerId === 'trail-area') {
          mapRef.current?.removeLayer(layer);
          console.log(`🔧 측정 도구 레이어 제거됨: ${layerId}`);
        }
      });
      
      // LayerGroup 내부의 레이어도 확인하여 제거
      layers.forEach((layer) => {
        if (layer instanceof LayerGroup) {
          const groupLayers = layer.getLayers().getArray();
          groupLayers.forEach((groupLayer) => {
            const groupLayerId = groupLayer.get('id');
            if (groupLayerId === 'trail-distance' || groupLayerId === 'trail-area') {
              layer.getLayers().remove(groupLayer);
              console.log(`🔧 LayerGroup 내 측정 도구 레이어 제거됨: ${groupLayerId}`);
            }
          });
        }
      });
      
      // 측정 도구 인터랙션 제거 (강화)
      const interactions = mapRef.current.getInteractions().getArray();
      interactions.forEach((interaction: any) => {
        if (interaction instanceof Draw) {
          const interactionId = interaction.get('id');
          const interactionName = interaction.get('name');
          
          // 측정 도구 관련 Draw 인터랙션 제거
          if (interactionId && (interactionId.includes('trail-distance') || interactionId.includes('trail-area'))) {
            mapRef.current?.removeInteraction(interaction);
            console.log(`🔧 측정 도구 Draw 인터랙션 제거됨: ${interactionId}`);
          }
          // 또는 측정 도구에서 생성된 Draw 인터랙션 (id가 없는 경우)
          else if (interactionName && (interactionName.includes('trail-distance') || interactionName.includes('trail-area'))) {
            mapRef.current?.removeInteraction(interaction);
            console.log(`🔧 측정 도구 Draw 인터랙션 제거됨: ${interactionName}`);
          }
          // 또는 모든 Draw 인터랙션 제거 (더 강력한 방법)
          else {
            mapRef.current?.removeInteraction(interaction);
            console.log(`🔧 모든 Draw 인터랙션 제거됨`);
          }
        }
      });
    }
    
    // 측정 모드 비활성화
    setIsMeasurementModeActive(false);
    console.log('🔧 측정 도구 레이어 정리 완료');
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#f5f5f5',
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif'
    }}>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      {/* 헤더 */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: '600',
          color: '#333'
        }}>
          OSSMAP - Map Control Center
        </h1>
        <span style={{
          background: '#e8f5e8',
          color: '#2e7d32',
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '500',
          marginLeft: '16px'
        }}>
          운영 모드
        </span>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        position: 'relative'
      }}>
        {/* 포토샵 스타일 도구 모음 - 왼쪽 */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '8px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          transition: 'all 0.3s ease',
          transform: showToolbar ? 'translateY(-50%)' : 'translateY(-50%) translateX(-100%)',
          opacity: showToolbar ? 1 : 0,
          pointerEvents: showToolbar ? 'auto' : 'none'
        }}>
          {/* Select 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="select-dropdown-container">
            <button
              onClick={handleSelectDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? '#007bff' : '#f8f9fa',
                color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentSelectTool === 'select' ? "기본 선택" : 
                     currentSelectTool === 'advancedSelect' ? "고급 선택" :
                     currentSelectTool === 'rectSelect' ? "사각형 선택" :
                     currentSelectTool === 'circleSelect' ? "원형 선택" : "폴리곤 선택"}
            >
              {currentSelectTool === 'select' ? (
                <FiMousePointer />
              ) : currentSelectTool === 'advancedSelect' ? (
                <div style={{
                  position: 'relative',
                  width: '16px',
                  height: '16px'
                }}>
                  <FiMousePointer style={{ position: 'absolute', top: 0, left: 0 }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    background: '#FF9500',
                    borderRadius: '50%',
                    border: '1px solid white'
                  }} />
                </div>
              ) : currentSelectTool === 'rectSelect' ? (
                <div style={{
                  position: 'relative',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiSquare style={{ 
                    fontSize: '16px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                  <FiMousePointer style={{ 
                    position: 'absolute', 
                    right: '-2px', 
                    bottom: '-2px', 
                    fontSize: '8px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                </div>
              ) : currentSelectTool === 'circleSelect' ? (
                <div style={{
                  position: 'relative',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiCircle style={{ 
                    fontSize: '16px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                  <FiMousePointer style={{ 
                    position: 'absolute', 
                    right: '-2px', 
                    bottom: '-2px', 
                    fontSize: '8px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                </div>
              ) : (
                <div style={{
                  position: 'relative',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiHexagon style={{ 
                    fontSize: '16px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                  <FiMousePointer style={{ 
                    position: 'absolute', 
                    right: '-2px', 
                    bottom: '-2px', 
                    fontSize: '8px',
                    color: (activeTool === 'select' || activeTool === 'advancedSelect' || activeTool === 'rectSelect' || activeTool === 'circleSelect' || activeTool === 'polygonSelect') ? 'white' : '#333'
                  }} />
                </div>
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showSelectDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '160px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleSelectToolSelect('select')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiMousePointer style={{ fontSize: '16px' }} />
                  기본 선택
                </button>
                <button
                  onClick={() => handleSelectToolSelect('advancedSelect')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px'
                  }}>
                    <FiMousePointer style={{ position: 'absolute', top: 0, left: 0, fontSize: '16px' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '6px',
                      height: '6px',
                      background: '#FF9500',
                      borderRadius: '50%',
                      border: '1px solid white'
                    }} />
                  </div>
                  고급 선택
                </button>
                <button
                  onClick={() => handleSelectToolSelect('rectSelect')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiSquare style={{ 
                      fontSize: '14px', 
                      color: '#333'
                    }} />
                    <FiMousePointer style={{ 
                      position: 'absolute', 
                      right: '-2px', 
                      bottom: '-2px', 
                      fontSize: '6px', 
                      color: '#333'
                    }} />
                  </div>
                  사각형 선택
                </button>
                <button
                  onClick={() => handleSelectToolSelect('circleSelect')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiCircle style={{ 
                      fontSize: '14px', 
                      color: '#333'
                    }} />
                    <FiMousePointer style={{ 
                      position: 'absolute', 
                      right: '-2px', 
                      bottom: '-2px', 
                      fontSize: '8px', 
                      color: '#333'
                    }} />
                  </div>
                  원형 선택
                </button>
                <button
                  onClick={() => handleSelectToolSelect('polygonSelect')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiHexagon style={{ 
                      fontSize: '14px', 
                      color: '#333'
                    }} />
                    <FiMousePointer style={{ 
                      position: 'absolute', 
                      right: '-2px', 
                      bottom: '-2px', 
                      fontSize: '8px', 
                      color: '#333'
                    }} />
                  </div>
                  폴리곤 선택
                </button>
              </div>
            )}
          </div>

          {/* Point 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="point-dropdown-container">
            <button
              onClick={handlePointDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: (activeTool === 'drawPoint' || activeTool === 'advancedDrawPoint') ? '#007bff' : '#f8f9fa',
                color: (activeTool === 'drawPoint' || activeTool === 'advancedDrawPoint') ? 'white' : '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentPointTool === 'drawPoint' ? "포인트 그리기" : "고급 포인트 그리기"}
            >
              {currentPointTool === 'drawPoint' ? (
                <FiMapPin />
              ) : (
                <div style={{
                  position: 'relative',
                  width: '16px',
                  height: '16px'
                }}>
                  <FiMapPin style={{ position: 'absolute', top: 0, left: 0 }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    background: '#FF9500',
                    borderRadius: '50%',
                    border: '1px solid white'
                  }} />
                </div>
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showPointDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '170px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handlePointToolSelect('drawPoint')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiMapPin style={{ fontSize: '16px' }} />
                  포인트 그리기
                </button>
                <button
                  onClick={() => handlePointToolSelect('advancedDrawPoint')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px'
                  }}>
                    <FiMapPin style={{ position: 'absolute', top: 0, left: 0, fontSize: '16px' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '6px',
                      height: '6px',
                      background: '#FF9500',
                      borderRadius: '50%',
                      border: '1px solid white'
                    }} />
                  </div>
                  고급 포인트 그리기
                </button>
              </div>
            )}
          </div>

          {/* Line 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="line-dropdown-container">
            <button
              onClick={handleLineDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: (activeTool === 'drawLine' || activeTool === 'advancedDrawLine') ? '#007bff' : '#f8f9fa',
                color: (activeTool === 'drawLine' || activeTool === 'advancedDrawLine') ? 'white' : '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentLineTool === 'drawLine' ? "라인 그리기" : "고급 라인 그리기"}
            >
              {currentLineTool === 'drawLine' ? (
                <img 
                  src="/images/trail-draw-line.svg" 
                  alt="라인 그리기" 
                  style={{ width: '20px', height: '20px' }}
                />
              ) : (
                <img 
                  src="/images/advanced-trail-draw-line.svg" 
                  alt="고급 라인 그리기" 
                  style={{ width: '20px', height: '20px' }}
                />
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showLineDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '180px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleLineToolSelect('drawLine')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/images/trail-draw-line.svg" 
                    alt="라인 그리기" 
                    style={{ width: '16px', height: '16px' }}
                  />
                  라인 그리기
                </button>
                <button
                  onClick={() => handleLineToolSelect('advancedDrawLine')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/images/advanced-trail-draw-line.svg" 
                    alt="고급 라인 그리기" 
                    style={{ width: '16px', height: '16px' }}
                  />
                  고급 라인 그리기
                </button>
              </div>
            )}
          </div>

          {/* Polygon 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="polygon-dropdown-container">
            <button
              onClick={handlePolygonDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: (activeTool === 'drawPolygon' || activeTool === 'advancedDrawPolygon') ? '#007bff' : '#f8f9fa',
                color: (activeTool === 'drawPolygon' || activeTool === 'advancedDrawPolygon') ? 'white' : '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentPolygonTool === 'drawPolygon' ? "폴리곤 그리기" : "고급 폴리곤 그리기"}
            >
              {currentPolygonTool === 'drawPolygon' ? (
                <FiHexagon style={{ width: '20px', height: '20px' }} />
              ) : (
                <div style={{ position: 'relative' }}>
                  <FiHexagon style={{ width: '20px', height: '20px' }} />
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff6b35',
                    borderRadius: '50%',
                    border: '1px solid white'
                  }} />
                </div>
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showPolygonDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '180px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handlePolygonToolSelect('drawPolygon')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiHexagon style={{ width: '16px', height: '16px' }} />
                  폴리곤 그리기
                </button>
                <button
                  onClick={() => handlePolygonToolSelect('advancedDrawPolygon')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ position: 'relative' }}>
                    <FiHexagon style={{ width: '16px', height: '16px' }} />
                    <div style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#ff6b35',
                      borderRadius: '50%',
                      border: '1px solid white'
                    }} />
                  </div>
                  고급 폴리곤 그리기
                </button>
              </div>
            )}
          </div>

          {/* 측정 도구 */}
          <div style={{ position: 'relative' }} className="measurement-dropdown-container">
            <button
              onClick={handleMeasurementDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: (activeTool === 'trailDistance' || activeTool === 'trailArea') ? '#007bff' : '#f8f9fa',
                color: (activeTool === 'trailDistance' || activeTool === 'trailArea') ? 'white' : '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentMeasurementTool === 'trailDistance' ? "길이 측정" : "면적 측정"}
            >
              {currentMeasurementTool === 'trailDistance' ? (
                <FiBarChart />
              ) : (
                <FiSquare />
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showMeasurementDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '140px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleMeasurementToolSelect('trailDistance')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiBarChart style={{ fontSize: '16px' }} />
                  길이 측정
                </button>
                <button
                  onClick={() => handleMeasurementToolSelect('trailArea')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiSquare style={{ fontSize: '16px' }} />
                  면적 측정
                </button>
              </div>
            )}
          </div>

          {/* 팬 도구 */}
          {/* Move 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="move-dropdown-container">
            <button
              onClick={handleMoveDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: '#f8f9fa',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title="이동 도구"
            >
              <FiMove />
            </button>

            {/* 드롭다운 메뉴 */}
            {showMoveDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '140px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleMoveToolSelect('panUp')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowUp style={{ fontSize: '16px' }} />
                  위로 이동
                </button>
                <button
                  onClick={() => handleMoveToolSelect('panDown')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowDown style={{ fontSize: '16px' }} />
                  아래로 이동
                </button>
                <button
                  onClick={() => handleMoveToolSelect('panLeft')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowLeft style={{ fontSize: '16px' }} />
                  왼쪽으로 이동
                </button>
                <button
                  onClick={() => handleMoveToolSelect('panRight')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowRight style={{ fontSize: '16px' }} />
                  오른쪽으로 이동
                </button>
                <div style={{
                  width: '100%',
                  height: '1px',
                  background: '#e0e0e0',
                  margin: '4px 0'
                }} />

                <button
                  onClick={() => handleMoveToolSelect('panCoordinate')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiTarget style={{ fontSize: '16px' }} />
                  특정 좌표로
                </button>
                <button
                  onClick={() => handleMoveToolSelect('panPrevious')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowLeft style={{ fontSize: '16px' }} />
                  이전 위치로
                </button>
                <button
                  onClick={() => handleMoveToolSelect('panForward')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiArrowRight style={{ fontSize: '16px' }} />
                  다음 위치로
                </button>
              </div>
            )}
          </div>

          {/* Zoom 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="zoom-dropdown-container">
            <button
              onClick={handleZoomDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: '#f8f9fa',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentZoomTool === 'zoomIn' ? "확대" : "축소"}
            >
              {currentZoomTool === 'zoomIn' ? (
                <FiMaximize2 />
              ) : (
                <FiMinimize2 />
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showZoomDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '120px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleZoomToolSelect('zoomIn')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiMaximize2 style={{ fontSize: '16px' }} />
                  확대
                </button>
                <button
                  onClick={() => handleZoomToolSelect('zoomOut')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiMinimize2 style={{ fontSize: '16px' }} />
                  축소
                </button>
              </div>
            )}
          </div>

          {/* Rotate 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="rotate-dropdown-container">
            <button
              onClick={handleRotateDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: '#f8f9fa',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={currentRotateTool === 'rotateCw' ? "시계방향 회전" : "반시계방향 회전"}
            >
              {currentRotateTool === 'rotateCw' ? (
                <FiRotateCw />
              ) : (
                <FiRotateCcw />
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showRotateDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '140px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleRotateToolSelect('rotateCw')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiRotateCw style={{ fontSize: '16px' }} />
                  시계방향 회전
                </button>
                <button
                  onClick={() => handleRotateToolSelect('rotateCcw')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiRotateCcw style={{ fontSize: '16px' }} />
                  반시계방향 회전
                </button>
              </div>
            )}
          </div>

                    {/* 리셋 도구 */}
          <button
            onClick={() => handleToolSelect('reset')}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              background: '#f8f9fa',
              color: '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
            title="뷰 리셋"
          >
            <FiLayers />
          </button>

          {/* Reset View 버튼 */}
          <button
            onClick={handleResetView}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              background: '#f8f9fa',
              color: '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
            title="맵 초기 위치로"
          >
            <FiHome />
          </button>

          {/* 설정 드롭다운 도구 */}
          <div style={{ position: 'relative' }} className="settings-dropdown-container">
            <button
              onClick={handleSettingsDropdownToggle}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '6px',
                background: '#f8f9fa',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title="설정"
            >
              <FiSettings />
            </button>

            {/* 드롭다운 메뉴 */}
            {showSettingsDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                marginTop: '4px',
                minWidth: '160px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => handleSettingsOptionSelect('layerOpacity')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, transparent 70%)',
                    borderRadius: '2px'
                  }} />
                  레이어 투명도 설정
                </button>

                {/* 향후 다른 설정 옵션들을 여기에 추가 */}
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div style={{
            width: '100%',
            height: '1px',
            background: '#e0e0e0',
            margin: '4px 0'
          }} />

          {/* 도구 모음 숨기기 버튼 */}
          <button
            onClick={handleToggleToolbar}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              background: '#f8f9fa',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            title="도구 모음 숨기기"
          >
            ◀
          </button>
      </div>

      {/* 도구 모음 토글 버튼 (숨겨졌을 때만 표시) */}
      {!showToolbar && (
        <button
          onClick={handleToggleToolbar}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '8px',
            background: '#fff',
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            transition: 'all 0.2s ease'
          }}
          title="도구 모음 표시"
        >
          ▶
        </button>
      )}

        {/* 지도 영역 */}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* 지도 정보 오버레이 - 오른쪽 하단 */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '5px',
          fontSize: '10px',
          fontFamily: 'monospace',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          minWidth: 'fit-content',
        }}>
          <div style={{ marginBottom: '2px' }}>
            좌표: [{mapInfo.center[0].toFixed(6)}, {mapInfo.center[1].toFixed(6)}]
          </div>
          <div>
            줌: {mapInfo.zoom.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 레이어 컨트롤 패널 */}
      <LayerControl 
        isVisible={showLayerControl}
        onToggle={handleToggleLayerControl}
        layerData={layerData}
        checkedLayers={checkedLayers}
        onLayerChange={handleLayerCheckboxChange}
        onShowAllLayers={handleShowAllLayers}
        onHideAllLayers={handleHideAllLayers}
        position={layerControlPosition}
        onDragStart={handleDragStart}
        isDragging={isDragging}
        hasMoved={hasMoved}
      />

      {/* 노드 타입 선택기 (MainPage와 동일) */}
      {showNodeTypeSelector && drawnPointPixel && (
        <div
          style={{
            position: 'absolute',
            left: drawnPointPixel[0] + 10,
            top: drawnPointPixel[1] - 10,
            zIndex: 3000,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            padding: '8px',
            minWidth: '200px',
            transition: 'all 0.3s ease-out',
            transform: 'translateY(0) scale(1)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Node Type:
          </div>
          <select
            value={selectedNodeType}
            onChange={(e) => handleNodeTypeSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <option value="">Select...</option>
            {availableNodeTypes.map((nodeType) => (
              <option key={nodeType.value} value={nodeType.value}>
                {nodeType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveClick}
            disabled={!selectedNodeType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: selectedNodeType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: selectedNodeType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              console.log('🔧 노드 타입 선택기 취소 버튼 클릭');
              
              // 그린 피처만 정리 (cleanupDrawnFeature 호출하지 않음)
              if (drawnFeatureRef.current) {
                drawnFeatureRef.current = null;
              }
              
              // 상태 초기화 (팝업만 닫고 서비스는 유지)
              setShowNodeTypeSelector(false);
              setDrawnPointCoordinate(null);
              setDrawnPointPixel(null);
              setSelectedNodeType('');
              
              // activeTool에 따라 다르게 처리
              if (activeTool === 'drawPoint') {
                // Trail Draw Point 모드 다시 활성화 (연속 그리기 위해)
                try {
                  activateTrailDrawPointMode({
                    showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
                    setDrawnFeature: (feature: any) => {
                      drawnFeatureRef.current = feature;
                    }
                  });
                  console.log('🔧 Trail Draw Point 모드 다시 활성화됨');
                } catch (error) {
                  console.log('🔧 Trail Draw Point 모드 다시 활성화 중 오류:', error);
                }
              } else if (activeTool === 'advancedDrawPoint') {
                // Advanced Trail Draw Point - 이전 그린 점들 완전 정리 후 모드 다시 활성화
                try {
                  // 그린 피처 완전 정리
                  cleanupDrawnFeature();
                  
                  // Advanced Trail Draw Point Service 완전 정리
                  import('~/assets/Drawing/services/advancedTrailDrawPointService').then(({ AdvancedTrailDrawPointService }) => {
                    AdvancedTrailDrawPointService.cleanupAll();
                    console.log('🔧 AdvancedTrailDrawPointService 완전 정리됨');
                    
                    // all-features-layer 제거하지 않음 (Advanced Select Vector 레이어 보존)
                    console.log('🔧 Advanced Select Vector 레이어 보존');
                    
                    // Advanced Trail Draw Point 모드 다시 활성화
                    import('~/assets/Drawing').then(({ activateAdvancedTrailDrawPointMode }) => {
                      activateAdvancedTrailDrawPointMode({
                        showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          drawnFeatureRef.current = feature;
                        }
                      });
                      console.log('🔧 Advanced Trail Draw Point 모드 다시 활성화됨');
                    });
                  });
                } catch (error) {
                  console.log('🔧 Advanced Trail Draw Point 모드 다시 활성화 중 오류:', error);
                }
              }
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 라인 타입 선택기 (MainPage와 동일) */}
      {showLineTypeSelector && drawnLinePixel && (
        <div
          style={{
            position: 'absolute',
            left: drawnLinePixel[0] + 10,
            top: drawnLinePixel[1] - 10,
            zIndex: 3000,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            padding: '8px',
            minWidth: '200px',
            transition: 'all 0.3s ease-out',
            transform: 'translateY(0) scale(1)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Line Type:
          </div>
          <select
            value={selectedLineType}
            onChange={(e) => handleLineTypeSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <option value="">Select...</option>
            {availableLineTypes.map((lineType) => (
              <option key={lineType.value} value={lineType.value}>
                {lineType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveClick}
            disabled={!selectedLineType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: selectedLineType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: selectedLineType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              console.log('🔧 라인 타입 선택기 취소 버튼 클릭');
              
              // 그린 피처만 정리 (cleanupDrawnFeature 호출하지 않음)
              if (drawnFeatureRef.current) {
                drawnFeatureRef.current = null;
              }
              
              // 상태 초기화 (팝업만 닫고 서비스는 유지)
              setShowLineTypeSelector(false);
              setDrawnLineCoordinate(null);
              setDrawnLinePixel(null);
              setSelectedLineType('');
              
              // activeTool에 따라 다르게 처리
              if (activeTool === 'drawLine') {
                // Trail Draw Line - 이전 그린 선들 완전 정리 후 모드 다시 활성화
                try {
                  // 그린 피처 완전 정리
                  cleanupDrawnFeature();
                  
                  // Trail Draw Line Service 완전 정리
                  import('~/assets/Drawing/services/trailDrawLineService').then(({ TrailDrawLineService }) => {
                    TrailDrawLineService.cleanupAll();
                    console.log('🔧 TrailDrawLineService 완전 정리됨');
                    
                    // Trail Draw Line 모드 다시 활성화
                    import('~/assets/Drawing').then(({ activateTrailDrawLineMode }) => {
                      activateTrailDrawLineMode({
                        showLineTypeSelectorPopup: showLineTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          drawnFeatureRef.current = feature;
                        }
                      });
                      console.log('🔧 Trail Draw Line 모드 다시 활성화됨');
                    });
                  });
                } catch (error) {
                  console.log('🔧 Trail Draw Line 모드 다시 활성화 중 오류:', error);
                }
              } else if (activeTool === 'advancedDrawLine') {
                // Advanced Trail Draw Line - 이전 그린 선들 완전 정리 후 모드 다시 활성화
                try {
                  // 그린 피처 완전 정리
                  cleanupDrawnFeature();
                  
                  // Advanced Trail Draw Line Service 완전 정리
                  import('~/assets/Drawing/services/advancedTrailDrawLineService').then(({ AdvancedTrailDrawLineService }) => {
                    AdvancedTrailDrawLineService.cleanupAll();
                    console.log('🔧 AdvancedTrailDrawLineService 완전 정리됨');
                    
                    // all-features-layer 제거하지 않음 (Advanced Select Vector 레이어 보존)
                    console.log('🔧 Advanced Select Vector 레이어 보존');
                    
                    // Advanced Trail Draw Line 모드 다시 활성화
                    import('~/assets/Drawing').then(({ activateAdvancedTrailDrawLineMode }) => {
                      activateAdvancedTrailDrawLineMode({
                        showLineTypeSelectorPopup: showLineTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          drawnFeatureRef.current = feature;
                        }
                      });
                      console.log('🔧 Advanced Trail Draw Line 모드 다시 활성화됨');
                    });
                  });
                } catch (error) {
                  console.log('🔧 Advanced Trail Draw Line 모드 다시 활성화 중 오류:', error);
                }
              }
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 폴리곤 타입 선택기 (MainPage와 동일) */}
      {showPolygonTypeSelector && drawnPolygonPixel && (
        <div
          style={{
            position: 'absolute',
            left: drawnPolygonPixel[0] + 10,
            top: drawnPolygonPixel[1] - 10,
            zIndex: 3000,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            padding: '8px',
            minWidth: '200px',
            transition: 'all 0.3s ease-out',
            transform: 'translateY(0) scale(1)',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Polygon Type:
          </div>
          <select
            value={selectedPolygonType}
            onChange={(e) => handlePolygonTypeSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <option value="">Select...</option>
            {availablePolygonTypes.map((polygonType) => (
              <option key={polygonType.value} value={polygonType.value}>
                {polygonType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveClick}
            disabled={!selectedPolygonType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: selectedPolygonType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: selectedPolygonType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              console.log('🔧 폴리곤 타입 선택기 취소 버튼 클릭');
              
              // 그린 피처만 정리 (cleanupDrawnFeature 호출하지 않음)
              if (drawnFeatureRef.current) {
                drawnFeatureRef.current = null;
              }
              
              // 상태 초기화 (팝업만 닫고 서비스는 유지)
              setShowPolygonTypeSelector(false);
              setDrawnPolygonCoordinate(null);
              setDrawnPolygonPixel(null);
              setSelectedPolygonType('');
              
              // activeTool에 따라 다르게 처리
              if (activeTool === 'drawPolygon') {
                // Trail Draw Polygon - 이전 그린 폴리곤들 완전 정리 후 모드 다시 활성화
                try {
                  // 그린 피처 완전 정리
                  cleanupDrawnFeature();
                  
                  // Trail Draw Polygon Service 완전 정리
                  import('~/assets/Drawing/services/trailDrawPolygonService').then(({ TrailDrawPolygonService }) => {
                    TrailDrawPolygonService.cleanupAll();
                    console.log('🔧 TrailDrawPolygonService 완전 정리됨');
                    
                    // Trail Draw Polygon 모드 다시 활성화
                    import('~/assets/Drawing').then(({ activateTrailDrawPolygonMode }) => {
                      activateTrailDrawPolygonMode({
                        showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          drawnFeatureRef.current = feature;
                        }
                      });
                      console.log('🔧 Trail Draw Polygon 모드 다시 활성화됨');
                    });
                  });
                } catch (error) {
                  console.log('🔧 Trail Draw Polygon 모드 다시 활성화 중 오류:', error);
                }
              } else if (activeTool === 'advancedDrawPolygon') {
                // Advanced Trail Draw Polygon - 이전 그린 폴리곤들 완전 정리 후 모드 다시 활성화
                try {
                  // 그린 피처 완전 정리
                  cleanupDrawnFeature();
                  
                  // Advanced Trail Draw Polygon Service 완전 정리
                  import('~/assets/Drawing/services/advancedTrailDrawPolygonService').then(({ AdvancedTrailDrawPolygonService }) => {
                    AdvancedTrailDrawPolygonService.cleanupAll();
                    console.log('🔧 AdvancedTrailDrawPolygonService 완전 정리됨');
                    
                    // all-features-layer 제거하지 않음 (Advanced Select Vector 레이어 보존)
                    console.log('🔧 Advanced Select Vector 레이어 보존');
                    
                    // Advanced Trail Draw Polygon Service 다시 활성화
                    import('~/assets/Drawing').then(({ activateAdvancedTrailDrawPolygonMode }) => {
                      activateAdvancedTrailDrawPolygonMode({
                        showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          drawnFeatureRef.current = feature;
                        }
                      });
                      console.log('🔧 Advanced Trail Draw Polygon 모드 다시 활성화됨');
                    });
                  });
                } catch (error) {
                  console.log('🔧 Advanced Trail Draw Polygon 모드 다시 활성화 중 오류:', error);
                }
              }
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 좌표 입력 모달 */}
      {showCoordinateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: '320px',
            maxWidth: '400px',
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              color: '#333',
              textAlign: 'center'
            }}>
              특정 좌표로 이동
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#555',
                fontWeight: '500'
              }}>
                X 좌표 (경도)
              </label>
              <input
                type="number"
                step="any"
                value={coordinateX}
                onChange={(e) => setCoordinateX(e.target.value)}
                placeholder="예: 127.0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#555',
                fontWeight: '500'
              }}>
                Y 좌표 (위도)
              </label>
              <input
                type="number"
                step="any"
                value={coordinateY}
                onChange={(e) => setCoordinateY(e.target.value)}
                placeholder="예: 37.5665"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCoordinateCancel}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                취소
              </button>
              <button
                onClick={handleCoordinateSubmit}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  background: '#007bff',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              >
                이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 투명도 설정 모달 */}
      {showOpacityModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: '400px',
            maxWidth: '500px',
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              color: '#333',
              textAlign: 'center'
            }}>
              레이어 투명도 설정
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#555',
                fontWeight: '500'
              }}>
                레이어 선택
              </label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">레이어를 선택하세요...</option>
                <option value="mvt-image">mvt-image</option>
                <option value="polygonHump">polygonHump</option>
                <option value="lineHump">lineHump</option>
                <option value="pointHump">pointHump</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#555',
                fontWeight: '500'
              }}>
                투명도 조절 (0.0 ~ 1.0)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacityValue}
                  onChange={(e) => setOpacityValue(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    background: '#ddd',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#333',
                  fontWeight: '500',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {opacityValue}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#666',
                marginTop: '4px'
              }}>
                <span>투명</span>
                <span>불투명</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleOpacityReset}
                disabled={!selectedLayer}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  background: selectedLayer ? '#dc3545' : '#ccc',
                  color: 'white',
                  cursor: selectedLayer ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedLayer) {
                    e.currentTarget.style.backgroundColor = '#c82333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLayer) {
                    e.currentTarget.style.backgroundColor = '#dc3545';
                  }
                }}
              >
                초기화
              </button>
              <button
                onClick={handleOpacityCancel}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                취소
              </button>
              <button
                onClick={handleOpacitySubmit}
                disabled={!selectedLayer}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  background: selectedLayer ? '#007bff' : '#ccc',
                  color: 'white',
                  cursor: selectedLayer ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedLayer) {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLayer) {
                    e.currentTarget.style.backgroundColor = '#007bff';
                  }
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 우클릭 메뉴 */}
      <Menu id={MENU_ID}>
        {contextMenuData?.map((item: any, index: number) => (
          <Item key={index} onClick={() => handleMenuClick(item)}>
            {item.label}
          </Item>
        ))}
      </Menu>
    </div>
  );
};

export default OSSMAPPage; 