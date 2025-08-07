import { useState, useRef } from 'react';
import { Map } from 'ol';
import VectorTileLayer from 'ol/layer/VectorTile';
import { VectorTile } from 'ol/source';
import RenderFeature from 'ol/render/Feature';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';
import { 
  addUserLayerSample, 
  initUserLayerSample, 
  deleteUserLayerSample, 
  entireAreaUserLayerSample
} from '~/assets/codeSampleManage/samples/userLayerSamples';
import {
  defaultContextMenuSample,
  editContextMenuSample
} from '~/assets/codeSampleManage/samples/contextMenuSamples';
import {
  setLayerDisplayLevelSample,
  setLayerStyleSample,
  setLayerStyleDefaultSample,
  setLayerOpacitySample,
  getLayerOpacitySample,
  resetLayerOpacitySample
} from '~/assets/codeSampleManage/samples/layerStyleSamples';
import { selectSample, advancedSelectSample, rectSelectionSample, circleSelectionSample, polygonSelectionSample, clearSelectLayerSample, getSelectedFeaturesSample } from '~/assets/codeSampleManage/samples/selectionSamples';
import {
  trailDistanceSample,
  trailAreaSample,
  trailSimpleSample,
  areaDrawRectSample,
  areaDrawCircleSample,
  areaDrawPolygonSample,
  trailDrawPointSample,
  trailDrawLineSample,
  trailDrawPolygonSample,
  getTrailCoordinateSample,
} from '~/assets/codeSampleManage/samples/drawingSamples';
import { trailEditSample, trailDeleteSample } from '~/assets/codeSampleManage/samples/editingSamples';
import { copyViewSample, exportMapImageSample, selectableFacilitySample, viewLayerInfoSample, setThematicsSample } from '~/assets/codeSampleManage/samples/mapInfoSamples';


// 코드 블록 타입 정의
export type CodeBlockType = 
  | 'center'
  | 'zoom'
  | 'minzoom'
  | 'maxzoom'
  | 'movecenter'
  | 'movecenterzoom'
  | 'movearea'
  | 'prevscreen'
  | 'forwardscreen'
  | 'zoomin'
  | 'zoomout'
  | 'adjustscale'
  | 'panby'
  | 'panto'
  | 'fitbounds'
  | 'getbounds'
  | 'setzoom'
  | 'resetView'
  | 'copyView'
  | 'rotateMap'
  | 'exportMapImage'
  | 'getLayer'
  | 'externalLayerName'
  | 'tableNameOfLayer'
  | 'minDisplayZoomLevel'
  | 'maxDisplayZoomLevel'
  | 'selectableFacility'
  | 'viewLayerInfo'
  | 'toggleDisplayHide'
  | 'refreshLayer'
  | 'addUserLayer'
  | 'initUserLayer'
  | 'deleteUserLayer'
  | 'entireAreaUserLayer'
  | 'defaultContextMenu'
  | 'editContextMenu'
  | 'setLayerDisplayLevel'
  | 'setLayerStyle'
  | 'setLayerStyleDefault'
  | 'setThematics'
  | 'select'
  | 'advancedSelect'
  | 'trailDistance'
  | 'trailArea'
  | 'trailEdit'
  | 'trailDelete'
  | 'rectSelection'
  | 'circleSelection'
  | 'polygonSelection'
  | 'trailSimple'
  | 'areaDrawRect'
  | 'areaDrawCircle'
  | 'areaDrawPolygon'
  | 'getSelectedFeatures'
  | 'getTrailCoordinate'
  | 'trailDrawLine'
  | 'trailDrawPoint'
  | 'trailDrawPolygon'
  | 'clearSelectLayer'
  | 'setLayerOpacity'
  | 'getLayerOpacity'
  | 'resetLayerOpacity'
  | null;

export const useMainPageState = () => {
  // === UI 상태들 ===
  const [open, setOpen] = useState([false, false, false]);
  const [showMenu, setShowMenu] = useState(false);
  const [isToggleActivated, setIsToggleActivated] = useState(false);
  const [menuCenter, setMenuCenter] = useState(0);

  // === 코드 블록 표시 상태들 ===
  // 개별 상태들은 제거하고 통합된 방식만 사용
  // 개별 코드 블록 상태들은 제거됨 (통합된 방식 사용)

  // === 코드 블록 관리 상태들 ===
  const [isCodeBlockVisible, setIsCodeBlockVisible] = useState(false);
  const [isCodeBlockActive, setIsCodeBlockActive] = useState(false);
  const [codeBlockType, setCodeBlockType] = useState<CodeBlockType>(null);

  // === 컨텍스트 메뉴 상태 ===
  const [contextMenuEnabled, setContextMenuEnabled] = useState(false);

  // === 코드 예시 문자열들 ===

  // === 지도 관련 상태들 ===
  const mapRef = useRef<Map | null>(null);
  const [zoom, setZoomDisplay] = useState(15);
  const vectorTileLayers = useRef<VectorTileLayer<VectorTile<RenderFeature>, RenderFeature>[]>([]);
  const tileWmsLayer = useRef<ImageLayer<ImageWMS> | null>(null);
  // === 피처/드로우 관련 ref ===
  const drawInteractionRef = useRef<any>(null);
  const drawnFeatureRef = useRef<any>(null);
  const drawLayerRef = useRef<any>(null);

  // === 레이어 정보 상태들 ===
  const [getLayerInfo, setGetLayerInfo] = useState<any>(null);
  const [isLayerInfoModalVisible, setLayerInfoModalVisible] = useState(false);

  // === 선택 가능한 시설 상태들 ===
  const [selectableFacilityResult, setSelectableFacilityResult] = useState('');
  const [isRunningSelectable, setIsRunningSelectable] = useState(false);

  // === 편집 모드 상태들 ===
  const editModeRef = useRef<{ mode: string; featureId: string | null }>({ mode: '', featureId: null });
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [editModePosition, setEditModePosition] = useState({ x: 0, y: 0 });
  const [showEditModeButton, setShowEditModeButton] = useState(false);
  const mouseEventHandlerRef = useRef<any>(null);
  const mouseEventTimeoutRef = useRef<number | null>(null);

  // === 포인트 그리기 상태들 ===
  const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
  const [drawnPointCoordinate, setDrawnPointCoordinate] = useState<number[] | null>(null);
  const [drawnPointPixel, setDrawnPointPixel] = useState<number[] | null>(null);
  const [nodeTypeSelectorPosition, setNodeTypeSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectedNodeType, setSelectedNodeType] = useState<string>('');
  const [availableNodeTypes] = useState([
    { value: 'nodeBusinessPlan', label: 'nodeBusinessPlan (Point)' }
  ]);

  // === 라인 그리기 상태들 ===
  const [showLineTypeSelector, setShowLineTypeSelector] = useState(false);
  const [drawnLineCoordinate, setDrawnLineCoordinate] = useState<number[] | null>(null);
  const [drawnLinePixel, setDrawnLinePixel] = useState<number[] | null>(null);
  const [lineTypeSelectorPosition, setLineTypeSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectedLineType, setSelectedLineType] = useState<string>('');
  const [availableLineTypes] = useState([
    { value: 'linkDsWay', label: 'linkDsWay (Line)' }
  ]);

  // === 폴리곤 그리기 상태들 ===
  const [showPolygonTypeSelector, setShowPolygonTypeSelector] = useState(false);
  const [drawnPolygonCoordinate, setDrawnPolygonCoordinate] = useState<number[] | null>(null);
  const [drawnPolygonPixel, setDrawnPolygonPixel] = useState<number[] | null>(null);
  const [polygonTypeSelectorPosition, setPolygonTypeSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectedPolygonType, setSelectedPolygonType] = useState<string>('');
  const [availablePolygonTypes] = useState([
    { value: 'polygonHump', label: 'polygonHump (Polygon)' }
  ]);

  // === 레이어 컨트롤 상태들 ===
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
  const [layerControlPosition, setLayerControlPosition] = useState({ 
    x: window.innerWidth - 60, 
    y: 80 
  });

  // === 메뉴 하이라이트 상태들 ===
  const [highlightMoveMenu, setHighlightMoveMenu] = useState<string[]>([]);
  const [blueMoveMenu, setBlueMoveMenu] = useState<string[]>([]);

  // === 드래그 상태들 ===
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // === 레이어 데이터 상태 ===
  const [layerData, setLayerData] = useState<any[]>([]);
  const [dataStyles, setDataStyles] = useState<any>(null);

  // === DOM ref 상태들 ===
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  
  // === 테마 관련 상태들 ===
  const [themeCustom, setThemeCustom] = useState({ layerName: '', stylesName: '' });
  
  // === 코드 블록 표시 상태들 (추가) ===
  const [showViewLayerInfoCode, setShowViewLayerInfoCode] = useState(false);
  const [showAddUserLayerCode, setShowAddUserLayerCode] = useState(false);
  const [showInitUserLayerCode, setShowInitUserLayerCode] = useState(false);
  const [showDeleteUserLayerCode, setShowDeleteUserLayerCode] = useState(false);
  const [showEntireAreaUserLayerCode, setShowEntireAreaUserLayerCode] = useState(false);
  const [showDefaultContextMenuCode, setShowDefaultContextMenuCode] = useState(false);
  const [showEditContextMenuCode, setShowEditContextMenuCode] = useState(false);
  
  // === 모달 상태들 ===
  const [isSelectableFacilityModalVisible, setIsSelectableFacilityModalVisible] = useState(false);
  
  // === 컨텍스트 메뉴 상태들 ===
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  
  // === 하이라이트 레이어 ref ===
  const highlightLayerRef = useRef<any>(null);

  // === 코드 예시 문자열들 (추가) ===
  const [defaultContextMenuCode] = useState(defaultContextMenuSample);
  const [editContextMenuCode] = useState(editContextMenuSample);

  
  // === 추가 코드 예시 문자열들 ===




  const [getTrailCoordinateCode] = useState(getTrailCoordinateSample);

  const [trailDeleteCode] = useState(trailDeleteSample);
  const [advancedSelectCode] = useState(advancedSelectSample);
  const [rectSelectionCode] = useState(rectSelectionSample);
  const [circleSelectionCode] = useState(circleSelectionSample);
  const [polygonSelectionCode] = useState(polygonSelectionSample);

  return {
    // UI 상태들
    open, setOpen,
    showMenu, setShowMenu,
    isToggleActivated, setIsToggleActivated,
    menuCenter, setMenuCenter,

    // 코드 블록 표시 상태들 (개별 상태들은 제거됨)
    // 개별 코드 블록 상태들은 제거됨 (통합된 방식 사용)

    // 코드 블록 관리 상태들
    isCodeBlockVisible, setIsCodeBlockVisible,
    isCodeBlockActive, setIsCodeBlockActive,
    codeBlockType, setCodeBlockType,

    // 코드 예시 문자열들

    // 지도 관련 상태들
    mapRef,
    zoom, setZoomDisplay,
    vectorTileLayers,
    tileWmsLayer,
    // === 피처/드로우 관련 ref ===
    drawInteractionRef,
    drawnFeatureRef,
    drawLayerRef,

    // 레이어 정보 상태들
    getLayerInfo, setGetLayerInfo,
    isLayerInfoModalVisible, setLayerInfoModalVisible,

    // 선택 가능한 시설 상태들
    selectableFacilityResult, setSelectableFacilityResult,
    isRunningSelectable, setIsRunningSelectable,

    // 편집 모드 상태들
    editModeRef,
    isEditModeActive, setIsEditModeActive,
    editModePosition, setEditModePosition,
    showEditModeButton, setShowEditModeButton,
    mouseEventHandlerRef,
    mouseEventTimeoutRef,

    // 포인트 그리기 상태들
    showNodeTypeSelector, setShowNodeTypeSelector,
    drawnPointCoordinate, setDrawnPointCoordinate,
    drawnPointPixel, setDrawnPointPixel,
    nodeTypeSelectorPosition, setNodeTypeSelectorPosition,
    selectedNodeType, setSelectedNodeType,
    availableNodeTypes,

    // 라인 그리기 상태들
    showLineTypeSelector, setShowLineTypeSelector,
    drawnLineCoordinate, setDrawnLineCoordinate,
    drawnLinePixel, setDrawnLinePixel,
    lineTypeSelectorPosition, setLineTypeSelectorPosition,
    selectedLineType, setSelectedLineType,
    availableLineTypes,

    // 폴리곤 그리기 상태들
    showPolygonTypeSelector, setShowPolygonTypeSelector,
    drawnPolygonCoordinate, setDrawnPolygonCoordinate,
    drawnPolygonPixel, setDrawnPolygonPixel,
    polygonTypeSelectorPosition, setPolygonTypeSelectorPosition,
    selectedPolygonType, setSelectedPolygonType,
    availablePolygonTypes,

    // 레이어 컨트롤 상태들
    showLayerControl, setShowLayerControl,
    checkedLayers, setCheckedLayers,
    layerControlPosition, setLayerControlPosition,
    isDragging, setIsDragging,
    dragOffset, setDragOffset,
    dragStartPos, setDragStartPos,
    hasMoved, setHasMoved,

    // 메뉴 하이라이트 상태들
    highlightMoveMenu, setHighlightMoveMenu,
    blueMoveMenu, setBlueMoveMenu,

    // 레이어 데이터 상태
    layerData, setLayerData,
    dataStyles, setDataStyles,

    // DOM ref 상태들
    mapContainerRef,
    asideRef,
    
    // 테마 관련 상태들
    themeCustom, setThemeCustom,
    
    // 코드 블록 표시 상태들 (추가)
    showViewLayerInfoCode, setShowViewLayerInfoCode,
    showAddUserLayerCode, setShowAddUserLayerCode,
    showInitUserLayerCode, setShowInitUserLayerCode,
    showDeleteUserLayerCode, setShowDeleteUserLayerCode,
    showEntireAreaUserLayerCode, setShowEntireAreaUserLayerCode,
    showDefaultContextMenuCode, setShowDefaultContextMenuCode,
    showEditContextMenuCode, setShowEditContextMenuCode,
    
    // 모달 상태들
    isSelectableFacilityModalVisible, setIsSelectableFacilityModalVisible,
    
    // 컨텍스트 메뉴 상태들
    contextMenuPos, setContextMenuPos,
    contextMenuEnabled, setContextMenuEnabled,
    
    // 하이라이트 레이어 ref
    highlightLayerRef,

    // 코드 예시 문자열들 (추가)
    defaultContextMenuCode,
    editContextMenuCode,

    
    // 추가 코드 예시 문자열들




    getTrailCoordinateCode,


    trailDeleteCode,
    advancedSelectCode,
    rectSelectionCode,
    circleSelectionCode,
    polygonSelectionCode,
  };
}; 