import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fromLonLat, toLonLat, get as getProjection, transform, transformExtent } from 'ol/proj';
import { FiMap, FiLayers, FiEdit3, FiChevronDown, FiChevronRight, FiChevronLeft, FiBookOpen } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import proj4 from 'proj4';
import { useMapHistoryStore } from '~/store/useHistoryStore';
import { useGetLayerList } from '~/assets/Home/services/useGetLayers';
import { useGetLayerStyles } from '~/assets/Home/services/useGetStylesLayers';
import { createImageLayer } from '~/assets/OpenLayer/utils/mvtLayers';
import { createVectorLayer } from '~/assets/OpenLayer/utils/mvtLayers';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useMapbase } from '~/store/useMapbase';
import VectorTileLayer from 'ol/layer/VectorTile';
import { VectorTile } from 'ol/source';
import RenderFeature from 'ol/render/Feature';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';
import { Button } from 'antd';
import { getListFeaturesInPixel, updateFeatureViaWFS } from '~/assets/OpenLayer/services/getFeatures';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point, LineString, Polygon, MultiLineString, MultiPolygon } from 'ol/geom';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import { useTrailArea, activateTrailDistanceMode, activateTrailAreaMode, activateAreaDrawRectMode, activateAreaDrawCircleMode, activateAreaDrawPolygonMode, activateTrailDrawPointMode, activateTrailDrawLineMode, activateAdvancedTrailDrawLineMode, activateTrailDrawPolygonMode, activateAdvancedTrailDrawPolygonMode, activateAdvancedTrailDrawPointMode } from '~/assets/Drawing';
// CodeExamplePanel import 제거 (fe5 방식으로 되돌림)
import { getMenuIcon, menuItems, treeData, moveMenu, highlightMoveMenu, blueMoveMenu } from '~/components/MenuSidebar/menuData';
import { useTrailDistance } from '~/assets/Drawing';


import { useAreaDraw } from '~/assets/Drawing/hooks/useAreaDraw';
import { useTrailDraw, useTrailDrawPoint, useTrailDrawPolygon } from '~/assets/Drawing/hooks/useTrailDraw';
import { useAdvancedTrailDrawPolygon } from '~/assets/Drawing/hooks/useAdvancedTrailDrawPolygon';
import { useAdvancedTrailDrawPoint } from '~/assets/Drawing/hooks/useAdvancedTrailDrawPoint';
import { Modify, Snap, Translate } from 'ol/interaction';

import { Collection } from 'ol';
import { useRectangleSelection } from '~/assets/Selection';
import { useCircleSelection } from '~/assets/Selection';
import { usePolygonSelection } from '~/assets/Selection';
import { useBasicSelect, useAdvancedSelect, activateSelectMode, activateAdvancedSelectMode, activateRectSelectionMode, activateCircleSelectionMode, activatePolygonSelectionMode, clearSelectLayer } from '~/assets/Selection';
import { activateTrailEditMode, activateTrailDeleteMode } from '~/assets/Editing';
import { useLayerDelete, deleteSelectedFeature } from '~/assets/LayerControl';

import { ModeSelector } from '~/models/ModeDraw';
import LayerControl from '~/components/LayerControl';

// 새로 만든 훅들 import
import { useMapPan, useMapScale, useMapInfo, useMapHistory, useMapExport } from '~/assets/Navigation';

import {
  getScreenCenterPointSample,
  getCurrentZoomLevelSample,
  getMinZoomLevelSample,
  getMaxZoomLevelSample,
  prevScreenSample,
  forwardScreenSample,
  moveCenterPointSample,
  moveCenterPointAndChangeLevelSample,
  moveAreaSample,
  zoomInMapSample,
  zoomOutMapSample,
  adjustScaleSample,
  panBySample,
  panToSample,
  fitBoundsSample,
  getBoundsSample,
  setZoomSample,
  resetViewSample,
  rotateMapSample,
  addUserLayerSample,
  initUserLayerSample,
  deleteUserLayerSample,
  entireAreaUserLayerSample
} from '~/assets/codeSampleManage';
import { selectSample, advancedSelectSample, rectSelectionSample, circleSelectionSample, polygonSelectionSample, clearSelectLayerSample, getSelectedFeaturesSample } from '~/assets/codeSampleManage/samples/selectionSamples';
import { areaDrawRectSample, areaDrawCircleSample, areaDrawPolygonSample, trailDrawPointSample, advancedTrailDrawPointSample, trailDrawPolygonSample, advancedTrailDrawPolygonSample, trailDistanceSample, trailAreaSample, trailSimpleSample, trailDrawLineSample, advancedTrailDrawLineSample, getTrailCoordinateSample } from '~/assets/codeSampleManage/samples/drawingSamples';

import { trailEditSample, trailDeleteSample } from '~/assets/codeSampleManage/samples/editingSamples';
import { setLayerOpacitySample, getLayerOpacitySample, resetLayerOpacitySample, setLayerDisplayLevelSample, setLayerStyleSample, setLayerStyleDefaultSample, setThematicsSample } from '~/assets/codeSampleManage/samples/layerStyleSamples';
import { copyViewSample, exportMapImageSample } from '~/assets/codeSampleManage/samples/mapInfoSamples';
import { defaultContextMenuSample, editContextMenuSample } from '~/assets/codeSampleManage/samples/contextMenuSamples';
import {
  getLayerSample,
  getExternalLayerNameSample,
  getTableNameOfLayerSample,
  getMinDisplayZoomLevelSample,
  getMaxDisplayZoomLevelSample,
  getSelectableFacilitySample,
  viewLayerInfoSample,
  toggleDisplayHideSample,
  refreshLayerSample
} from '~/assets/codeSampleManage/samples/layerManagementSamples';


import { useCodeExecution } from '../../hooks/useCodeExecution';
import { useMainPageState, CodeBlockType } from '../../hooks/useMainPageState';
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

const fontFamily = 'Pretendard, Noto Sans KR, Apple SD Gothic Neo, sans-serif';
const MENU_ID = 'MAINPAGE_CONTEXT_MENU';

// 신규 라이브러리 사용 (window 객체 노출 불필요)

// GeoJSON geometry를 OpenLayers geometry로 변환하는 함수
function createOLGeometry(geojson: any) {
  console.log('createOLGeometry called with:', geojson);
  if (!geojson) {
    console.log('geojson is null or undefined');
    return undefined;
  }
  console.log('geojson.type:', geojson.type);
  console.log('geojson.coordinates:', geojson.coordinates);
  
  // 좌표 유효성 검증 함수
  const validateCoordinates = (coords: any, type: string): boolean => {
    if (!coords || !Array.isArray(coords)) {
      console.error(`${type}: coordinates is not an array:`, coords);
      return false;
    }
    
    if (coords.length === 0) {
      console.error(`${type}: coordinates array is empty`);
      return false;
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
    
    if (hasInvalidValues(coords)) {
      console.error(`${type}: coordinates contains invalid values:`, coords);
      return false;
    }
    
    return true;
  };
  
  if (geojson.type === 'Point') {
    console.log('Creating Point geometry');
    if (!validateCoordinates(geojson.coordinates, 'Point')) {
      return undefined;
    }
    return new Point(geojson.coordinates);
  }
  
  if (geojson.type === 'LineString') {
    console.log('Creating LineString geometry');
    if (!validateCoordinates(geojson.coordinates, 'LineString')) {
      return undefined;
    }
    return new LineString(geojson.coordinates);
  }
  
  if (geojson.type === 'MultiLineString') {
    console.log('Creating MultiLineString geometry');
    if (!validateCoordinates(geojson.coordinates, 'MultiLineString')) {
      return undefined;
    }
    return new MultiLineString(geojson.coordinates);
  }
  
  if (geojson.type === 'Polygon') {
    console.log('Creating Polygon geometry');
    if (!validateCoordinates(geojson.coordinates, 'Polygon')) {
      return undefined;
    }
    
    // Polygon의 경우 첫 번째 ring이 외곽선이어야 함
    if (geojson.coordinates.length === 0 || geojson.coordinates[0].length < 3) {
      console.error('Polygon: insufficient coordinates for polygon (need at least 3 points)');
      return undefined;
    }
    
    return new Polygon(geojson.coordinates);
  }
  
  if (geojson.type === 'MultiPolygon') {
    console.log('Creating MultiPolygon geometry');
    if (!validateCoordinates(geojson.coordinates, 'MultiPolygon')) {
      return undefined;
    }
    return new MultiPolygon(geojson.coordinates);
  }
  
  // 기타 geometry 타입들
  console.log('Unsupported geometry type:', geojson.type);
  return undefined;
}

// === WMS 레이어 새로고침 함수 ===
function refreshWmsLayers(mapRef: any) {
  const layers = mapRef?.getLayers().getArray() || [];
  layers.forEach((layer: any) => {
    if (layer instanceof TileLayer || layer instanceof ImageLayer) {
      const source = layer.getSource();
      if (source && source.refresh) {
        console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
        source.refresh();
      }
    } else if (layer.get('layerName') === 'polygonHump' && 'getSource' in layer) {
      // Vector Tile 레이어인 경우 타일 캐시 무효화 및 강제 새로고침
      console.log('Vector Tile 레이어 새로고침: polygonHump');
      const source = (layer as any).getSource();
      if (source && source.clear) {
        source.clear(); // 타일 캐시 무효화
        source.refresh(); // 타일을 강제로 다시 로드
      }
    }
  });
}

export default function MainPage() {
  // 모든 상태를 hook에서 가져오기
  const state = useMainPageState();
  const navigate = useNavigate();
  const { data: layerData, isLoading, error } = useGetLayerList();
  const { data: dataStyles } = useGetLayerStyles();
  // useMapHistoryStore는 더 이상 사용하지 않음 (MapHistory 패키지로 대체)
  const { show } = useContextMenu({ id: MENU_ID });
  const contextMenuData = useMapbase(state => state.contextMenu);

  // 새로 만든 Navigation 훅들 초기화
  const mapPan = useMapPan();
  const mapScale = useMapScale();
  const mapInfo = useMapInfo();
  const mapHistory = useMapHistory();
  const mapExport = useMapExport();
  
  
  // Trail Draw 훅들 초기화
  const trailDrawPoint = useTrailDrawPoint({ onEndDraw: () => console.log('Trail Draw Point ended') });
  const trailDraw = useTrailDraw({ onEndDraw: () => console.log('Trail Draw Line ended') });
  const trailDrawPolygon = useTrailDrawPolygon({ onEndDraw: () => console.log('Trail Draw Polygon ended') });
  const trailDistance = useTrailDistance({ onEndDraw: () => console.log('Trail Distance ended') });
  const trailArea = useTrailArea({ onEndDraw: () => console.log('Trail Area ended') });
  
  // Advanced Trail Draw 훅들 초기화
  const advancedTrailDrawPolygon = useAdvancedTrailDrawPolygon();
  const advancedTrailDrawPoint = useAdvancedTrailDrawPoint();
  
  // Selection hooks 초기화
  const basicSelect = useBasicSelect({
    map: state.mapRef.current,
    layerData: layerData || [],
    onFeatureSelect: (feature: any) => {
      console.log('BasicSelect: 피처 선택됨', feature);
    },
    onFeatureDeselect: () => {
      console.log('BasicSelect: 피처 선택 해제됨');
    }
  });

  const advancedSelect = useAdvancedSelect({
    map: state.mapRef.current,
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

  // Layer Delete 훅 초기화
  const layerDelete = useLayerDelete();





  // 초기 레이어 상태 설정
  useEffect(() => {
    console.log('useGetLayerList 상태:', { isLoading, error, layerData });
    
    if (layerData) {
      state.setLayerData(layerData);
      console.log('layerData:', layerData);
      const initialCheckedLayers = layerData
        .filter(layer => layer.visible && layer.value)
        .map(layer => layer.value)
        .filter((value): value is string => value !== undefined);
      console.log('initialCheckedLayers:', initialCheckedLayers);
      state.setCheckedLayers(initialCheckedLayers);
    }
  }, [layerData, state.setCheckedLayers, state.setLayerData, isLoading, error]);
  
  // 노드 타입 선택기 표시 함수들 (fe5 방식)
  const showNodeTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    console.log('=== showNodeTypeSelectorPopup 호출됨 ===');
    console.log('좌표:', coordinate);
    console.log('픽셀:', pixel);
    
    try {
      state.setDrawnPointCoordinate(coordinate);
      console.log('drawnPointCoordinate 설정 완료');
      
      state.setDrawnPointPixel(pixel);
      console.log('drawnPointPixel 설정 완료');
      
      state.setSelectedNodeType(''); // 선택된 값 초기화
      console.log('selectedNodeType 초기화 완료');
      
      state.setShowNodeTypeSelector(true);
      console.log('showNodeTypeSelector true 설정 완료');
      
      console.log('=== 노드 타입 선택기 상태 설정 완료 ===');
    } catch (error) {
      console.error('showNodeTypeSelectorPopup에서 오류 발생:', error);
    }
  };

  const showLineTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    state.setDrawnLineCoordinate(coordinate);
    state.setDrawnLinePixel(pixel);
    state.setSelectedLineType(''); // 선택된 값 초기화
    state.setShowLineTypeSelector(true);
  };

  const showPolygonTypeSelectorPopup = (coordinate: number[], pixel: number[]) => {
    state.setDrawnPolygonCoordinate(coordinate);
    state.setDrawnPolygonPixel(pixel);
    state.setSelectedPolygonType(''); // 선택된 값 초기화
    state.setShowPolygonTypeSelector(true);
  };
  


  // 포인트 저장 함수 - fe5 방식으로 구현됨

  // 코드 실행 함수들을 훅으로 교체
  const {
    handleRunDefaultContextMenuCode,
    handleRunEditContextMenuCode,
    handleRunGetLayerCode,
    handleRunGetExternalLayerNameCode,
    handleRunGetTableNameOfLayerCode,
    handleRunGetMinDisplayZoomLevelCode,
    handleRunGetMaxDisplayZoomLevelCode,
    handleRunSelectableFacilityCode,
    handleRunViewLayerInfoCode,
    handleRunToggleDisplayHideCode,
    handleRunRefreshLayerCode,
    handleRunAddUserLayerCode,
    handleRunInitUserLayerCode,
    handleRunDeleteUserLayerCode,
    handleRunEntireAreaUserLayerCode,
    handleRunSetLayerDisplayLevelCode,
    handleRunSetLayerStyleCode,
    handleRunSetLayerStyleDefaultCode,
    handleRunSetLayerOpacityCode,
    handleRunGetLayerOpacityCode,
    handleRunResetLayerOpacityCode,
    handleRunSetThemematicsCode,
    handleRunClearSelectLayerCode,
    handleRunSelectCode,
    handleRunAdvancedSelectCode,
    handleRunTrailDistanceCode,
    handleRunTrailSimpleCode,
    handleRunAreaDrawRectCode,
    handleRunAreaDrawCircleCode,
    handleRunAreaDrawPolygonCode,
    handleRunTrailAreaCode,
    handleRunTrailEditCode,
    handleRunGetSelectedFeaturesCode,
    handleRunGetTrailCoordinateCode,
      handleRunTrailDrawLineCode,
    handleRunAdvancedTrailDrawLineCode,
  handleRunTrailDrawPointCode,
  handleRunAdvancedTrailDrawPointCode,
    handleRunTrailDrawPolygonCode,
    handleRunAdvancedTrailDrawPolygonCode,
    
    // Navigation 핸들러들
    handleRunGetCenterCode,
    handleRunGetZoomCode,
    handleRunGetMinZoomCode,
    handleRunGetMaxZoomCode,
    handleRunMoveCenterCode,
    handleRunMoveCenterZoomCode,
    handleRunMoveAreaCode,
    handleRunPrevScreenCode,
    handleRunForwardScreenCode,
    handleRunZoomInCode,
    handleRunZoomOutCode,
    handleRunAdjustScaleCode,
    handleRunPanByCode,
    handleRunPanToCode,
    handleRunFitBoundsCode,
    handleRunGetBoundsCode,
    handleRunSetZoomCode,
    handleRunResetViewCode,
    handleRunCopyViewCode,
    handleRunRotateMapCode,
    handleRunExportMapImageCode,
    
    openCodeBlock,
    closeCodeBlockAfterRun,
  } = useCodeExecution({
    map: state.mapRef.current,
    setCodeBlockType: (type: string | null) => state.setCodeBlockType(type as any),
    setShowCodeBlock: state.setIsCodeBlockVisible,
    setContextMenuEnabled: state.setContextMenuEnabled,
    showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
    showLineTypeSelectorPopup: showLineTypeSelectorPopup,
    showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
    setDrawnFeature: (feature: any) => { state.drawnFeatureRef.current = feature; }
  });

  // 코드 블록 활성화/비활성화 이벤트 리스너
  useEffect(() => {
    const handleActivateCodeBlock = () => {
      state.setIsCodeBlockActive(true);
    };

    const handleDeactivateCodeBlock = () => {
      state.setIsCodeBlockActive(false);
    };

    window.addEventListener('activateCodeBlock', handleActivateCodeBlock);
    window.addEventListener('deactivateCodeBlock', handleDeactivateCodeBlock);
    return () => {
      window.removeEventListener('activateCodeBlock', handleActivateCodeBlock);
      window.removeEventListener('deactivateCodeBlock', handleDeactivateCodeBlock);
    };
  }, [state.setIsCodeBlockActive]);

  // 전역 변수 동기화 제거 (중복 렌더링 문제 해결)
  
  // fe5 방식의 저장 함수들
  const saveDrawnPoint = async (nodeType: string) => {
    console.log('=== saveDrawnPoint 호출됨 ===');
    console.log('nodeType:', nodeType);
    console.log('drawnPointCoordinate:', state.drawnPointCoordinate);
    
    if (!state.drawnPointCoordinate) {
      console.error('drawnPointCoordinate가 없습니다!');
      return;
    }
    
    try {
      const { insertFeatureViaWFS } = await import('~/assets/OpenLayer/services/getFeatures');
      
      // EPSG:5179에서 EPSG:4326으로 좌표 변환
      const transform = state.mapRef.current?.getView().getProjection().getCode() === 'EPSG:5179' ? 
        async (coord: number[]) => {
          const { transform } = await import('ol/proj');
          return transform(coord, 'EPSG:5179', 'EPSG:4326');
        } : 
        (coord: number[]) => coord;
      
      const transformedCoordinate = await transform(state.drawnPointCoordinate);
      
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
        
        // 레이어 새로고침 (WMS + Vector Tile)
        const layers = state.mapRef.current?.getLayers().getArray() || [];
        console.log('현재 지도의 모든 레이어:', layers.map(l => ({
          layerName: l.get('layerName'),
          type: l.constructor.name,
          visible: l.getVisible()
        })));
        console.log('레이어 상세 정보:', JSON.stringify(layers.map(l => ({
          layerName: l.get('layerName'),
          type: l.constructor.name,
          visible: l.getVisible(),
          opacity: l.getOpacity(),
          zIndex: l.getZIndex(),
          source: 'getSource' in l ? (l as any).getSource()?.constructor.name : 'no source'
        })), null, 2));
        
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
              source.refresh();
            }
          } else if (layer.get('layerName') === nodeType && 'getSource' in layer) {
            console.log(`Vector Tile 레이어 새로고침: ${nodeType}`);
            // Vector Tile 레이어는 건너뛰고 WMS 레이어만 새로고침 (Trail Edit 방식)
            // Vector Tile은 캐싱 문제로 즉시 반영되지 않을 수 있음
          }
        });
        
        // 편집 모드 하이라이트 제거
        const allLayers = state.mapRef.current?.getLayers().getArray() || [];
        allLayers.forEach(layer => {
          if (layer.get('isEditLayer') && layer instanceof VectorLayer) {
            const source = layer.getSource();
            if (source) {
              const features = source.getFeatures();
              features.forEach((feature: any) => {
                feature.setStyle(null); // 하이라이트 스타일 제거
              });
            }
          }
        });
        
        // 지도 렌더링
        state.mapRef.current?.render();
        
        // 디버깅: 현재 지도 상태 출력
        const currentZoom = state.mapRef.current?.getView().getZoom();
        const currentCenter = state.mapRef.current?.getView().getCenter();
        const currentExtent = state.mapRef.current?.getView().calculateExtent();
        console.log('현재 지도 상태:', {
          zoom: currentZoom,
          center: currentCenter,
          extent: currentExtent,
          savedPoint: state.drawnPointCoordinate
        });
        
        // nodeBusinessPlan 레이어 상태 확인
        const nodeBusinessPlanLayer = state.mapRef.current?.getLayers().getArray().find(layer => 
          layer.get('layerName') === 'nodeBusinessPlan'
        );
        console.log('nodeBusinessPlan 레이어 상태:', {
          exists: !!nodeBusinessPlanLayer,
          visible: nodeBusinessPlanLayer?.getVisible(),
          minZoom: nodeBusinessPlanLayer?.get('minZoom'),
          maxZoom: nodeBusinessPlanLayer?.get('maxZoom'),
          currentZoom: currentZoom
        });
        
        // 추가: Trail Edit와 동일한 방식으로 WMS 레이어 강제 새로고침
        setTimeout(() => {
          const allLayers = state.mapRef.current?.getLayers().getArray() || [];
          allLayers.forEach(layer => {
            if (layer instanceof TileLayer || layer instanceof ImageLayer) {
              const source = layer.getSource();
              if (source && source.refresh) {
                console.log('지연된 WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
                source.refresh();
              }
            }
          });
          state.mapRef.current?.render();
        }, 500);
        
        // 그린 점 제거 (Drawing 패키지의 레이어에서)
        const drawingLayers = state.mapRef.current?.getLayers().getArray() || [];
        drawingLayers.forEach(layer => {
          if (layer instanceof VectorLayer && layer.getSource()) {
            const source = layer.getSource();
            const features = source.getFeatures();
            features.forEach((feature: any) => {
              // Point geometry를 가진 feature 제거 (그린 점들)
              const geometry = feature.getGeometry();
              if (geometry && geometry.getType() === 'Point') {
                source.removeFeature(feature);
              }
            });
          }
        });
        
              // 전역 정리 함수 호출 (Advanced Trail Draw Point는 제외)
      const currentMode = useMapbase.getState().drawMode?.mode;
      if (currentMode !== 'advanced-trail-draw-point') {
        const { TrailDrawPointService } = await import('~/assets/Drawing');
        TrailDrawPointService.cleanupAll();
      }
        
        // 잠시 대기 후 모드 재설정 (정리 완료 보장)
        setTimeout(async () => {
          // 현재 모드 확인
          const currentMode = useMapbase.getState().drawMode?.mode;
          
          // Advanced Trail Draw Point 모드가 아닐 때만 trail-draw로 설정
          if (currentMode !== 'advanced-trail-draw-point') {
            // Trail Draw Point 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'Point' });
            
            // 새로운 서비스 강제 활성화
            const { activateTrailDrawPointMode } = await import('~/assets/Drawing');
            activateTrailDrawPointMode({
              showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                state.drawnFeatureRef.current = feature;
              }
            });
          } else {
            // Advanced Trail Draw Point 모드 유지
            console.log('Advanced Trail Draw Point 모드 유지');
          }
        }, 100);
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('포인트 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 상태 초기화
      state.setShowNodeTypeSelector(false);
      state.setDrawnPointCoordinate(null);
      state.setDrawnPointPixel(null);
      state.setSelectedNodeType('');
      state.drawnFeatureRef.current = null; // 그린 feature 참조 초기화
      
      // Advanced Trail Draw Point 모드가 아닐 때만 정리 및 모드 재설정
      const cleanupMode = useMapbase.getState().drawMode?.mode;
      console.log('🔍 saveDrawnPoint finally 블록 - 현재 모드:', cleanupMode);
      
      if (cleanupMode !== 'advanced-trail-draw-point') {
        console.log('🔍 일반 Trail Draw Point 모드 - 정리 및 재설정');
        // 일반 Trail Draw Point 정리
        const { TrailDrawPointService } = await import('~/assets/Drawing');
        TrailDrawPointService.cleanupAll();
        
        // Trail Draw Point 모드 다시 활성화
        useMapbase.getState().setMode('trail-draw', { geoType: 'Point' });
      } else {
        console.log('🔍 Advanced Trail Draw Point 모드 - 다시 활성화');
        // Advanced Trail Draw Point 모드 유지 - AdvancedTrailDrawPointService 다시 활성화
        
        // all-features-layer 제거 (새로고침으로 인한 문제 해결)
        const layers = state.mapRef.current?.getLayers().getArray() || [];
        const allFeaturesLayer = layers.find((layer: any) => layer.get('name') === 'all-features-layer');
        if (allFeaturesLayer && state.mapRef.current) {
          state.mapRef.current.removeLayer(allFeaturesLayer);
          console.log('🔍 all-features-layer 제거됨');
        }
        
        // Advanced Trail Draw Point Service 다시 활성화
        const { activateAdvancedTrailDrawPointMode } = await import('~/assets/Drawing');
        activateAdvancedTrailDrawPointMode({
          showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            state.drawnFeatureRef.current = feature;
          }
        });
        console.log('🔍 AdvancedTrailDrawPointService 다시 활성화 완료');
      }
    }
  };

  const saveDrawnLine = async (lineType: string) => {
    try {
      console.log('saveDrawnLine 호출됨, lineType:', lineType);
      
      if (!state.mapRef.current) {
        console.error('mapRef가 null입니다.');
        return;
      }

      // 그린 feature가 있는지 확인
      if (!state.drawnFeatureRef.current) {
        console.error('그린 feature를 찾을 수 없습니다.');
        alert('그린 Line을 찾을 수 없습니다. 다시 그려주세요.');
        return;
      }

      const { insertFeatureViaWFS } = await import('~/assets/OpenLayer/services/getFeatures');
      
      // 좌표 변환 - Line은 기존 방식 유지 (변환 없이 그대로 사용)
      const transform = (coord: number[]) => coord; // 변환 없이 그대로 사용
      
      // 그린 feature에서 좌표 추출
      const geometry = state.drawnFeatureRef.current.getGeometry();
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
        const layers = state.mapRef.current?.getLayers().getArray() || [];
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
        
        // 편집 모드 하이라이트 제거
        const allLayers = state.mapRef.current?.getLayers().getArray() || [];
        allLayers.forEach(layer => {
          if (layer.get('isEditLayer') && layer instanceof VectorLayer) {
            const source = layer.getSource();
            if (source) {
              const features = source.getFeatures();
              features.forEach((feature: any) => {
                feature.setStyle(null); // 하이라이트 스타일 제거
              });
            }
          }
        });
        
        // 그린 라인 완전 정리 (기존 방식)
        if (state.drawLayerRef.current) {
          const source = state.drawLayerRef.current.getSource();
          if (source) {
            source.clear(); // 그린 feature들 제거
          }
        }
        
        // 새로운 서비스의 그린 라인 제거
        const lineLayers = state.mapRef.current?.getLayers().getArray() || [];
        lineLayers.forEach(layer => {
          if (layer instanceof VectorLayer && layer.getSource()) {
            const source = layer.getSource();
            const features = source.getFeatures();
            features.forEach((feature: any) => {
              // LineString geometry를 가진 feature 제거 (그린 라인들)
              const geometry = feature.getGeometry();
              if (geometry && geometry.getType() === 'LineString') {
                source.removeFeature(feature);
              }
            });
          }
        });
        
        // Draw interaction 정리
        if (state.drawInteractionRef.current && state.mapRef.current) {
          state.mapRef.current.removeInteraction(state.drawInteractionRef.current);
          state.drawInteractionRef.current = null;
        }
        
        // 지도 렌더링
        state.mapRef.current?.render();
        
        // 전역 정리 함수 호출
        const { TrailDrawLineCleanup } = await import('~/assets/Drawing');
        TrailDrawLineCleanup.cleanupAll();
        
        // 잠시 대기 후 모드 재설정 (정리 완료 보장)
        setTimeout(async () => {
          // 현재 모드 확인
          const currentMode = useMapbase.getState().drawMode?.mode;
          
          // Advanced Trail Draw Line 모드가 아닐 때만 trail-draw로 설정
          if (currentMode !== 'advanced-trail-draw') {
            // Trail Draw Line 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'LineString' });
            
            // 새로운 서비스 강제 활성화
            const { activateTrailDrawLineMode } = await import('~/assets/Drawing');
            activateTrailDrawLineMode({
              showLineTypeSelectorPopup: showLineTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                state.drawnFeatureRef.current = feature;
              }
            });
          } else {
            // Advanced Trail Draw Line 모드 유지
            console.log('Advanced Trail Draw Line 모드 유지');
          }
        }, 100);
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('라인 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      // 그린 라인 완전 정리
      if (state.drawLayerRef.current) {
        const source = state.drawLayerRef.current.getSource();
        if (source) {
          source.clear(); // 그린 feature들 제거
        }
      }
      
      // Draw interaction 정리
      if (state.drawInteractionRef.current && state.mapRef.current) {
        state.mapRef.current.removeInteraction(state.drawInteractionRef.current);
        state.drawInteractionRef.current = null;
      }
      
      // 상태 초기화
      state.setShowLineTypeSelector(false);
      state.setSelectedLineType('');
      state.drawnFeatureRef.current = null; // 그린 feature 참조 초기화
      
      // 전역 정리 함수 호출
      const { TrailDrawLineCleanup } = await import('~/assets/Drawing');
      TrailDrawLineCleanup.cleanupAll();
      
      // 현재 모드 확인
      const currentMode = useMapbase.getState().drawMode?.mode;
      
      // Advanced Trail Draw Line 모드가 아닐 때만 trail-draw로 설정
      if (currentMode !== 'advanced-trail-draw') {
        // Trail Draw Line 모드 다시 활성화
        useMapbase.getState().setMode('trail-draw', { geoType: 'LineString' });
      } else {
        // Advanced Trail Draw Line 모드 유지
        console.log('Advanced Trail Draw Line 모드 유지');
      }
    }
  };

  const saveDrawnPolygon = async (polygonType: string) => {
    try {
      console.log('saveDrawnPolygon 호출됨');
      
      if (!state.mapRef.current) {
        console.error('mapRef가 null입니다.');
        return;
      }

      // 그린 feature가 있는지 확인
      if (!state.drawnFeatureRef.current) {
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
      const geometry = state.drawnFeatureRef.current.getGeometry();
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
        
        // WMS 레이어 새로고침
        const layers = state.mapRef.current?.getLayers().getArray() || [];
        
        // 디버깅: 현재 레이어 상태 확인
        console.log('=== 현재 지도의 모든 레이어 ===');
        layers.forEach((layer, index) => {
          console.log(`${index}:`, {
            layerName: layer.get('layerName'),
            type: layer.constructor.name,
            visible: layer.getVisible(),
            opacity: layer.getOpacity(),
            zIndex: layer.getZIndex(),
            minZoom: layer.get('minZoom'),
            maxZoom: layer.get('maxZoom')
          });
        });
        
        // polygonHump 레이어 찾기
        const polygonHumpLayer = layers.find(layer => 
          layer.get('layerName') === 'polygonHump'
        );
        
        if (polygonHumpLayer) {
          console.log('polygonHump 레이어 발견:', {
            visible: polygonHumpLayer.getVisible(),
            opacity: polygonHumpLayer.getOpacity(),
            minZoom: polygonHumpLayer.get('minZoom'),
            maxZoom: polygonHumpLayer.get('maxZoom'),
            currentZoom: state.mapRef.current?.getView().getZoom()
          });
        } else {
          console.log('❌ polygonHump 레이어를 찾을 수 없습니다!');
        }
        
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
              source.refresh();
            }
          } else if (layer.get('layerName') === 'polygonHump' && 'getSource' in layer) {
            // Vector Tile 레이어인 경우 타일 캐시 무효화 및 강제 새로고침
            console.log('Vector Tile 레이어 새로고침: polygonHump');
            const source = (layer as any).getSource();
            if (source && source.clear) {
              source.clear(); // 타일 캐시 무효화
              source.refresh(); // 타일을 강제로 다시 로드
            }
          }
        });
        
        // 편집 모드 하이라이트 제거
        const allLayers = state.mapRef.current?.getLayers().getArray() || [];
        allLayers.forEach(layer => {
          if (layer.get('isEditLayer') && layer instanceof VectorLayer) {
            const source = layer.getSource();
            if (source) {
              const features = source.getFeatures();
              features.forEach((feature: any) => {
                feature.setStyle(null); // 하이라이트 스타일 제거
              });
            }
          }
        });
        
        // 새로운 서비스의 그린 폴리곤 제거
        const polygonLayers = state.mapRef.current?.getLayers().getArray() || [];
        polygonLayers.forEach(layer => {
          if (layer instanceof VectorLayer && layer.getSource()) {
            const source = layer.getSource();
            const features = source.getFeatures();
            features.forEach((feature: any) => {
              // Polygon geometry를 가진 feature 제거 (그린 폴리곤들)
              const geometry = feature.getGeometry();
              if (geometry && geometry.getType() === 'Polygon') {
                source.removeFeature(feature);
              }
            });
          }
        });
        
        // 지도 렌더링
        state.mapRef.current?.render();
        
        // 전역 정리 함수 호출
        const { TrailDrawPolygonCleanup } = await import('~/assets/Drawing');
        TrailDrawPolygonCleanup.cleanupAll();
        
        // 잠시 대기 후 모드 재설정 (정리 완료 보장)
        setTimeout(async () => {
          // 현재 모드 확인
          const currentMode = useMapbase.getState().drawMode?.mode;
          
          // Advanced Trail Draw Polygon 모드가 아닐 때만 trail-draw로 설정
          if (currentMode !== 'advanced-trail-draw-polygon') {
            // Trail Draw Polygon 모드 다시 활성화
            useMapbase.getState().setMode('trail-draw', { geoType: 'Polygon' });
            
            // 새로운 서비스 강제 활성화
            const { activateTrailDrawPolygonMode } = await import('~/assets/Drawing');
            activateTrailDrawPolygonMode({
              showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
              setDrawnFeature: (feature: any) => {
                state.drawnFeatureRef.current = feature;
              }
            });
          } else {
            // Advanced Trail Draw Polygon 모드 유지
            console.log('Advanced Trail Draw Polygon 모드 유지');
          }
        }, 100);
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      console.error('폴리곤 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      state.setShowPolygonTypeSelector(false);
      state.setSelectedPolygonType('');
      
      // 그린 feature 정리
      if (state.drawLayerRef.current) {
        const source = state.drawLayerRef.current.getSource();
        source.clear(); // 그린 feature들 제거
      }
      state.drawnFeatureRef.current = null; // 그린 feature 참조 초기화
      
      // 전역 정리 함수 호출 (Advanced Trail Draw Polygon은 제외)
      const { TrailDrawPolygonCleanup } = await import('~/assets/Drawing');
      TrailDrawPolygonCleanup.cleanupAll();
    }
  };

  // 노드 타입 선택 처리
  const handleNodeTypeSelect = (nodeType: string) => {
    console.log('=== handleNodeTypeSelect 호출됨 ===');
    console.log('선택된 노드 타입:', nodeType);
    state.setSelectedNodeType(nodeType);
    console.log('selectedNodeType 설정 완료');
  };
  
  // 라인 타입 선택 처리
  const handleLineTypeSelect = (lineType: string) => {
    state.setSelectedLineType(lineType);
  };
  
  // 저장 버튼 클릭 처리
  const handleSaveClick = () => {
    console.log('=== handleSaveClick 호출됨 ===');
    console.log('현재 selectedNodeType:', state.selectedNodeType);
    console.log('현재 drawnPointCoordinate:', state.drawnPointCoordinate);
    
    if (state.selectedNodeType) {
      console.log('노드 타입이 선택됨, 확인 다이얼로그 표시');
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        console.log('사용자가 저장을 확인함, saveDrawnPoint 호출');
        saveDrawnPoint(state.selectedNodeType);
      } else {
        console.log('사용자가 저장을 취소함');
      }
    } else {
      console.log('노드 타입이 선택되지 않음');
    }
  };

  // 라인 저장 버튼 클릭 처리
  const handleLineSaveClick = () => {
    if (state.selectedLineType) {
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        saveDrawnLine(state.selectedLineType);
      }
    }
  };

  // 레이어 컨트롤 함수들 - 제거
  // const initializeLayerStates = () => {};
  // const toggleLayerVisibility = () => {};
  // const toggleAllLayers = () => {};

  // 폴리곤 타입 선택 처리
  const handlePolygonTypeSelect = (polygonType: string) => {
    state.setSelectedPolygonType(polygonType);
  };

  // 폴리곤 저장 버튼 클릭 처리
  const handlePolygonSaveClick = () => {
    if (state.selectedPolygonType) {
      const shouldSave = confirm('저장하시겠습니까?');
      if (shouldSave) {
        saveDrawnPolygon(state.selectedPolygonType);
      }
    }
  };
  
  // 편집 모드 상태에 따른 마우스 이벤트 관리
  useEffect(() => {
    if (!state.mapRef.current) return;
    
    if (state.isEditModeActive) {
      // 편집 모드가 활성화되면 마우스 이벤트 활성화
      console.log('Edit mode activated, mouse events enabled');
      
      // 전역 마우스 이벤트 핸들러 등록 (디바운싱 적용)
      const globalMouseHandler = (event: any) => {
        // 디바운싱: 이전 타임아웃이 있으면 취소
        if (state.mouseEventTimeoutRef.current) {
          clearTimeout(state.mouseEventTimeoutRef.current);
        }
        
        // 50ms 후에 실행 (더 빠른 반응)
        state.mouseEventTimeoutRef.current = window.setTimeout(() => {
          const pixel = event.pixel;
          const coordinate = state.mapRef.current?.getCoordinateFromPixel(pixel);
          
          if (coordinate) {
            // 모든 편집용 레이어 확인
            const allLayers = state.mapRef.current?.getLayers().getArray() || [];
            let isOverEditLayer = false;
            
            for (const layer of allLayers) {
              if (layer.get('isEditLayer') && layer instanceof VectorLayer) {
                const source = layer.getSource();
                if (source) {
                  const features = source.getFeatures();
                  
                  for (const feature of features) {
                    const geometry = feature.getGeometry();
                    if (geometry) {
                      // 간단한 extent 기반 충돌 검사 (더 안정적)
                      try {
                        const extent = geometry.getExtent();
                        const buffer = 50; // 50미터 버퍼
                        const intersects = coordinate[0] >= (extent[0] - buffer) && 
                                          coordinate[0] <= (extent[2] + buffer) &&
                                          coordinate[1] >= (extent[1] - buffer) && 
                                          coordinate[1] <= (extent[3] + buffer);
                        
                        if (intersects) {
                          isOverEditLayer = true;
                          console.log('Found intersection with edit layer using extent check');
                          break;
                        }
                      } catch (e) {
                        console.log('Extent check error:', e);
                      }
                    }
                  }
                }
              }
              if (isOverEditLayer) break;
            }
            
            console.log('Mouse over edit layer:', isOverEditLayer);
            
            if (isOverEditLayer) {
              state.setShowEditModeButton(true);
              // 버튼 위치는 레이어의 중심점으로 고정 (마우스 따라다니지 않음)
              const allLayers = state.mapRef.current?.getLayers().getArray() || [];
              for (const layer of allLayers) {
                if (layer.get('isEditLayer') && layer instanceof VectorLayer) {
                  const source = layer.getSource();
                  if (source) {
                    const features = source.getFeatures();
                    if (features.length > 0) {
                      const feature = features[0];
                      const geometry = feature.getGeometry();
                      if (geometry) {
                        const extent = geometry.getExtent();
                        const centerX = (extent[0] + extent[2]) / 2;
                        const centerY = (extent[1] + extent[3]) / 2;
                        const centerPixel = state.mapRef.current?.getPixelFromCoordinate([centerX, centerY]);
                        if (centerPixel) {
                          state.setEditModePosition({ x: centerPixel[0] + 10, y: centerPixel[1] - 15 });
                        }
                      }
                    }
                  }
                  break;
                }
              }
            } else {
              state.setShowEditModeButton(false);
            }
          }
        }, 100);
      };
      
      // 기존 핸들러 제거
      if (state.mouseEventHandlerRef.current) {
        state.mapRef.current.un('pointermove', state.mouseEventHandlerRef.current);
      }
      
      state.mouseEventHandlerRef.current = globalMouseHandler;
      state.mapRef.current.on('pointermove', globalMouseHandler);
      
    } else {
      // 편집 모드가 비활성화되면 마우스 이벤트 비활성화
      if (state.mouseEventHandlerRef.current) {
        state.mapRef.current.un('pointermove', state.mouseEventHandlerRef.current);
        state.mouseEventHandlerRef.current = null;
      }
      state.setShowEditModeButton(false);
      console.log('Edit mode deactivated, mouse events disabled');
    }
  }, [state.isEditModeActive]);
  
  // Trail Draw Point/Line 모드 감지 및 저장 처리
  useEffect(() => {
    let clickHandler: any = null;
    let doubleClickHandler: any = null;
    
    const checkTrailDrawMode = async () => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      const geoType = useMapbase.getState().drawMode?.options?.geoType;
      
      // 디버깅을 위한 로그 추가
      if (currentMode === 'trail-draw') {
        console.log('Trail Draw 모드 감지:', { currentMode, geoType });
      }
      
 else if (currentMode === 'trail-draw' && geoType === 'LineString' && !state.drawInteractionRef.current) {

      
      } else if (currentMode !== 'trail-draw') {
        // 모드가 변경되면 이벤트 리스너 제거
        if (state.mapRef.current && clickHandler) {
          state.mapRef.current.un('click', clickHandler);
          clickHandler = null;
        }
        if (state.mapRef.current && doubleClickHandler) {
          state.mapRef.current.un('dblclick', doubleClickHandler);
          doubleClickHandler = null;
        }
      }
    };
    
    const interval = setInterval(checkTrailDrawMode, 500);
    return () => {
      clearInterval(interval);
      if (state.mapRef.current && clickHandler) {
        state.mapRef.current.un('click', clickHandler);
      }
      if (state.mapRef.current && doubleClickHandler) {
        state.mapRef.current.un('dblclick', doubleClickHandler);
      }
    };
  }, []);
  
  // 편집 모드 종료 시 모든 편집용 레이어와 인터랙션 제거하는 함수
  const cleanupEditMode = () => {
    if (!state.mapRef.current) return;
    
    // 마우스 이벤트 핸들러 제거
    if (state.mouseEventHandlerRef.current) {
      state.mapRef.current.un('pointermove', state.mouseEventHandlerRef.current);
      state.mouseEventHandlerRef.current = null;
    }
    
    // 타임아웃 정리
    if (state.mouseEventTimeoutRef.current) {
      clearTimeout(state.mouseEventTimeoutRef.current);
      state.mouseEventTimeoutRef.current = null;
    }
    
    // 모든 편집용 레이어 제거
    const allLayers = state.mapRef.current.getLayers().getArray();
    allLayers.forEach(layer => {
      if (layer.get('isEditLayer')) {
        state.mapRef.current?.removeLayer(layer);
      }
    });
    
    // 모든 편집 인터랙션 제거
    const allInteractions = state.mapRef.current.getInteractions().getArray();
    allInteractions.forEach(interaction => {
      if (interaction instanceof Translate || interaction instanceof Modify || interaction instanceof Snap) {
        state.mapRef.current?.removeInteraction(interaction);
      }
    });
    
    // 편집 모드 상태 초기화
    state.editModeRef.current = { mode: '', featureId: null };
    state.setIsEditModeActive(false);
    state.setShowEditModeButton(false);
    
    // useMapbase의 drawMode도 초기화
    useMapbase.getState().setMode('select');
    
    // 지도 렌더링
    state.mapRef.current.render();
  };
  // 코드 블록 관련 상태들은 useMainPageState에서 관리


  // 코드 블록 관련 상태들은 useMainPageState에서 관리
  // ... 이후 코드 ...

  const handleSelectableFacility = async () => {
    try {
      const layerId = 'polygonHump';
      let result = '=== 레이어 선택 가능 여부 ===\n\n';
      const layer = await useMapbase.getState().getLayerById(layerId);
      if (layer && typeof layer.isSelectable === 'function') {
        const isSelectable = layer.isSelectable();
        result += layerId + ': ' + (isSelectable ? '✅ 선택 가능' : '❌ 선택 불가') + '\n';
      } else {
        result += layerId + ': ❓ 레이어를 찾을 수 없음\n';
      }
      state.setSelectableFacilityResult(result);
      state.setIsRunningSelectable(true);
    } catch (error) {
      state.setSelectableFacilityResult(`실행 오류: ${error}`);
      state.setIsRunningSelectable(true);
    }
  };

  // === GuidePageOrigin.tsx와 동일한 레이어 데이터 동기화 ===
  useEffect(() => {
    if (layerData) {
      useMapbase.getState().setLayerData(layerData);
      // console.log('[MainPage] useMapbase.setLayerData called');
    }
  }, [layerData]);

  // === GuidePageOrigin.tsx와 동일한 벡터타일 레이어 useEffect ===
  useEffect(() => {
    const mapStore = useMapbase.getState();
    const { layerData: layerDataStore } = mapStore;
    if (state.mapRef.current && layerDataStore) {
      const handleZoomChange = () => {
        if (!state.mapRef.current) return;
        const zoom = Math.floor(state.mapRef.current.getView()?.getZoom() ?? 0);
        state.setZoomDisplay(zoom);
        const isZoomForMVT = zoom >= 13;
        if (isZoomForMVT) {
          state.vectorTileLayers.current.forEach(layer => state.mapRef.current?.removeLayer(layer));
          state.vectorTileLayers.current = layerDataStore.map(layer => {
            const vectorLayer = createVectorLayer(layer, mapStore.defaultStyles);
            state.mapRef.current?.addLayer(vectorLayer);
            // 벡터타일 레이어의 source URL 템플릿 로그
            const src = vectorLayer.getSource();
            const vtUrl = src && src.getUrls ? src.getUrls() : undefined;
            return vectorLayer;
          });
        }
      };
      state.mapRef.current.getView().on('change:resolution', handleZoomChange);
      setTimeout(() => {
        handleZoomChange();
      }, 0);
      return () => {
        if (state.mapRef.current) state.mapRef.current.getView().un('change:resolution', handleZoomChange);
      };
    }
  }, [useMapbase.getState().layerData, useMapbase.getState().defaultStyles, state.themeCustom]);

  // === GuidePageOrigin.tsx와 동일한 WMS 이미지 레이어 useEffect ===
  useEffect(() => {
    if (state.mapRef.current && layerData && dataStyles) {
      const zoom = Math.floor(state.mapRef.current?.getView().getZoom() ?? 0);
      const layersFilter = layerData
        .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
        .filter(item => item.visible);
      const layerNames = layersFilter.map(item => item.value);
      const styleNames = layerNames.map(layerName => {
        const found = layerData.find(item => item.value === layerName);
        return found && found.styleName ? found.styleName : '';
      });
      if (state.tileWmsLayer.current) {
        state.tileWmsLayer.current?.getSource()?.updateParams({ LAYERS: layerNames, STYLES: styleNames });
        state.tileWmsLayer.current.setVisible(true);
        state.tileWmsLayer.current?.getSource()?.refresh();
      } else {
        const newTileWmsLayer = createImageLayer(layerNames.join(','), styleNames.join(','));
        state.mapRef?.current?.addLayer(newTileWmsLayer);
        state.tileWmsLayer.current = newTileWmsLayer;
      }
    }
  }, [state.mapRef.current, layerData, dataStyles]);

  useEffect(() => {
    if (state.asideRef.current) {
      const rect = state.asideRef.current.getBoundingClientRect();
      state.setMenuCenter(rect.height / 2);
    }
  }, [state.showMenu]);

  // 개별 상태 모니터링 useEffect 제거 (중복 렌더링 문제 해결)

  // 지도 중심 좌표 alert 기능 - 새로운 Navigation 패키지 사용
  const handleGetCenter = () => {
    const result = mapInfo.getCenter();
    if (result.success && result.data) {
      alert(`화면 중심점: ${result.data.lat.toFixed(6)}, ${result.data.lng.toFixed(6)}`);
    } else {
      alert(result.message);
    }
  };

  // 현재 줌 레벨 alert 기능 - 새로운 Navigation 패키지 사용
  const handleGetZoom = () => {
    const result = mapInfo.getZoom();
    if (result.success && result.data) {
      alert(`현재 줌 레벨: ${result.data.current} (최소: ${result.data.min}, 최대: ${result.data.max})`);
    } else {
      alert(result.message);
    }
  };

  // 최소 줌 레벨 alert 기능 - 새로운 Navigation 패키지 사용
  const handleGetMinZoom = () => {
    const result = mapInfo.getMinZoom();
    if (result.success) {
      alert(`최소 줌 레벨: ${result.data}`);
    } else {
      alert(result.message);
    }
  };

  // 최대 줌 레벨 alert 기능 - 새로운 Navigation 패키지 사용
  const handleGetMaxZoom = () => {
    const result = mapInfo.getMaxZoom();
    if (result.success) {
      alert(`최대 줌 레벨: ${result.data}`);
    } else {
      alert(result.message);
    }
  };

  // 지도 중심 이동 기능 - 새로운 Navigation 패키지 사용
  const handleMoveCenter = () => {
    const result = mapPan.panTo({ center: [127.0, 37.5], zoom: 10, duration: 800 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 중심 이동 + 줌 변경 기능 - 새로운 Navigation 패키지 사용
  const handleMoveCenterZoom = () => {
    const result = mapPan.panTo({ center: [127.0, 37.5], zoom: 15, duration: 800 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 영역 이동(범위 fit) 기능 - 새로운 Navigation 패키지 사용
  const handleMoveArea = () => {
    const result = mapPan.fitBounds({ 
      extent: [126.5, 37.0, 127.5, 38.0], 
      duration: 800, 
      padding: [50, 50, 50, 50] 
    });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 이전 화면(이전 extent) 이동 기능 - 새로운 Navigation 패키지 사용
  const handlePrevScreen = (animationDuration = 800) => {
    console.log('🔄 handlePrevScreen 호출됨 (애니메이션: ' + animationDuration + 'ms)');
    const result = mapHistory.prevScreen();
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 다음 화면(다음 extent) 이동 기능 - 새로운 Navigation 패키지 사용
  const handleForwardScreen = (animationDuration = 800) => {
    console.log('🔄 handleForwardScreen 호출됨 (애니메이션: ' + animationDuration + 'ms)');
    const result = mapHistory.forwardScreen();
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 줌 인 기능 - 새로운 Navigation 패키지 사용
  const handleZoomIn = () => {
    const result = mapPan.setZoom({ zoom: 15, duration: 250 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 줌 아웃 기능 - 새로운 Navigation 패키지 사용
  const handleZoomOut = () => {
    const result = mapPan.setZoom({ zoom: 10, duration: 250 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 스케일(해상도) 조정 기능 - 새로운 Navigation 패키지 사용
  const handleAdjustScale = () => {
    const result = mapScale.adjustScale({ resolution: 10, duration: 800 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 상태 초기화 핸들러 - 새로운 Navigation 패키지 사용
  const handleResetView = () => {
    const result = mapPan.resetView({ center: [127.0, 37.5], zoom: 10, duration: 800 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 클립보드 복사 핸들러 - 새로운 Navigation 패키지 사용
  const handleCopyView = () => {
    const result = mapExport.copyView();
    if (result.success) {
      alert('뷰 정보가 클립보드에 복사되었습니다.');
    } else {
      alert(result.message);
    }
  };

  // 지도 회전 핸들러 - 새로운 Navigation 패키지 사용
  const handleRotateMap = () => {
    const result = mapPan.rotate({ angle: Math.PI / 4, duration: 500 });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 지도 이미지 저장 핸들러 - 새로운 Navigation 패키지 사용
  const handleExportMapImage = () => {
    const result = mapExport.exportMapImage({ filename: 'map', format: 'png', quality: 0.9 });
    if (result.success) {
      alert('지도 이미지가 다운로드되었습니다.');
    } else {
      alert(result.message);
    }
  };

  // 코드 에디터 닫기 핸들러
  const handleCloseCodeBlock = () => {
    state.setIsCodeBlockActive(false);
    setTimeout(() => {
      state.setIsCodeBlockVisible(false);
      state.setCodeBlockType(null);
    }, 500);
  };



  // panBy(픽셀 단위 이동) 기능 - 새로운 Navigation 패키지 사용
  const handlePanBy = (offsetX: number, offsetY: number, duration = 0) => {
    const result = mapPan.panBy({ offsetX, offsetY, duration });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // panTo(애니메이션 중심+줌 이동) 기능 - 새로운 Navigation 패키지 사용
  const handlePanTo = (center?: number[], zoom?: number, duration = 800) => {
    const result = mapPan.panTo({ center, zoom, duration });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // fitBounds(범용 영역 맞춤) 기능 - 새로운 Navigation 패키지 사용
  const handleFitBounds = (extent?: number[], duration = 800, padding = [50, 50, 50, 50], maxZoom?: number) => {
    const result = mapPan.fitBounds({ 
      extent: extent || [126.5, 37.0, 127.5, 38.0], 
      duration, 
      padding, 
      maxZoom 
    });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // getBounds(현재 화면 extent 반환) 기능 - 새로운 Navigation 패키지 사용
  const handleGetBounds = () => {
    const result = mapInfo.getBounds();
    if (result.success && result.data) {
      alert(`현재 화면 extent: ${result.data.extent.join(', ')}`);
    } else {
      alert(result.message);
    }
  };

  // setZoom(애니메이션) 기능 - 새로운 Navigation 패키지 사용
  const handleSetZoom = (zoom: number, duration = 800) => {
    const result = mapPan.setZoom({ zoom, duration });
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  // 2. LayerManagement 핸들러들 - 새로운 라이브러리 사용
  const handleGetLayer = () => {
    if (state.tileWmsLayer.current) {
      const info = {
        id: state.tileWmsLayer.current.get('id'),
        layerName: state.tileWmsLayer.current.get('layerName'),
        visible: state.tileWmsLayer.current.getVisible(),
        sourceParams: state.tileWmsLayer.current.getSource()?.getParams(),
      };
      console.log('레이어 기본 정보:', info);
      alert(`[Get Layer] 레이어 기본 정보:\nID: ${info.id}\n레이어명: ${info.layerName}\n표시여부: ${info.visible ? '보임' : '숨김'}\n소스 파라미터: ${JSON.stringify(info.sourceParams, null, 2)}`);
    } else {
      alert('레이어를 찾을 수 없습니다.');
    }
  };
  const handleGetExternalLayerName = () => {
    handleRunGetExternalLayerNameCode();
  };
  const handleGetTableNameOfLayer = () => {
    handleRunGetTableNameOfLayerCode();
  };
  const handleGetMinDisplayZoomLevel = () => {
    handleRunGetMinDisplayZoomLevelCode();
  };
  const handleGetMaxDisplayZoomLevel = () => {
    handleRunGetMaxDisplayZoomLevelCode();
  };
  const handleGetSelectableStatus = () => {
    handleRunSelectableFacilityCode();
  };
  const handleGetViewLayerInfo = () => {
    if (state.tileWmsLayer.current) {
      const layerInfo = {
        id: state.tileWmsLayer.current.get('id'),
        name: state.tileWmsLayer.current.get('name'),
        type: state.tileWmsLayer.current.get('type'),
        visible: state.tileWmsLayer.current.getVisible(),
        opacity: state.tileWmsLayer.current.getOpacity(),
        zIndex: state.tileWmsLayer.current.getZIndex(),
        properties: state.tileWmsLayer.current.getProperties(),
        minZoom: state.tileWmsLayer.current.get('minZoom'),
        maxZoom: state.tileWmsLayer.current.get('maxZoom'),
        layerName: state.tileWmsLayer.current.get('layerName'),
        selectable: state.tileWmsLayer.current.get('selectable'),
        externalLayerName: state.tileWmsLayer.current.get('externalLayerName'),
        tableName: state.tileWmsLayer.current.get('tableName')
      };
      console.log('레이어 상세 정보:', layerInfo);
      alert(`[View Layer Information] 레이어 상세 정보:\nID: ${layerInfo.id}\n이름: ${layerInfo.name}\n타입: ${layerInfo.type}\n표시여부: ${layerInfo.visible ? '보임' : '숨김'}\n투명도: ${layerInfo.opacity}\nZ-Index: ${layerInfo.zIndex}\n레이어명: ${layerInfo.layerName}\n선택가능: ${layerInfo.selectable ? '가능' : '불가능'}\n외부레이어명: ${layerInfo.externalLayerName}\n테이블명: ${layerInfo.tableName}`);
    } else {
      alert('레이어를 찾을 수 없습니다.');
    }
  };
  const handleToggleDisplayHide = () => {
    handleRunToggleDisplayHideCode();
  };
  const handleRefreshLayer = () => {
    handleRunRefreshLayerCode();
  };
  
  // 레이어 투명도 관련 핸들러들




  // === OSM base map 생성 useEffect 복구 ===
  useEffect(() => {
    if (!state.mapRef.current && state.mapContainerRef.current) {
      // EPSG:5179 중심좌표 (centerPointOL)로 변환
      const center5179 = transform([127.062289345605, 37.5087805938127], 'EPSG:4326', 'EPSG:5179');
      const map = new Map({
        target: state.mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          projection: getProjection('EPSG:5179') ?? 'EPSG:5179',
          center: center5179,
          zoom: 13, // /guide_origin과 동일하게 13으로 설정
        }),

      });
      
      // 더블클릭 줌인 비활성화
      const interactions = map.getInteractions();
      const doubleClickZoom = interactions.getArray().find(interaction => 
        interaction.constructor.name === 'DoubleClickZoom'
      );
      if (doubleClickZoom) {
        interactions.remove(doubleClickZoom);
      }
      
      state.mapRef.current = map;
      useMapbase.getState().setMap(map);
      
      // === MapHistory 자동 저장 설정 ===
      const { onMoveEnd } = useMapHistoryStore.getState();
      map.on('moveend', onMoveEnd);
      onMoveEnd(); // 초기 상태를 히스토리에 추가
      
      // === 레이어 상태 초기화 ===
      setTimeout(() => {
        // initializeLayerStates();
      }, 2000); // 레이어 로드 완료 후 초기화
    }
    return () => {
      if (state.mapRef.current) {
        state.mapRef.current.un('moveend', useMapHistoryStore.getState().onMoveEnd);
        state.mapRef.current.setTarget(undefined);
      }
    };
  }, []);

  // === Selectable Facility 메뉴 클릭 핸들러 ===
  const handleOpenSelectableFacilityEditor = () => {
    state.setIsSelectableFacilityModalVisible(true);
  };






  // 실행 후 코드 에디터를 닫는 함수


  // 컨텍스트 메뉴 상태는 useMainPageState에서 관리
  // const contextMenu = useMapbase(state => state.contextMenu); // 중복 선언 제거

  // 컨텍스트 메뉴 이벤트 핸들러
  useEffect(() => {
    const mapDiv = state.mapContainerRef.current;
    if (!mapDiv) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      // 디버깅 로그 추가
      console.log('Right-click detected:', {
        contextMenuEnabled: state.contextMenuEnabled,
        contextMenuDataLength: contextMenuData?.length,
        contextMenuData: contextMenuData
      });
      
      // 컨텍스트 메뉴가 활성화된 경우에만 메뉴 표시
      if (state.contextMenuEnabled && contextMenuData && contextMenuData.length > 0) {
        show({ event: e });
      }
    };
    mapDiv.addEventListener('contextmenu', handleContextMenu);
    return () => {
      mapDiv.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [state.mapContainerRef, state.contextMenuEnabled, contextMenuData, show]);

  const handleMenuClick = (item: any) => {
    // 메뉴 클릭 시 코드 블록 열기 (실행하지 않음)
    openCodeBlock(item.type);
    state.setContextMenuPos(null);
  };



  // Selection 실행 함수들
  const handleRunRectSelectionCode = () => {
    try {
      activateRectSelectionMode(state.mapRef.current);
      alert('Rect Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');
    } catch (err) {
      alert('실행 오류: ' + err);
    }
  };

  const handleRunCircleSelectionCode = () => {
    try {
      activateCircleSelectionMode(state.mapRef.current);
      alert('Circle Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');
    } catch (err) {
      alert('실행 오류: ' + err);
    }
  };

  const handleRunPolygonSelectionCode = () => {
    try {
      activatePolygonSelectionMode(state.mapRef.current);
      alert('Polygon Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\n더블클릭으로 그리기를 완료하세요.');
    } catch (err) {
      alert('실행 오류: ' + err);
    }
  };

  const handleRunTrailDeleteCode = () => {
    try {
      deleteSelectedFeature(state.mapRef.current);
      alert('선택된 피처가 삭제되었습니다.');
    } catch (err) {
      alert('실행 오류: ' + err);
    }
  };







  // 1. select 모드일 때 라이브러리 사용
  useEffect(() => {
    if (!state.mapRef.current) return;
    
    // 전역 변수 설정 (샘플 코드 실행용)
    (window as any).map = state.mapRef.current;
    (window as any).layerData = state.layerData;
    
    const handleModeChange = () => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      console.log('모드 변경 감지:', currentMode);
      
      // 기존 hooks 비활성화
      basicSelect.deactivate();
      advancedSelect.deactivate();
      
      // 새로운 모드에 따라 hooks 활성화
      if (currentMode === 'select') {
        basicSelect.activate();
        console.log('BasicSelect hook 활성화');
      } else if (currentMode === 'advanced-select') {
        advancedSelect.activate();
        console.log('AdvancedSelect hook 활성화');
      } else if (currentMode === 'advanced-trail-draw') {
        // Advanced Trail Draw Line 모드는 별도 처리 (다른 훅 비활성화)
        console.log('Advanced Trail Draw Line 모드 유지');
      } else {
        console.log('Hook 활성화 조건 불만족:', { currentMode });
      }
    };
    
    // 초기 모드 설정
    handleModeChange();
    
    // 모드 변경 감지를 위한 interval 설정 (로그 제거)
    const intervalId = setInterval(() => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      if (currentMode === 'select' || currentMode === 'advanced-select' || currentMode === 'advanced-trail-draw') {
        handleModeChange();
      }
    }, 1000); // 1초로 변경
    
    return () => {
      clearInterval(intervalId);
      // hooks 정리
      basicSelect.deactivate();
      advancedSelect.deactivate();
    };
  }, [state.mapRef.current]);

  // 기존 Select 로직 (라이브러리로 교체됨 - 주석 처리)
  /*
      const currentMode = useMapbase.getState().drawMode?.mode;
      if (currentMode !== 'select' && currentMode !== 'advanced-select') {
        setHoverFeature(null);
        return;
      }
      
      // Select 모드일 때는 마우스 오버 비활성화 (클릭만 가능)
      if (currentMode === 'select') {
        setHoverFeature(null);
        return;
      }
      


      // 이전 타임아웃이 있으면 취소
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }

      // 100ms 후에 실행 (디바운싱)
      mouseMoveTimeoutRef.current = window.setTimeout(async () => {
        // 실제 layerData 사용 (useGetLayerList에서 가져온 데이터)
        // 임시로 하드코딩된 layerData 사용 (API 호출 실패 시)
        const fallbackLayerData = [
          { name: 'nodeBusinessPlan', value: 'nodeBusinessPlan', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'nodeExcavationSite', value: 'nodeExcavationSite', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'nodeGreenBelt', value: 'nodeGreenBelt', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'nodePublicToilet', value: 'nodePublicToilet', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'nodeRoadsideTrees', value: 'nodeRoadsideTrees', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'linkDsWay', value: 'linkDsWay', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'linkSafeWayHome', value: 'linkSafeWayHome', visible: true, maxZoom: 20, minZoom: 0 },
          { name: 'polygonHump', value: 'polygonHump', visible: true, maxZoom: 20, minZoom: 0 }
        ];
        
        const currentLayerData = layerData || fallbackLayerData;
        
        // layerData가 비어있으면 처리하지 않음
        if (!currentLayerData || currentLayerData.length === 0) {
          setHoverFeature(null);
          return;
        }

        try {
          const coordinate = event.coordinate;
          const pixel = event.pixel;
          
          // WFS API를 사용하여 가장 가까운 피처 찾기
          if (!currentLayerData || currentLayerData.length === 0) {
            console.log('마우스 오버: layerData 없음');
            setHoverFeature(null);
            return;
          }
          
          console.log('마우스 오버: 피처 검색 시작', { coordinate, pixel });
          
          const features = await getListFeaturesInPixel(
            currentLayerData,
            state.zoom,
            coordinate,
            undefined,
            pixel
          );

          if (features && features.length > 0) {
            console.log('마우스 오버: 피처 발견', features[0]);
            setHoverFeature(features[0]);
          } else {
            console.log('마우스 오버: 피처 없음');
            setHoverFeature(null);
          }
        } catch (error) {
          console.error('마우스 오버 피처 찾기 오류:', error);
          setHoverFeature(null);
        }
      }, 100); // 100ms 디바운싱
    };

    const handleMapClick = async (event: any) => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      if (currentMode !== 'select' && currentMode !== 'advanced-select') return;
      if (!state.mapRef.current) return;
      
      // 마우스 오버와 동일한 방식으로 좌표 가져오기
      const coordinate = event.coordinate;
      const pixel = event.pixel;
      const zoom = state.zoom;
      
      // 좌표 유효성 검사
      if (!coordinate || !Array.isArray(coordinate) || coordinate.length < 2 ||
          typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number' ||
          isNaN(coordinate[0]) || isNaN(coordinate[1])) {
        console.warn('Invalid coordinate from map click:', coordinate);
        return;
      }
      
      if (typeof zoom !== 'number' || isNaN(zoom)) {
        console.warn('Invalid zoom level from map click:', zoom);
        return;
      }
      
      // 마우스 오버와 동일한 layerData 사용
      const fallbackLayerData = [
        { name: 'nodeBusinessPlan', value: 'nodeBusinessPlan', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'nodeExcavationSite', value: 'nodeExcavationSite', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'nodeGreenBelt', value: 'nodeGreenBelt', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'nodePublicToilet', value: 'nodePublicToilet', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'nodeRoadsideTrees', value: 'nodeRoadsideTrees', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'linkDsWay', value: 'linkDsWay', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'linkSafeWayHome', value: 'linkSafeWayHome', visible: true, maxZoom: 20, minZoom: 0 },
        { name: 'polygonHump', value: 'polygonHump', visible: true, maxZoom: 20, minZoom: 0 }
      ];
      
      const currentLayerData = layerData || fallbackLayerData;
      
      if (currentLayerData && currentLayerData.length > 0) {
        console.log('클릭: 피처 검색 시작', { coordinate, pixel, zoom });
        
        // 마우스 오버와 동일한 함수 사용
        const features = await getListFeaturesInPixel(
          currentLayerData,
          zoom,
          coordinate,
          undefined,
          pixel
        );
        
        if (features && features.length > 0) {
          console.log('클릭: 피처 발견', features[0]);
          
          // 가장 가까운 feature만 선택
          const validFeatures = features.filter(feature => 
            feature?.properties && 'geometry' in feature && typeof feature.geometry?.type === 'string'
          );
          
          if (validFeatures.length > 0) {
            // 첫 번째 feature만 선택 (가장 가까운 것)
            const selectedFeature = validFeatures[0];
            
            const featureData = {
              id: `${selectedFeature.id}`,
              geometry: {
                coordinates: selectedFeature.geometry.coordinates,
                type: selectedFeature.geometry.type as string,
              },
              properties: selectedFeature.properties,
            };
            
            useMapbase.getState().setSelectedFeatures([featureData]);
          }
        } else {
          console.log('클릭: 피처 없음');
          useMapbase.getState().setSelectedFeatures([]);
        }
      } else {
        console.log('클릭: layerData 없음');
        useMapbase.getState().setSelectedFeatures([]);
      }
    };
    state.mapRef.current.on && state.mapRef.current.on('click', handleMapClick);
    state.mapRef.current.on && state.mapRef.current.on('pointermove', handleMapMouseMove);
    return () => {
      state.mapRef.current && state.mapRef.current.un && state.mapRef.current.un('click', handleMapClick);
      state.mapRef.current && state.mapRef.current.un && state.mapRef.current.un('pointermove', handleMapMouseMove);
    };
  }, [state.mapRef.current]);
    */

  // highlightLayerRef는 useMainPageState에서 관리

  const selectedFeatures = useMapbase(state => state.selectedFeatures);

  // 눈에 띄는 하이라이트 스타일 (임시 오버라이드)
  const selectedFeatureStyle = new Style({
    image: new CircleStyle({
      radius: 16,
      fill: new Fill({ color: 'rgba(255, 255, 255, 0)' }), // 투명 (fill 없음)
      stroke: new Stroke({ color: '#ff0000', width: 4 }), // 빨간 테두리
    }),
    fill: new Fill({ color: 'rgba(255, 255, 255, 0)' }), // Polygon 등도 fill 없음
    stroke: new Stroke({ color: '#ff0000', width: 4 }),
  });

  // 마우스 오버 시 애플 스타일
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

  // 하이라이트 레이어 관리 (여러 개 선택 지원)
  useEffect(() => {
    console.log('🎯 하이라이트 useEffect 실행:', { selectedFeatures });
    
    if (!state.mapRef.current) {
      console.log('❌ 맵 참조 없음');
      return;
    }
    
    if (state.highlightLayerRef.current) {
      console.log('🗑️ 기존 하이라이트 레이어 제거');
      state.mapRef.current.removeLayer(state.highlightLayerRef.current);
      state.highlightLayerRef.current = null;
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
      console.log('✅ 하이라이트 레이어 생성:', olFeatures.length, '개 피처');
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features: olFeatures }),
        zIndex: 999,
      });
      state.mapRef.current.addLayer(vectorLayer);
      state.highlightLayerRef.current = vectorLayer;
      console.log('✅ 하이라이트 레이어 추가 완료');
    } else {
      console.log('❌ 하이라이트할 피처 없음');
    }
  }, [selectedFeatures, state.layerData]);

  // 마우스 오버 미리보기 레이어 관리
  const hoverFeature = useMapbase(state => state.hoverFeature);
  const hoverLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const mouseMoveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.mapRef.current) return;
    if (hoverLayerRef.current) {
      state.mapRef.current.removeLayer(hoverLayerRef.current);
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
      console.error('hover feature geometry 생성 오류:', e);
    }
    
    if (olFeature) {
      olFeature.setStyle(hoverFeatureStyle);
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features: [olFeature] }),
        zIndex: 998, // 선택된 피처보다 낮은 zIndex
      });
      state.mapRef.current.addLayer(vectorLayer);
      hoverLayerRef.current = vectorLayer;
    }
  }, [hoverFeature]);

  // Select 코드 에디터 박스 표시 상태는 useMainPageState에서 관리

  // Trail Distance 코드 에디터 박스 상태는 useMainPageState에서 관리







  





  // 2. codeBlockType 타입에 'trailArea' 추가


  


  // 4. Trail Area 실행 핸들러
  const { startDrawing: startTrailArea } = useTrailArea({
    map: useMapbase.getState().map,
    onEndDraw: () => {},
  });


  // Trail Distance 인터랙션 등록
  const { startDrawing: startTrailDistance } = useTrailDistance({
    onEndDraw: () => {
      // 필요시 콜백 작성
    },
  });

  // Area Draw 인터랙션 등록
  const { startDraw: startAreaDraw } = useAreaDraw({
    onEndDraw: () => {
      // 필요시 콜백 작성
    },
  });

  // Trail Draw 인터랙션 등록
  const { startDraw: startTrailDraw } = useTrailDraw({
    onEndDraw: () => {
      // 필요시 콜백 작성
    },
  });

  const { startDraw: startTrailDrawPoint } = useTrailDrawPoint({
    onEndDraw: () => {
      // 필요시 콜백 작성
    },
  });

  const { startDraw: startTrailDrawPolygon } = useTrailDrawPolygon({
    onEndDraw: () => {
      // 필요시 콜백 작성
    },
  });
  // trail-distance 모드가 활성화될 때 startDrawing 실행
  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'trail-distance') {
      startTrailDistance();
    }
  }, [useMapbase.getState().drawMode?.mode]);

  // trail-area 모드가 활성화될 때 startDrawing 실행
  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'trail-area') {
      startTrailArea();
    }
  }, [useMapbase.getState().drawMode?.mode]);

  // area-draw 모드가 활성화될 때 startDraw 실행
  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'area-draw') {
      const options = useMapbase.getState().drawMode?.options?.areaDrawOption;
      if (options) {
        startAreaDraw(options);
      }
    }
  }, [useMapbase.getState().drawMode?.mode]);

  // trail-draw 모드가 활성화될 때 startDraw 실행
  useEffect(() => {
    if (useMapbase.getState().drawMode?.mode === 'trail-draw') {
      const geoType = useMapbase.getState().drawMode?.options?.geoType;
      if (geoType === 'LineString') {
        startTrailDraw();
      } else if (geoType === 'Point') {
        startTrailDrawPoint();
      } else if (geoType === 'Polygon') {
        startTrailDrawPolygon();
      }
    }
  }, [useMapbase.getState().drawMode?.mode]);





















    // trail-edit 모드가 활성화되면 편집 인터랙션 실행
  useEffect(() => {
    // 주기적으로 상태 확인
    const checkEditMode = () => {
      const currentMode = useMapbase.getState().drawMode?.mode;
      const currentFeatureId = useMapbase.getState().drawMode?.options?.feature?.id;
      
      if (currentMode === 'trail-edit') {
        const selectedFeature = useMapbase.getState().drawMode?.options?.feature;
        const geoType = useMapbase.getState().drawMode?.options?.geoType;
        
        if (!selectedFeature || !state.mapRef.current) {
          return;
        }
        
        // 중복 실행 방지 - 더 엄격한 체크
        if (state.editModeRef.current.mode === 'trail-edit' && state.editModeRef.current.featureId === currentFeatureId) {
          return;
        }
        
        // 편집 모드 상태 업데이트
        state.editModeRef.current = { mode: currentMode || '', featureId: currentFeatureId || null };
        state.setIsEditModeActive(true);
        
        // 편집 중인 feature의 위치를 화면 좌표로 변환하여 버튼 위치 설정
        if (selectedFeature.geometry && selectedFeature.geometry.coordinates) {
          const coords = selectedFeature.geometry.coordinates;
          let centerCoords;
          
          if (selectedFeature.geometry.type === 'Point') {
            centerCoords = coords;
          } else if (selectedFeature.geometry.type === 'LineString' || selectedFeature.geometry.type === 'MultiLineString') {
            // LineString의 중간점 계산
            if (selectedFeature.geometry.type === 'LineString') {
              const midIndex = Math.floor(coords.length / 2);
              centerCoords = coords[midIndex];
            } else {
              // MultiLineString의 경우 첫 번째 라인의 중간점
              const firstLine = coords[0];
              const midIndex = Math.floor(firstLine.length / 2);
              centerCoords = firstLine[midIndex];
            }
          } else if (selectedFeature.geometry.type === 'Polygon') {
            // Polygon의 중심점 계산
            const ring = coords[0];
            const midIndex = Math.floor(ring.length / 2);
            centerCoords = ring[midIndex];
          }
          
          if (centerCoords && state.mapRef.current) {
            const pixel = state.mapRef.current.getPixelFromCoordinate(centerCoords);
            if (pixel) {
              state.setEditModePosition({ x: pixel[0] + 10, y: pixel[1] - 15 });
            }
          }
        }

        // 기존 편집 인터랙션과 레이어 정리
        const existingInteractions = state.mapRef.current.getInteractions().getArray();
        existingInteractions.forEach(interaction => {
          if (interaction instanceof Translate || interaction instanceof Modify || interaction instanceof Snap) {
            state.mapRef.current?.removeInteraction(interaction);
          }
        });

        // 기존 편집용 레이어 제거
        const existingLayers = state.mapRef.current.getLayers().getArray();
        existingLayers.forEach(layer => {
          if (layer.get('isEditLayer')) {
            state.mapRef.current?.removeLayer(layer);
          }
        });

        // 선택된 feature를 직접 사용하여 편집용 레이어 생성
        
        const originalGeometry = selectedFeature.geometry;
        if (!originalGeometry) {
          alert('선택된 객체의 geometry를 찾을 수 없습니다.');
          return;
        }
        
        // === geometry 변환 추가 ===
        console.log('Original geometry:', originalGeometry);
        console.log('Geometry type:', originalGeometry.type);
        console.log('Geometry coordinates:', originalGeometry.coordinates);
        
        const olGeometry = createOLGeometry(originalGeometry);
        if (!olGeometry) {
          console.error('Geometry 변환 실패 - originalGeometry:', originalGeometry);
          alert('geometry 변환 실패');
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
              stroke: new Stroke({ color: '#ffffff', width: 3 })
            })
          })
        });
        
        // 편집용 레이어 식별자 설정
        editLayer.set('isEditLayer', true);
        
        // 마우스 이벤트는 useEffect에서 전역적으로 관리됨
        console.log('Edit layer created, mouse events will be handled by useEffect');
        
        editSource.addFeature(editFeature);
        state.mapRef.current.addLayer(editLayer);

        // Point 객체인지 확인
        const isPoint = geoType === 'Point';
        
        if (isPoint) {
          // Point 객체는 Translate 인터랙션 적용
          const translate = new Translate({
            features: new Collection([editFeature])
          });
          
          // Snap 인터랙션 추가
          const snap = new Snap({
            source: editSource,
            pixelTolerance: 10
          });
          
          // Translate 완료 이벤트 처리
          translate.on('translateend', async (event) => {
            const movedFeature = event.features.getArray()[0];
            if (movedFeature) {
              const geometry = movedFeature.getGeometry();
              if (geometry) {
                const coordinates = (geometry as any).getCoordinates?.();
                
                // 원본 feature 업데이트 시도
                try {
                  // 모든 레이어에서 원본 feature 찾기
                  const layers = state.mapRef.current?.getLayers().getArray() || [];
                  let originalFeatureFound = false;
                  let originalFeature = null;
                  
                  for (const layer of layers) {
                    if (layer instanceof VectorLayer && !layer.get('isEditLayer')) {
                      const source = layer.getSource();
                      if (source) {
                        const features = source.getFeatures();
                        
                        for (const feature of features) {
                          const featureId = feature.getId();
                          const featureGeometry = feature.getGeometry();
                          
                          // 1. ID로 매칭
                          if (selectedFeature.id && featureId === selectedFeature.id) {
                            feature.setGeometry(geometry);
                            originalFeatureFound = true;
                            originalFeature = feature;
                            break;
                          }
                          
                          // 2. 좌표 기반 매칭 (더 정확한 비교)
                          if (featureGeometry && selectedFeature.geometry) {
                            const featureCoords = featureGeometry.getCoordinates();
                            const selectedCoords = selectedFeature.geometry.coordinates;
                            
                            if (JSON.stringify(featureCoords) === JSON.stringify(selectedCoords)) {
                              feature.setGeometry(geometry);
                              originalFeatureFound = true;
                              originalFeature = feature;
                              break;
                            }
                          }
                          
                          // 3. 속성 기반 매칭 (백업 방법)
                          if (selectedFeature.properties && feature.getProperties()) {
                            const selectedProps = selectedFeature.properties;
                            const featureProps = feature.getProperties();
                            
                            // 주요 속성들이 일치하는지 확인
                            const keyProps = ['name', 'id', 'fid', 'gid'];
                            let propsMatch = false;
                            
                            for (const key of keyProps) {
                              if (selectedProps[key] && featureProps[key] && 
                                  selectedProps[key] === featureProps[key]) {
                                propsMatch = true;
                                break;
                              }
                            }
                            
                            if (propsMatch) {
                              feature.setGeometry(geometry);
                              originalFeatureFound = true;
                              originalFeature = feature;
                              break;
                            }
                          }
                        }
                        
                        if (originalFeatureFound) break;
                      }
                    }
                  }
                  
                  if (originalFeatureFound && originalFeature) {
                    // WFS를 통해 서버에 저장
                    try {
                      const geometryType = geometry.getType();
                      
                      // 선택된 feature에서 정보 추출
                      const featureId = selectedFeature.id; // 선택된 feature의 ID 사용
                      const layerName = featureId ? featureId.split('.')[0] : 'unknown';
                      
                      const newGeometry = {
                        type: geometryType,
                        coordinates: coordinates
                      };
                      
                      console.log('=== MainPage updateFeatureViaWFS 호출 ===');
                      console.log('Layer Name:', layerName);
                      console.log('Feature ID:', featureId);
                      console.log('New Geometry:', newGeometry);
                      
                      const result = await updateFeatureViaWFS(layerName, featureId, newGeometry);
                      
                      console.log('=== MainPage updateFeatureViaWFS 결과 ===');
                      console.log('Result:', result);
                      console.log('Result Type:', typeof result);
                      
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
                        alert('Point 이동이 성공적으로 저장되었습니다.');
                        
                        // 1. 녹색 편집용 레이어 제거
                        state.mapRef.current?.removeLayer(editLayer);
                        
                        // 2. WMS 레이어 새로고침 강화 (이동된 위치에 feature 표시)
                        const layers = state.mapRef.current?.getLayers().getArray() || [];
                        layers.forEach(layer => {
                          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                            const source = layer.getSource();
                            if (source && source.refresh) {
                              console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                              source.refresh();
                            }
                          }
                        });
                        
                        // 3. 선택된 feature를 새로운 위치로 업데이트
                        const updatedFeature = {
                          ...selectedFeature,
                          geometry: newGeometry
                        };
                        useMapbase.getState().setSelectedFeatures([updatedFeature]);
                        
                        // 4. 지도 렌더링 강화
                        state.mapRef.current?.render();
                        
                        // 5. WMS 레이어가 완전히 새로고침될 때까지 대기
                        setTimeout(() => {
                          console.log('✅ WMS 레이어 새로고침 완료');
                          state.mapRef.current?.render();
                          
                          // 6. 편집 완료 후 선택 해제 (새로운 위치에서 재선택 가능하도록)
                          setTimeout(() => {
                            console.log('🔄 편집 완료 - 선택 해제');
                            useMapbase.getState().setSelectedFeatures([]);
                          }, 500);
                        }, 1000);
                        
                        // 5. 편집 모드 유지 - 새로운 위치에 편집용 레이어 재생성
                        setTimeout(() => {
                          // 기존 편집용 레이어 제거
                          const allLayers = state.mapRef.current?.getLayers().getArray() || [];
                          allLayers.forEach(layer => {
                            if (layer.get('isEditLayer')) {
                              state.mapRef.current?.removeLayer(layer);
                            }
                          });
                          
                          // 기존 인터랙션 제거
                          state.mapRef.current?.removeInteraction(translate);
                          state.mapRef.current?.removeInteraction(snap);
                          
                          // 새로운 위치에 편집용 레이어 생성
                          const newEditSource = new VectorSource();
                          const newEditLayer = new VectorLayer({
                            source: newEditSource,
                            zIndex: 1000,
                            style: new Style({
                              stroke: new Stroke({ color: '#00ff00', width: 5 }),
                              fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
                              image: new CircleStyle({
                                radius: 8,
                                fill: new Fill({ color: '#00ff00' }),
                                stroke: new Stroke({ color: '#ffffff', width: 3 })
                              })
                            })
                          });
                          
                          // 편집용 레이어 식별자 설정
                          newEditLayer.set('isEditLayer', true);
                          
                          // 새로운 geometry로 편집용 feature 생성
                          const newEditFeature = new Feature(olGeometry);
                          newEditFeature.setId(selectedFeature.id);
                          newEditFeature.setProperties(selectedFeature.properties || {});
                          
                          newEditSource.addFeature(newEditFeature);
                          state.mapRef.current?.addLayer(newEditLayer);
                          
                          // 새로운 Translate 인터랙션 생성
                          const newTranslate = new Translate({
                            features: new Collection([newEditFeature])
                          });
                          
                          // 새로운 Snap 인터랙션 생성
                          const newSnap = new Snap({
                            source: newEditSource,
                            pixelTolerance: 10
                          });
                          
                          // 새로운 인터랙션 추가
                          state.mapRef.current?.addInteraction(newTranslate);
                          state.mapRef.current?.addInteraction(newSnap);
                          
                          // 새로운 편집 완료 이벤트 처리
                          newTranslate.on('translateend', async (event) => {
                            const translatedFeature = event.features.getArray()[0];
                            if (translatedFeature) {
                              const geometry = translatedFeature.getGeometry();
                              if (geometry) {
                                const coordinates = (geometry as any).getCoordinates?.();
                                
                                // WFS를 통해 서버에 저장
                                try {
                                  const geometryType = geometry.getType();
                                  const featureId = selectedFeature.id;
                                  const layerName = featureId ? featureId.split('.')[0] : 'unknown';
                                  
                                  const newGeometry = {
                                    type: geometryType,
                                    coordinates: coordinates
                                  };
                                  
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
                                    alert('Point 이동이 성공적으로 저장되었습니다.');
                                    
                                    // WMS 레이어 새로고침
                                    const layers = state.mapRef.current?.getLayers().getArray() || [];
                                    layers.forEach(layer => {
                                      if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                                        const source = layer.getSource();
                                        if (source && source.refresh) {
                                          source.refresh();
                                        }
                                      }
                                    });
                                    
                                    // 선택된 feature 업데이트
                                    const updatedFeature = {
                                      ...selectedFeature,
                                      geometry: newGeometry
                                    };
                                    useMapbase.getState().setSelectedFeatures([updatedFeature]);
                                    
                                    // 지도 렌더링
                                    state.mapRef.current?.render();
                                  } else {
                                    alert('저장에 실패했습니다. 다시 시도해주세요.');
                                  }
                                } catch (error: any) {
                                  console.error('WFS 저장 중 오류:', error);
                                  const errorMessage = error.message || '저장 중 오류가 발생했습니다.';
                                  alert(errorMessage);
                                }
                              }
                            }
                          });
                          
                          // 지도 다시 렌더링
                          state.mapRef.current?.render();
                        }, 100);
                      } else {
                        alert('저장에 실패했습니다. 다시 시도해주세요.');
                        // 실패해도 편집용 레이어는 제거
                        state.mapRef.current?.removeLayer(editLayer);
                      }
                    } catch (error: any) {
                      console.error('WFS 저장 중 오류:', error);
                      const errorMessage = error.message || '저장 중 오류가 발생했습니다.';
                      alert(errorMessage);
                      
                      // 오류 발생 시에도 편집용 레이어는 제거
                      state.mapRef.current?.removeLayer(editLayer);
                    }
                  } else {
                    // 실패해도 편집용 레이어는 제거
                    state.mapRef.current?.removeLayer(editLayer);
                  }
                } catch (error) {
                  console.error('원본 feature 업데이트 중 오류:', error);
                  // 오류 발생해도 편집용 레이어는 제거
                  state.mapRef.current?.removeLayer(editLayer);
                }
                
                // 인터랙션 제거
                state.mapRef.current?.removeInteraction(translate);
                state.mapRef.current?.removeInteraction(snap);
                
                // 편집 모드 상태 초기화
                state.editModeRef.current = { mode: '', featureId: null };
              }
            }
          });
          
          // 인터랙션 추가
          state.mapRef.current.addInteraction(translate);
          state.mapRef.current.addInteraction(snap);
          
          // ESC 키로 편집 모드 종료
          const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              state.mapRef.current?.removeInteraction(translate);
              state.mapRef.current?.removeInteraction(snap);
              state.mapRef.current?.removeLayer(editLayer);
              // 이벤트 리스너 제거
              document.removeEventListener('keydown', handleKeyDown);
              // 편집 모드 상태 초기화
              state.editModeRef.current = { mode: '', featureId: null };
              // 모드 종료
              useMapbase.getState().setMode('select');
            }
          };
          document.addEventListener('keydown', handleKeyDown);
          
        } else {
          // Modify 인터랙션 추가
          const modify = new Modify({
            features: new Collection([editFeature]),
            style: new Style({
              stroke: new Stroke({ color: '#00ff00', width: 3 }),
              fill: new Fill({ color: 'rgba(0, 255, 0, 0.1)' }),
              image: new CircleStyle({
                radius: 8,
                fill: new Fill({ color: '#00ff00' }),
                stroke: new Stroke({ color: '#ffffff', width: 2 })
              })
            })
          });
          
          // Snap 인터랙션 추가
          const snap = new Snap({
            source: editSource,
            pixelTolerance: 10
          });

          state.mapRef.current.addInteraction(modify);
          state.mapRef.current.addInteraction(snap);

          // 편집 완료 이벤트 처리
          modify.on('modifyend', async (event) => {
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
                
                // 원본 feature 업데이트 시도
                try {
                  // 모든 레이어에서 원본 feature 찾기
                  const layers = state.mapRef.current?.getLayers().getArray() || [];
                  let originalFeatureFound = false;
                  let originalFeature = null;
                  
                  for (const layer of layers) {
                    if (layer instanceof VectorLayer && !layer.get('isEditLayer')) {
                      const source = layer.getSource();
                      if (source) {
                        const features = source.getFeatures();
                        
                        for (const feature of features) {
                          const featureId = feature.getId();
                          const featureGeometry = feature.getGeometry();
                          
                          // 1. ID로 매칭
                          if (selectedFeature.id && featureId === selectedFeature.id) {
                            feature.setGeometry(geometry);
                            originalFeatureFound = true;
                            originalFeature = feature;
                            break;
                          }
                          
                          // 2. 좌표 기반 매칭 (더 정확한 비교)
                          if (featureGeometry && selectedFeature.geometry) {
                            const featureCoords = featureGeometry.getCoordinates();
                            const selectedCoords = selectedFeature.geometry.coordinates;
                            
                            if (JSON.stringify(featureCoords) === JSON.stringify(selectedCoords)) {
                              feature.setGeometry(geometry);
                              originalFeatureFound = true;
                              originalFeature = feature;
                              break;
                            }
                          }
                          
                          // 3. 속성 기반 매칭 (백업 방법)
                          if (selectedFeature.properties && feature.getProperties()) {
                            const selectedProps = selectedFeature.properties;
                            const featureProps = feature.getProperties();
                            
                            // 주요 속성들이 일치하는지 확인
                            const keyProps = ['name', 'id', 'fid', 'gid'];
                            let propsMatch = false;
                            
                            for (const key of keyProps) {
                              if (selectedProps[key] && featureProps[key] && 
                                  selectedProps[key] === featureProps[key]) {
                                propsMatch = true;
                                break;
                              }
                            }
                            
                            if (propsMatch) {
                              feature.setGeometry(geometry);
                              originalFeatureFound = true;
                              originalFeature = feature;
                              break;
                            }
                          }
                        }
                        
                        if (originalFeatureFound) break;
                      }
                    }
                  }
                  
                  if (originalFeatureFound && originalFeature) {
                    // WFS를 통해 서버에 저장
                    try {
                      const geometryType = geometry.getType();
                      
                      // 선택된 feature에서 정보 추출
                      const featureId = selectedFeature.id; // 선택된 feature의 ID 사용
                      const layerName = featureId ? featureId.split('.')[0] : 'unknown';
                      
                      const newGeometry = {
                        type: geometryType,
                        coordinates: coordinates
                      };
                      
                      console.log('=== MainPage updateFeatureViaWFS 호출 ===');
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
                        state.mapRef.current?.removeLayer(editLayer);
                        
                        // 2. WMS 레이어 새로고침 강화 (이동된 위치에 feature 표시)
                        const layers = state.mapRef.current?.getLayers().getArray() || [];
                        layers.forEach(layer => {
                          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                            const source = layer.getSource();
                            if (source && source.refresh) {
                              console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                              source.refresh();
                            }
                          }
                        });
                        
                        // 3. 선택된 feature를 새로운 위치로 업데이트
                        const updatedFeature = {
                          ...selectedFeature,
                          geometry: newGeometry
                        };
                        useMapbase.getState().setSelectedFeatures([updatedFeature]);
                        
                        // 4. 지도 렌더링 강화
                        state.mapRef.current?.render();
                        
                        // 5. WMS 레이어가 완전히 새로고침될 때까지 대기
                        setTimeout(() => {
                          console.log('✅ WMS 레이어 새로고침 완료');
                          state.mapRef.current?.render();
                          
                          // 6. 편집 완료 후 선택 해제 (새로운 위치에서 재선택 가능하도록)
                          setTimeout(() => {
                            console.log('🔄 편집 완료 - 선택 해제');
                            useMapbase.getState().setSelectedFeatures([]);
                          }, 500);
                        }, 1000);
                        
                        // 5. 편집 모드 유지 - 새로운 위치에 편집용 레이어 재생성
                        setTimeout(() => {
                          // 기존 편집용 레이어 제거
                          const allLayers = state.mapRef.current?.getLayers().getArray() || [];
                          allLayers.forEach(layer => {
                            if (layer.get('isEditLayer')) {
                              state.mapRef.current?.removeLayer(layer);
                            }
                          });
                          
                          // 기존 인터랙션 제거
                          state.mapRef.current?.removeInteraction(modify);
                          state.mapRef.current?.removeInteraction(snap);
                          
                          // 새로운 위치에 편집용 레이어 생성
                          const newEditSource = new VectorSource();
                          const newEditLayer = new VectorLayer({
                            source: newEditSource,
                            zIndex: 1000,
                            style: new Style({
                              stroke: new Stroke({ color: '#00ff00', width: 5 }),
                              fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
                              image: new CircleStyle({
                                radius: 8,
                                fill: new Fill({ color: '#00ff00' }),
                                stroke: new Stroke({ color: '#ffffff', width: 3 })
                              })
                            })
                          });
                          
                          // 편집용 레이어 식별자 설정
                          newEditLayer.set('isEditLayer', true);
                          
                          // 새로운 geometry로 편집용 feature 생성
                          const newEditFeature = new Feature(olGeometry);
                          newEditFeature.setId(selectedFeature.id);
                          newEditFeature.setProperties(selectedFeature.properties || {});
                          
                          newEditSource.addFeature(newEditFeature);
                          state.mapRef.current?.addLayer(newEditLayer);
                          
                          // 새로운 Modify 인터랙션 생성
                          const newModify = new Modify({
                            features: new Collection([newEditFeature]),
                            style: new Style({
                              stroke: new Stroke({ color: '#00ff00', width: 3 }),
                              fill: new Fill({ color: 'rgba(0, 255, 0, 0.1)' }),
                              image: new CircleStyle({
                                radius: 8,
                                fill: new Fill({ color: '#00ff00' }),
                                stroke: new Stroke({ color: '#ffffff', width: 2 })
                              })
                            })
                          });
                          
                          // 새로운 Snap 인터랙션 생성
                          const newSnap = new Snap({
                            source: newEditSource,
                            pixelTolerance: 10
                          });
                          
                          // 새로운 인터랙션 추가
                          state.mapRef.current?.addInteraction(newModify);
                          state.mapRef.current?.addInteraction(newSnap);
                          
                          // 새로운 편집 완료 이벤트 처리
                          newModify.on('modifyend', async (event) => {
                            const modifiedFeature = event.features.getArray()[0];
                            if (modifiedFeature) {
                              const geometry = modifiedFeature.getGeometry();
                              if (geometry) {
                                const coordinates = (geometry as any).getCoordinates?.();
                                
                                // 좌표 유효성 검증
                                console.log('New modified coordinates:', coordinates);
                                if (!coordinates || !Array.isArray(coordinates)) {
                                  console.error('Invalid coordinates after new modification:', coordinates);
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
                                  console.error('New coordinates contain invalid values:', coordinates);
                                  alert('편집 후 좌표에 유효하지 않은 값이 포함되어 있습니다. 다시 시도해주세요.');
                                  return;
                                }
                                
                                // Polygon의 경우 최소 3개 점이 필요
                                if (geometry.getType() === 'Polygon' && coordinates.length > 0 && coordinates[0].length < 3) {
                                  console.error('New polygon has insufficient points:', coordinates[0].length);
                                  alert('폴리곤은 최소 3개의 점이 필요합니다. 다시 시도해주세요.');
                                  return;
                                }
                                
                                // WFS를 통해 서버에 저장
                                try {
                                  const geometryType = geometry.getType();
                                  const featureId = selectedFeature.id;
                                  const layerName = featureId ? featureId.split('.')[0] : 'unknown';
                                  
                                  const newGeometry = {
                                    type: geometryType,
                                    coordinates: coordinates
                                  };
                                  
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
                                    
                                    // WMS 레이어 새로고침 강화
                                    const layers = state.mapRef.current?.getLayers().getArray() || [];
                                    layers.forEach(layer => {
                                      if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                                        const source = layer.getSource();
                                        if (source && source.refresh) {
                                          console.log('Refreshing layer (new modify):', layer.get('layerName') || 'unknown');
                                          source.refresh();
                                        }
                                      }
                                    });
                                    
                                    // 선택된 feature 업데이트
                                    const updatedFeature = {
                                      ...selectedFeature,
                                      geometry: newGeometry
                                    };
                                    useMapbase.getState().setSelectedFeatures([updatedFeature]);
                                    
                                    // 지도 렌더링 강화
                                    state.mapRef.current?.render();
                                    
                                    // WMS 레이어가 완전히 새로고침될 때까지 대기
                                    setTimeout(() => {
                                      console.log('WMS layer refresh completed (new modify)');
                                      state.mapRef.current?.render();
                                    }, 500);
                                  } else {
                                    alert('저장에 실패했습니다. 다시 시도해주세요.');
                                  }
                                } catch (error: any) {
                                  console.error('WFS 저장 중 오류:', error);
                                  const errorMessage = error.message || '저장 중 오류가 발생했습니다.';
                                  alert(errorMessage);
                                }
                              }
                            }
                          });
                          
                          // 지도 다시 렌더링
                          state.mapRef.current?.render();
                        }, 100);
                      } else {
                        alert('저장에 실패했습니다. 다시 시도해주세요.');
                        // 실패해도 편집용 레이어는 제거
                        state.mapRef.current?.removeLayer(editLayer);
                      }
                    } catch (error: any) {
                      console.error('WFS 저장 중 오류:', error);
                      const errorMessage = error.message || '저장 중 오류가 발생했습니다.';
                      alert(errorMessage);
                      
                      // 오류 발생 시에도 편집용 레이어는 제거
                      state.mapRef.current?.removeLayer(editLayer);
                    }
                  } else {
                    // 실패해도 편집용 레이어는 제거
                    state.mapRef.current?.removeLayer(editLayer);
                  }
                } catch (error) {
                  console.error('원본 feature 업데이트 중 오류:', error);
                  // 오류 발생해도 편집용 레이어는 제거
                  state.mapRef.current?.removeLayer(editLayer);
                }
                
                // 인터랙션 제거
                state.mapRef.current?.removeInteraction(translate);
                state.mapRef.current?.removeInteraction(snap);
                
                // 편집 모드 상태 초기화
                state.editModeRef.current = { mode: '', featureId: null };
              }
            }
          });

          // ESC 키로 편집 모드 종료
          const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              state.mapRef.current?.removeInteraction(modify);
              state.mapRef.current?.removeInteraction(snap);
              state.mapRef.current?.removeLayer(editLayer);
              // 이벤트 리스너 제거
              document.removeEventListener('keydown', handleKeyDown);
              // 편집 모드 상태 초기화
              state.editModeRef.current = { mode: '', featureId: null };
              // 모드 종료
              useMapbase.getState().setMode('select');
            }
          };
          document.addEventListener('keydown', handleKeyDown);
        }
      }
    };
    // 즉시 실행
    checkEditMode();
    // 주기적으로 상태 확인 (1초마다)
    const interval = setInterval(checkEditMode, 1000);
    // 클린업 함수
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Helper: map codeBlockType to code string and run handler
  const codeBlockTypeToCodeAndRun = {
    center: { code: getScreenCenterPointSample, run: handleGetCenter },
    zoom: { code: getCurrentZoomLevelSample, run: handleGetZoom },
    minzoom: { code: getMinZoomLevelSample, run: handleGetMinZoom },
    maxzoom: { code: getMaxZoomLevelSample, run: handleGetMaxZoom },
    movecenter: { code: moveCenterPointSample, run: handleMoveCenter },
    movecenterzoom: { code: moveCenterPointAndChangeLevelSample, run: handleMoveCenterZoom },
    movearea: { code: moveAreaSample, run: handleMoveArea },
    prevscreen: { code: prevScreenSample, run: handlePrevScreen },
    forwardscreen: { code: forwardScreenSample, run: handleForwardScreen },
    zoomin: { code: zoomInMapSample, run: handleZoomIn },
    zoomout: { code: zoomOutMapSample, run: handleZoomOut },
    adjustscale: { code: adjustScaleSample, run: handleAdjustScale },
    panby: { code: panBySample, run: () => handlePanBy(100, 0, 300) }, // default values
    panto: { code: panToSample, run: handlePanTo },
    fitbounds: { code: fitBoundsSample, run: handleFitBounds },
    getbounds: { code: getBoundsSample, run: handleGetBounds },
    setzoom: { code: setZoomSample, run: handleSetZoom },
    resetView: { code: resetViewSample, run: handleResetView },
    copyView: { code: copyViewSample, run: handleCopyView },
    rotateMap: { code: rotateMapSample, run: handleRotateMap },
    exportMapImage: { code: exportMapImageSample, run: handleExportMapImage },
    getLayer: { code: getLayerSample, run: handleGetLayer },
    externalLayerName: { code: getExternalLayerNameSample, run: handleGetExternalLayerName },
    tableNameOfLayer: { code: getTableNameOfLayerSample, run: handleGetTableNameOfLayer },
            minDisplayZoomLevel: { code: getMinDisplayZoomLevelSample, run: handleGetMinDisplayZoomLevel },
            maxDisplayZoomLevel: { code: getMaxDisplayZoomLevelSample, run: handleGetMaxDisplayZoomLevel },
    selectableFacility: { code: getSelectableFacilitySample, run: handleGetSelectableStatus },
    viewLayerInfo: { code: viewLayerInfoSample, run: handleRunViewLayerInfoCode },
    toggleDisplayHide: { code: toggleDisplayHideSample, run: handleToggleDisplayHide },
    refreshLayer: { code: refreshLayerSample, run: handleRunRefreshLayerCode },
    addUserLayer: { code: addUserLayerSample, run: handleRunAddUserLayerCode },
    initUserLayer: { code: initUserLayerSample, run: handleRunInitUserLayerCode },
    deleteUserLayer: { code: deleteUserLayerSample, run: handleRunDeleteUserLayerCode },
    entireAreaUserLayer: { code: entireAreaUserLayerSample, run: handleRunEntireAreaUserLayerCode },
    defaultContextMenu: { code: defaultContextMenuSample, run: handleRunDefaultContextMenuCode },
    editContextMenu: { code: editContextMenuSample, run: handleRunEditContextMenuCode },
    setLayerDisplayLevel: { code: setLayerDisplayLevelSample, run: handleRunSetLayerDisplayLevelCode },
    setLayerStyle: { code: setLayerStyleSample, run: handleRunSetLayerStyleCode },
    setLayerStyleDefault: { code: setLayerStyleDefaultSample, run: handleRunSetLayerStyleDefaultCode },
    setThematics: { code: setThematicsSample, run: handleRunSetThemematicsCode },
    clearSelectLayer: { code: clearSelectLayerSample, run: handleRunClearSelectLayerCode },
    select: { code: selectSample, run: handleRunSelectCode },
    advancedSelect: { code: advancedSelectSample, run: handleRunAdvancedSelectCode },
    trailDistance: { code: trailDistanceSample, run: handleRunTrailDistanceCode },
    trailArea: { code: trailAreaSample, run: handleRunTrailAreaCode },
    trailSimple: { code: trailSimpleSample, run: handleRunTrailSimpleCode },
    areaDrawRect: { code: areaDrawRectSample, run: handleRunAreaDrawRectCode },
    areaDrawCircle: { code: areaDrawCircleSample, run: handleRunAreaDrawCircleCode },
    areaDrawPolygon: { code: areaDrawPolygonSample, run: handleRunAreaDrawPolygonCode },
    getSelectedFeatures: { code: getSelectedFeaturesSample, run: handleRunGetSelectedFeaturesCode },
    getTrailCoordinate: { code: getTrailCoordinateSample, run: handleRunGetTrailCoordinateCode },
    trailDrawLine: { code: trailDrawLineSample, run: handleRunTrailDrawLineCode },
    advancedTrailDrawLine: { code: advancedTrailDrawLineSample, run: handleRunAdvancedTrailDrawLineCode },
    trailDrawPoint: { code: trailDrawPointSample, run: handleRunTrailDrawPointCode },
    advancedTrailDrawPoint: { code: advancedTrailDrawPointSample, run: handleRunAdvancedTrailDrawPointCode },
    trailDrawPolygon: { code: trailDrawPolygonSample, run: handleRunTrailDrawPolygonCode },
    advancedTrailDrawPolygon: { code: advancedTrailDrawPolygonSample, run: () => {
      try {
        activateAdvancedTrailDrawPolygonMode({
          showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
          setDrawnFeature: (feature: any) => {
            state.drawnFeatureRef.current = feature;
          }
        });
        alert('Advanced Trail Draw Polygon 모드가 활성화되었습니다.');
      } catch (error) {
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
    trailEdit: { code: trailEditSample, run: () => {
      try {
        activateTrailEditMode(state.mapRef.current);
        alert('Trail Edit 모드가 활성화되었습니다.');
      } catch (error) {
        console.error('Trail Edit 실행 중 오류:', error);
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
    trailDelete: { code: trailDeleteSample, run: async () => {
      try {
        await activateTrailDeleteMode(state.mapRef.current);
      } catch (error) {
        console.error('Trail Delete 실행 중 오류:', error);
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
    rectSelection: { code: rectSelectionSample, run: () => {
      try {
        activateRectSelectionMode(state.mapRef.current);
        alert('Rect Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');
      } catch (error) {
        console.error('Rect Selection 실행 중 오류:', error);
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
    circleSelection: { code: circleSelectionSample, run: () => {
      try {
        activateCircleSelectionMode(state.mapRef.current);
        alert('Circle Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');
      } catch (error) {
        console.error('Circle Selection 실행 중 오류:', error);
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
    polygonSelection: { code: polygonSelectionSample, run: () => {
      try {
        activatePolygonSelectionMode(state.mapRef.current, layerData || []);
        alert('Polygon Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\n더블클릭으로 그리기를 완료하세요.');
      } catch (error) {
        console.error('Polygon Selection 실행 중 오류:', error);
        alert('실행 오류: ' + error);
      }
      state.setIsCodeBlockActive(false);
      setTimeout(() => {
        state.setIsCodeBlockVisible(false);
        state.setCodeBlockType(null);
      }, 500);
    }},
  };

  // codePanelProps 제거 (fe5 방식으로 되돌림)

  const handleCloseCodePanel = () => {
    state.setIsCodeBlockVisible(false);
    state.setCodeBlockType(null);
  };

  // 레이어 컨트롤 토글 핸들러
  const handleToggleLayerControl = () => {
    state.setShowLayerControl(v => !v);
  };

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.MouseEvent) => {
    // 왼쪽 버튼 클릭만 처리
    if (e.button !== 0) return;
    
    if (e.target instanceof HTMLElement) {
      const rect = e.target.getBoundingClientRect();
      state.setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      state.setDragStartPos({ x: e.clientX, y: e.clientY });
      state.setHasMoved(false);
      state.setIsDragging(true);
      // 드래그 시작 시 클릭 이벤트 방지
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 드래그 중 핸들러
  const handleDragMove = (e: MouseEvent) => {
    if (state.isDragging) {
      e.preventDefault();
      
      // 드래그 거리 계산 (3px 이상 움직였는지 확인)
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - state.dragStartPos.x, 2) + 
        Math.pow(e.clientY - state.dragStartPos.y, 2)
      );
      
      if (moveDistance > 3) {
        state.setHasMoved(true);
      }
      
      const newX = e.clientX - state.dragOffset.x;
      const newY = e.clientY - state.dragOffset.y;
      
      // 화면 경계 내로 제한
      const maxX = window.innerWidth - 48; // 버튼 너비
      const maxY = window.innerHeight - 48; // 버튼 높이
      
      state.setLayerControlPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    if (state.isDragging) {
      state.setIsDragging(false);
    }
  };

  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [state.isDragging, state.dragOffset]);

  // 레이어 체크박스 변경 핸들러 (fe5와 동일하게 동기 처리)
  const handleLayerCheckboxChange = (checkedValues: any) => {
    console.log('handleLayerCheckboxChange called with:', checkedValues);
    const checked = checkedValues.filter((v: any) => typeof v === 'string') as string[];
    console.log('filtered checked:', checked);
    console.log('polygonHump in checked:', checked.includes('polygonHump'));
    state.setCheckedLayers(checked);
    
    // layerData.visible 동기화 (fe5와 동일)
    if (state.layerData) {
      console.log('layerData before update:', state.layerData.map(l => ({ name: l.name, visible: l.visible, minZoom: l.minZoom, maxZoom: l.maxZoom })));
      state.layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          const wasVisible = (layer as any).visible;
          (layer as any).visible = checked.includes(layer.value);
          if (layer.value === 'polygonHump') {
            console.log(`polygonHump visibility changed: ${wasVisible} -> ${(layer as any).visible}`);
            console.log(`polygonHump zoom levels: min=${layer.minZoom}, max=${layer.maxZoom}`);
          }
        }
      });
      console.log('layerData after update:', state.layerData.map(l => ({ name: l.name, visible: l.visible, minZoom: l.minZoom, maxZoom: l.maxZoom })));
      
      // 지도 강제 새로고침 (fe5와 동일)
      if (state.mapRef?.current) {
        console.log('Force refreshing map after layer change');
        // 기존 벡터 타일 레이어 제거
        state.vectorTileLayers.current.forEach(layer => {
          state.mapRef.current?.removeLayer(layer);
        });
        
        // 새로운 벡터 타일 레이어 추가
        const zoom = Math.floor(state.mapRef.current.getView()?.getZoom() ?? 0);
        const isZoomForMVT = zoom >= 13;
        console.log(`Current zoom: ${zoom}, isZoomForMVT: ${isZoomForMVT}`);
        if (isZoomForMVT) {
          const visibleLayers = state.layerData.filter(layer => layer.visible);
          console.log('Visible layers for MVT:', visibleLayers.map(l => l.name));
          state.vectorTileLayers.current = visibleLayers.map(layer => {
            const vectorLayer = createVectorLayer(layer, useMapbase.getState().defaultStyles);
            state.mapRef.current?.addLayer(vectorLayer);
            console.log(`Added MVT layer: ${layer.name}`);
            return vectorLayer;
          });
        }
        
        // WMS 레이어 업데이트 (fe5와 동일)
        if (state.tileWmsLayer.current) {
          const layersFilter = state.layerData
            .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
            .filter(item => item.visible);
          const layerNames = layersFilter.map(item => item.value);
          state.tileWmsLayer.current.getSource()?.updateParams({ LAYERS: layerNames.join(',') });
          state.tileWmsLayer.current.setVisible(layerNames.length > 0);
          state.tileWmsLayer.current.getSource()?.refresh();
        }
        
        // 지도 렌더링 강제 업데이트
        state.mapRef.current.render();
      }
    }
  };

  // 모든 레이어 보기 (fe5와 동일하게 구현)
  const handleShowAllLayers = () => {
    if (state.layerData) {
      const allLayerValues = state.layerData
        .filter(l => typeof l.value === 'string')
        .map(l => l.value as string);
      state.setCheckedLayers(allLayerValues);
      
      // layerData.visible 동기화
      state.layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = true;
        }
      });
      
      // 지도 강제 새로고침
      if (state.mapRef?.current) {
        console.log('Force refreshing map to show all layers');
        // 기존 벡터 타일 레이어 제거
        state.vectorTileLayers.current.forEach(layer => {
          state.mapRef.current?.removeLayer(layer);
        });
        
        // 새로운 벡터 타일 레이어 추가
        const zoom = Math.floor(state.mapRef.current.getView()?.getZoom() ?? 0);
        const isZoomForMVT = zoom >= 13;
        if (isZoomForMVT) {
          state.vectorTileLayers.current = state.layerData.map(layer => {
            const vectorLayer = createVectorLayer(layer, useMapbase.getState().defaultStyles);
            state.mapRef.current?.addLayer(vectorLayer);
            return vectorLayer;
          });
        }
        
        // WMS 레이어 업데이트
        if (state.tileWmsLayer.current) {
          const layersFilter = state.layerData
            .filter(item => item.minZoom <= zoom && zoom <= item.maxZoom)
            .filter(item => item.visible);
          const layerNames = layersFilter.map(item => item.value);
          state.tileWmsLayer.current.getSource()?.updateParams({ LAYERS: layerNames.join(',') });
          state.tileWmsLayer.current.setVisible(layerNames.length > 0);
          state.tileWmsLayer.current.getSource()?.refresh();
        }
        
        // 지도 렌더링 강제 업데이트
        state.mapRef.current.render();
      }
    }
  };

  // 모든 레이어 숨기기 (WMS LAYERS 파라미터 완전 비우기)
  const handleHideAllLayers = () => {
    console.log('handleHideAllLayers called');
    state.setCheckedLayers([]);
    
    // layerData.visible 동기화
    if (state.layerData) {
      console.log('Setting all layers to invisible');
      state.layerData.forEach(layer => {
        if (typeof layer.value === 'string') {
          (layer as any).visible = false;
          console.log(`Set ${layer.value} to invisible`);
        }
      });
      
      // 지도 강제 새로고침
      if (state.mapRef?.current) {
        console.log('Force refreshing map');
        // 모든 벡터 타일 레이어 제거
        state.vectorTileLayers.current.forEach(layer => {
          state.mapRef.current?.removeLayer(layer);
        });
        state.vectorTileLayers.current = [];
        
        // WMS 레이어 숨기기 + LAYERS 파라미터 완전 비우기
        if (state.tileWmsLayer.current) {
          state.tileWmsLayer.current.setVisible(false);
          // LAYERS 파라미터를 완전히 비워서 이전 레이어 데이터 제거
          state.tileWmsLayer.current.getSource()?.updateParams({ LAYERS: '' });
          state.tileWmsLayer.current.getSource()?.refresh();
        }
        
        // 지도 렌더링 강제 업데이트
        state.mapRef.current.render();
      }
    }
  };

  // MainPage 함수 내부 상단에 추가
  const codeSample = useMemo(() => {
    console.log('useMemo 실행됨, codeBlockType:', state.codeBlockType);
    if (state.codeBlockType === 'center') return getScreenCenterPointSample;
    else if (state.codeBlockType === 'zoom') return getCurrentZoomLevelSample;
    else if (state.codeBlockType === 'minzoom') return getMinZoomLevelSample;
    else if (state.codeBlockType === 'maxzoom') return getMaxZoomLevelSample;
    else if (state.codeBlockType === 'movecenter') return moveCenterPointSample;
    else if (state.codeBlockType === 'movecenterzoom') return moveCenterPointAndChangeLevelSample;
    else if (state.codeBlockType === 'movearea') return moveAreaSample;
    else if (state.codeBlockType === 'prevscreen') return prevScreenSample;
    else if (state.codeBlockType === 'forwardscreen') return forwardScreenSample;
    else if (state.codeBlockType === 'zoomin') return zoomInMapSample;
    else if (state.codeBlockType === 'zoomout') return zoomOutMapSample;
    else if (state.codeBlockType === 'adjustscale') return adjustScaleSample;
    else if (state.codeBlockType === 'panby') return panBySample;
    else if (state.codeBlockType === 'panto') return panToSample;
    else if (state.codeBlockType === 'fitbounds') return fitBoundsSample;
    else if (state.codeBlockType === 'getbounds') return getBoundsSample;
    else if (state.codeBlockType === 'setzoom') return setZoomSample;
    else if (state.codeBlockType === 'resetView') return resetViewSample;
    else if (state.codeBlockType === 'copyView') return copyViewSample;
    else if (state.codeBlockType === 'rotateMap') return rotateMapSample;
    else if (state.codeBlockType === 'exportMapImage') return exportMapImageSample;
    else if (state.codeBlockType === 'getLayer') return getLayerSample;
    else if (state.codeBlockType === 'externalLayerName') return getExternalLayerNameSample;
    else if (state.codeBlockType === 'tableNameOfLayer') return getTableNameOfLayerSample;
    else if (state.codeBlockType === 'minDisplayZoomLevel') return getMinDisplayZoomLevelSample;
    else if (state.codeBlockType === 'maxDisplayZoomLevel') return getMaxDisplayZoomLevelSample;
    else if (state.codeBlockType === 'selectableFacility') return getSelectableFacilitySample;
    else if (state.codeBlockType === 'viewLayerInfo') return viewLayerInfoSample;
    else if (state.codeBlockType === 'addUserLayer') return addUserLayerSample;
    else if (state.codeBlockType === 'initUserLayer') return initUserLayerSample;
    else if (state.codeBlockType === 'deleteUserLayer') return deleteUserLayerSample;
    else if (state.codeBlockType === 'entireAreaUserLayer') return entireAreaUserLayerSample;
    else if (state.codeBlockType === 'getLayer') return getLayerSample;
    else if (state.codeBlockType === 'externalLayerName') return getExternalLayerNameSample;
    else if (state.codeBlockType === 'tableNameOfLayer') return getTableNameOfLayerSample;
    else if (state.codeBlockType === 'minDisplayZoomLevel') return getMinDisplayZoomLevelSample;
    else if (state.codeBlockType === 'maxDisplayZoomLevel') return getMaxDisplayZoomLevelSample;
    else if (state.codeBlockType === 'selectableFacility') return getSelectableFacilitySample;
    else if (state.codeBlockType === 'viewLayerInfo') return viewLayerInfoSample;
    else if (state.codeBlockType === 'toggleDisplayHide') return toggleDisplayHideSample;
    else if (state.codeBlockType === 'refreshLayer') return refreshLayerSample;
    else if (state.codeBlockType === 'defaultContextMenu') return defaultContextMenuSample;
    else if (state.codeBlockType === 'editContextMenu') return editContextMenuSample;
    else if (state.codeBlockType === 'setLayerDisplayLevel') return setLayerDisplayLevelSample;
    else if (state.codeBlockType === 'setLayerStyle') return setLayerStyleSample;
    else if (state.codeBlockType === 'setLayerStyleDefault') return setLayerStyleDefaultSample;
    else if (state.codeBlockType === 'setThematics') return setThematicsSample;
    else if (state.codeBlockType === 'select') return selectSample;
    else if (state.codeBlockType === 'advancedSelect') return advancedSelectSample;
    else if (state.codeBlockType === 'trailDistance') return trailDistanceSample;
    else if (state.codeBlockType === 'trailArea') return trailAreaSample;
    else if (state.codeBlockType === 'trailSimple') return trailSimpleSample;
    else if (state.codeBlockType === 'areaDrawRect') return areaDrawRectSample;
    else if (state.codeBlockType === 'areaDrawCircle') return areaDrawCircleSample;
    else if (state.codeBlockType === 'areaDrawPolygon') return areaDrawPolygonSample;
    else if (state.codeBlockType === 'getSelectedFeatures') return getSelectedFeaturesSample;
    else if (state.codeBlockType === 'getTrailCoordinate') return getTrailCoordinateSample;
    else if (state.codeBlockType === 'trailDrawLine') return trailDrawLineSample;
    else if (state.codeBlockType === 'advancedTrailDrawLine') {
      console.log('Advanced Trail Draw Line 샘플 코드 반환:', advancedTrailDrawLineSample);
      return advancedTrailDrawLineSample;
    }
    else if (state.codeBlockType === 'trailDrawPoint') return trailDrawPointSample;
    else if (state.codeBlockType === 'advancedTrailDrawPoint') {
      console.log('Advanced Trail Draw Point 샘플 코드 반환:', advancedTrailDrawPointSample);
      return advancedTrailDrawPointSample;
    }
    else if (state.codeBlockType === 'trailDrawPolygon') return trailDrawPolygonSample;
    else if (state.codeBlockType === 'advancedTrailDrawPolygon') {
      console.log('Advanced Trail Draw Polygon 샘플 코드 반환:', advancedTrailDrawPolygonSample);
      return advancedTrailDrawPolygonSample;
    }
    else if (state.codeBlockType === 'trailEdit') return trailEditSample;
    else if (state.codeBlockType === 'trailDelete') return trailDeleteSample;


    else if (state.codeBlockType === 'clearSelectLayer') return clearSelectLayerSample;
    else if (state.codeBlockType === 'rectSelection') return rectSelectionSample;
    else if (state.codeBlockType === 'polygonSelection') return polygonSelectionSample;
    else if (state.codeBlockType === 'circleSelection') return circleSelectionSample;
          else if (state.codeBlockType === 'setLayerOpacity') return setLayerOpacitySample;
    else if (state.codeBlockType === 'getLayerOpacity') return getLayerOpacitySample;
    else if (state.codeBlockType === 'resetLayerOpacity') return resetLayerOpacitySample;
    return '';
  }, [state.codeBlockType, advancedTrailDrawLineSample, advancedTrailDrawPointSample]);



  const { startSelectorFeature } = useRectangleSelection({
    map: state.mapRef.current,
    onEndDraw: () => {
      
    }
  });

  const { startCircleSelection } = useCircleSelection({
    map: state.mapRef.current,
    onEndDraw: () => {
      
    }
  });
  const { startPolygonSelection } = usePolygonSelection({
    map: state.mapRef.current,
    onEndDraw: () => {
      
    }
  });

  // selectorMode 변경 감지하여 Selection 활성화
  useEffect(() => {
    const currentSelectorMode = useMapbase.getState().selectorMode;
    const layerData = useMapbase.getState().layerData;
    
    if (currentSelectorMode === 'RECT' && layerData && state.mapRef.current) {

      startSelectorFeature(layerData);
    } else if (currentSelectorMode === 'CIRCLE' && layerData && state.mapRef.current) {

      startCircleSelection(layerData);
    } else if (currentSelectorMode === 'POLYGON' && layerData && state.mapRef.current) {

      startPolygonSelection(layerData);
    }
  }, [useMapbase.getState().selectorMode, useMapbase.getState().layerData]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f8fa', fontFamily }}>
      {/* 상단 헤더 */}
      <header
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e5e5e7',
          color: '#222',
          fontWeight: 500,
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          height: 60,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <nav
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            height: 60,
            padding: '0 40px',
            gap: 32,
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 0.5,
              color: '#111',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* 네이비 배경의 둥근 사각형 + 미대륙 글로브 SVG */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#1a2a3a',
                marginRight: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <rect width="30" height="30" rx="10" fill="#1a2a3a" />
                {/* 지구본 외곽선 */}
                <circle cx="15" cy="15" r="11" fill="#1a2a3a" stroke="#fff" strokeWidth="1.7" />
                {/* 미대륙 실루엣 (단순화) */}
                <path
                  d="M13.5 10.5c.5-1.5 2.5-2.5 4-1.5 1.5 1 1 2.5 0 3.5-.5.5-1.5.5-2 .5-.5 0-1.5.5-1.5 1.5s1 1.5 2 1.5c1 0 2 .5 2 1.5s-1 2-2 2c-1.5 0-2.5-1-2.5-2.5 0-1.5.5-2.5 1-3.5z"
                  fill="#fff"
                  fillOpacity="0.95"
                />
                {/* 경도선/위도선 */}
                <path d="M15 6a9 9 0 1 1 0 18" stroke="#bfc4cc" strokeWidth="1" fill="none" />
                <path d="M8 15a7 7 0 0 1 14 0" stroke="#bfc4cc" strokeWidth="0.9" fill="none" />
              </svg>
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 25,
                letterSpacing: '0.12em',
                color: '#222',
                fontFamily: 'SF Pro Display, Pretendard, Noto Sans KR, Apple SD Gothic Neo, sans-serif',
                textShadow: '0 2px 8px rgba(0,0,0,0.04)',
                userSelect: 'none',
                marginLeft: 2,
              }}
            >
              OSSMap
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {menuItems.map(item =>
              item.label === '개발자가이드' ? (
                <button
                  key={item.href}
                  type="button"
                  style={{
                    fontSize: 16,
                    color: '#222',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                    padding: '8px 22px',
                    marginLeft: 2,
                    marginRight: 2,
                    cursor: 'pointer',
                    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                    outline: 'none',
                    position: 'relative',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.01)',
                  }}
                  onClick={() => {
                    state.setShowMenu(true);
                    setTimeout(() => state.setIsToggleActivated(true), 500);
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#f0f4fa';
                    e.currentTarget.style.color = '#0071e3';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#222';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.01)';
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.href}
                  type="button"
                  style={{
                    fontSize: 16,
                    color: '#222',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                    padding: '8px 22px',
                    marginLeft: 2,
                    marginRight: 2,
                    cursor: 'pointer',
                    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                    outline: 'none',
                    position: 'relative',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.01)',
                  }}
                  onClick={() => navigate(item.href)}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#f0f4fa';
                    e.currentTarget.style.color = '#0071e3';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#222';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.01)';
                  }}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
        </nav>
      </header>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {/* 지도 영역 (항상 100%) */}
        <div
          ref={state.mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            background: 'none',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            borderRadius: 24,
          }}
        />
        {/* 왼쪽 트리 메뉴 (지도 위에 오버레이, glassmorphism) */}
        <aside
          ref={state.asideRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 270,
            zIndex: 200,
            background: 'rgba(255,255,255,0.78)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.13)',
            borderRight: '1px solid #e5e5e7',
            borderRadius: '0 24px 24px 0',
            backdropFilter: 'blur(18px)',
            padding: '36px 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            height: 'calc(100vh - 60px)', // 헤더 높이(60px)를 제외한 높이로 조정
            overflowY: 'auto', // 스크롤 가능하게
            transition: 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.3s',
            transform: state.showMenu ? 'translateX(0)' : 'translateX(-100%)',
            opacity: state.showMenu ? 1 : 0,
            pointerEvents: state.showMenu ? 'auto' : 'none',
            visibility: state.showMenu ? 'visible' : 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: 18,
                color: '#222',
                padding: '20px 0 16px 36px',
                letterSpacing: 0.5,
                background: 'rgba(255,255,255,0.7)',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                borderBottom: '1.5px solid #f0f0f0',
                minHeight: 52,
              }}
            >
              <FiBookOpen size={20} color="#888" style={{ marginRight: 10, verticalAlign: 'middle', opacity: 0.85 }} />
              <span>가이드</span>
            </div>
            <nav style={{ flex: 1, minHeight: 0, padding: '0 0 0 0', marginTop: 10 }}>
              {treeData.map((group, idx) => (
                <div key={group.group} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 15,
                      color: '#222',
                      padding: '14px 30px',
                      background: state.open[idx] ? 'linear-gradient(90deg, #f5f6fa 0%, #e9ebf0 100%)' : 'transparent',
                      borderRadius: 14,
                      margin: '0 18px',
                      boxShadow: state.open[idx] ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      userSelect: 'none',
                      transition: 'background 0.22s, color 0.18s, box-shadow 0.22s, transform 0.18s',
                      border: 'none',
                      letterSpacing: 0.2,
                      position: 'relative',
                      outline: state.open[idx] ? '2px solid #e0e7ef' : 'none',
                    }}
                    onClick={() => state.setOpen(o => o.map((v, i) => (i === idx ? !v : v)))}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(90deg, #f0f4fa 0%, #e9ebf0 100%)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
                      const icon = (e.currentTarget as HTMLDivElement).querySelector('svg');
                      if (icon) {
                        icon.style.color = '#222';
                      }
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLDivElement).style.background = state.open[idx]
                        ? 'linear-gradient(90deg, #f5f6fa 0%, #e9ebf0 100%)'
                        : 'transparent';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = state.open[idx]
                        ? '0 4px 16px rgba(0,0,0,0.07)'
                        : 'none';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                      const icon = (e.currentTarget as HTMLDivElement).querySelector('svg');
                      if (icon) {
                        icon.style.color = '#888';
                      }
                    }}
                  >
                    {getMenuIcon(group.iconType)}
                    <span>{group.group}</span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 20,
                        color: '#bbb',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {state.open[idx] ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  </div>
                  {/* Always render <ul> for animation */}
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      overflow: 'hidden',
                      maxHeight: state.open[idx] ? 9999 : 0, // 충분히 크게 설정
                      transition: 'max-height 0.45s cubic-bezier(.4,0,.2,1)',
                    }}
                  >
                    {(group.group === '지도 정보/이동' ? moveMenu : group.children).map(child => {
                      return (
                        <li
                          key={child}
                          style={{
                            padding: '12px 44px',
                            color: state.highlightMoveMenu.includes(child) ? '#d32f2f' : state.blueMoveMenu.includes(child) ? '#1976d2' : '#222',
                            fontWeight: state.highlightMoveMenu.includes(child) || state.blueMoveMenu.includes(child) ? 700 : 400,
                            fontSize: 14,
                            borderRadius: 10,
                            margin: '2px 0',
                            background: 'transparent',
                            transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s',
                            boxShadow: 'none',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            console.log('Menu item clicked:', child);
                            if (child === 'Get Screen Center Point') {
                              openCodeBlock('center');
                            } else if (child === 'Get Current Zoom Level') {
                              openCodeBlock('zoom');
                            } else if (child === 'Get Minimum Zoom Level') {
                              openCodeBlock('minzoom');
                            } else if (child === 'Get Max Zoom Level') {
                              openCodeBlock('maxzoom');
                            } else if (child === 'Move center point') {
                              openCodeBlock('movecenter');
                            } else if (child === 'Move Center Point and Change Level') {
                              openCodeBlock('movecenterzoom');
                            } else if (child === 'Move area') {
                              openCodeBlock('movearea');
                            } else if (child === 'Previous Screen') {
                              openCodeBlock('prevscreen');
                            } else if (child === 'Forward Screen') {
                              openCodeBlock('forwardscreen');
                            } else if (child === 'Zoom In Map') {
                              openCodeBlock('zoomin');
                            } else if (child === 'Zoom out Map') {
                              openCodeBlock('zoomout');
                            } else if (child === 'Adjust Scale') {
                              openCodeBlock('adjustscale');
                            } else if (child === 'Pan By (픽셀 단위 이동)') {
                              openCodeBlock('panby');
                            } else if (child === 'Pan To (애니메이션 중심+줌 이동)') {
                              openCodeBlock('panto');
                            } else if (child === 'Fit Bounds (범용 영역 맞춤)') {
                              openCodeBlock('fitbounds');
                            } else if (child === 'Get Current Extent (현재 화면 extent 반환)') {
                              openCodeBlock('getbounds');
                            } else if (child === 'Set Zoom (애니메이션)') {
                              openCodeBlock('setzoom');
                            } else if (child === 'Reset View (초기화)') {
                              openCodeBlock('resetView');
                            } else if (child === 'Copy View State (클립보드 복사)') {
                              openCodeBlock('copyView');
                            } else if (child === 'Rotate Map (지도 회전)') {
                              openCodeBlock('rotateMap');
                            } else if (child === 'Export Map as Image (지도 이미지 저장)') {
                              openCodeBlock('exportMapImage');
                            } else if (child === 'Get Layer') {
                              openCodeBlock('getLayer');
                            } else if (child === 'External Layer Name') {
                              openCodeBlock('externalLayerName');
                            } else if (child === 'Table Name of Layer') {
                              openCodeBlock('tableNameOfLayer');
                            } else if (child === 'Minimum Display Zoom Level') {
                              openCodeBlock('minDisplayZoomLevel');
                            } else if (child === 'Maximum Display Zoom Level') {
                              openCodeBlock('maxDisplayZoomLevel');
                            } else if (child === 'Selectable Facility') {
                              openCodeBlock('selectableFacility');
                            } else if (child === 'View Layer Information') {
                              openCodeBlock('viewLayerInfo');
                            } else if (child === 'Toggle Display/Hide') {
                              openCodeBlock('toggleDisplayHide');
                            } else if (child === 'Refresh Layer') {
                              openCodeBlock('refreshLayer');
                            } else if (child === 'Add User Layer Feature') {
                              openCodeBlock('addUserLayer');
                            } else if (child === 'Initialize User Layer') {
                              openCodeBlock('initUserLayer');
                            } else if (child === 'Delete User Layer') {
                              openCodeBlock('deleteUserLayer');
                            } else if (child === 'Entire Area of User Layer') {
                              openCodeBlock('entireAreaUserLayer');
                            } else if (child === 'Default Right-Click Menu Configuration') {
                              openCodeBlock('defaultContextMenu');
                            } else if (child === 'Edit Mode Right-Click Menu Configuration') {
                              openCodeBlock('editContextMenu');
                            } else if (child === 'Set Layer Display Level') {
                              openCodeBlock('setLayerDisplayLevel');
                            } else if (child === 'Set Layer Style') {
                              openCodeBlock('setLayerStyle');
                            } else if (child === 'Set Layer Style Default') {
                              openCodeBlock('setLayerStyleDefault');
                            } else if (child === 'Set Thematics') {
                              console.log('Set Thematics clicked!');
                              openCodeBlock('setThematics');
                            } else if (child === 'Set Layer Opacity (레이어 투명도 설정)') {
                              console.log('Set Layer Opacity clicked!');
                              openCodeBlock('setLayerOpacity');
                            } else if (child === 'Get Layer Opacity (레이어 투명도 조회)') {
                              console.log('Get Layer Opacity clicked!');
                              openCodeBlock('getLayerOpacity');
                            } else if (child === 'Reset Layer Opacity (레이어 투명도 초기화)') {
                              console.log('Reset Layer Opacity clicked!');
                              openCodeBlock('resetLayerOpacity');
                            } else if (child === 'Clear select layer') {
                              console.log('Clear select layer clicked!');
                              openCodeBlock('clearSelectLayer');
                            } else if (child === 'Select') {
                              openCodeBlock('select');
                            } else if (child === 'Advanced Select') {
                              openCodeBlock('advancedSelect');
                            } else if (child === 'Trail Distance') {
                              openCodeBlock('trailDistance');
                            } else if (child === 'Trail Area') {
                              openCodeBlock('trailArea');
                            } else if (child === 'Trail Simple') {
                              openCodeBlock('trailSimple');
                            } else if (child === 'Area Draw Rect') {
                              openCodeBlock('areaDrawRect');
                            } else if (child === 'Area Draw Circle') {
                              openCodeBlock('areaDrawCircle');
                            } else if (child === 'Area Draw Polygon') {
                              openCodeBlock('areaDrawPolygon');
                            } else if (child === 'Get Selected Features') {
                              openCodeBlock('getSelectedFeatures');
                            } else if (child === 'Get Trail coordinate') {
                              openCodeBlock('getTrailCoordinate');
                            } else if (child === 'Trail Draw Line') {
                              openCodeBlock('trailDrawLine');
                            } else if (child === 'Advanced Trail Draw Line') {
                              openCodeBlock('advancedTrailDrawLine');
                            } else if (child === 'Trail Draw Point') {
                              openCodeBlock('trailDrawPoint');
                            } else if (child === 'Trail Draw Polygon') {
                              openCodeBlock('trailDrawPolygon');
                                  } else if (child === 'Advanced Trail Draw Point') {
        openCodeBlock('advancedTrailDrawPoint');
      } else if (child === 'Advanced Trail Draw Polygon') {
        openCodeBlock('advancedTrailDrawPolygon');
                            } else if (child === 'Trail Edit') {
                              openCodeBlock('trailEdit');
                            } else if (child === 'Trail Delete') {
                              openCodeBlock('trailDelete');
                            } else if (child === 'Rect Selection') {
                              openCodeBlock('rectSelection');
                            } else if (child === 'Circle Selection') {
                              openCodeBlock('circleSelection');
                            } else if (child === 'Polygon Selection') {
                              openCodeBlock('polygonSelection');
                            }
                          }}
                          onMouseOver={e => {
                            (e.currentTarget as HTMLLIElement).style.background = '#f0f4fa';
                            (e.currentTarget as HTMLLIElement).style.color = state.highlightMoveMenu.includes(child) || state.blueMoveMenu.includes(child) ? '#b71c1c' : '#0071e3';
                            (e.currentTarget as HTMLLIElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                          }}
                          onMouseOut={e => {
                            (e.currentTarget as HTMLLIElement).style.background = 'transparent';
                            (e.currentTarget as HTMLLIElement).style.color = state.highlightMoveMenu.includes(child) || state.blueMoveMenu.includes(child) ? '#d32f2f' : '#222';
                            (e.currentTarget as HTMLLIElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLLIElement).style.transform = 'scale(1)';
                          }}
                        >
                          {child}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>
        {state.isToggleActivated && (
          <button
            onClick={() => state.setShowMenu(v => !v)}
            style={{
              position: 'absolute',
              top: state.menuCenter - 19, // 38px 버튼의 중앙
              left: state.showMenu ? 270 : 0,
              transform: 'translateY(0)',
              width: 38,
              height: 38,
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #e5e5e7',
              borderRadius: '50%',
              color: '#888',
              fontSize: 22,
              cursor: 'pointer',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              outline: 'none',
              transition: 'background 0.18s, color 0.18s, left 0.5s cubic-bezier(.4,0,.2,1), top 0.3s cubic-bezier(.4,0,.2,1)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#f0f4fa';
              e.currentTarget.style.color = '#0071e3';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
              e.currentTarget.style.color = '#888';
            }}
          >
            {state.showMenu ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
          </button>
        )}
      </div>
      {state.isCodeBlockVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 12,
            right: 12,
            zIndex: 9999,
            background: '#1e1e1e',
            padding: 0,
            borderRadius: 12,
            maxWidth: 800,
            minWidth: 340,
            maxHeight: '65vh',
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            opacity: state.isCodeBlockActive ? 1 : 0,
            transform: state.isCodeBlockActive ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.98)',
            transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)',
            pointerEvents: state.isCodeBlockActive ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 코드 샘플 렌더링 */}
          {(() => {
            let codeSample = '';
            if (state.codeBlockType === 'center') codeSample = getScreenCenterPointSample;
            else if (state.codeBlockType === 'zoom') codeSample = getCurrentZoomLevelSample;
            else if (state.codeBlockType === 'minzoom') codeSample = getMinZoomLevelSample;
            else if (state.codeBlockType === 'maxzoom') codeSample = getMaxZoomLevelSample;
            else if (state.codeBlockType === 'movecenter') codeSample = moveCenterPointSample;
            else if (state.codeBlockType === 'movecenterzoom') codeSample = moveCenterPointAndChangeLevelSample;
            else if (state.codeBlockType === 'movearea') codeSample = moveAreaSample;
            else if (state.codeBlockType === 'prevscreen') codeSample = prevScreenSample;
            else if (state.codeBlockType === 'forwardscreen') codeSample = forwardScreenSample;
            else if (state.codeBlockType === 'zoomin') codeSample = zoomInMapSample;
            else if (state.codeBlockType === 'zoomout') codeSample = zoomOutMapSample;
            else if (state.codeBlockType === 'adjustscale') codeSample = adjustScaleSample;
            else if (state.codeBlockType === 'panby') codeSample = panBySample;
            else if (state.codeBlockType === 'panto') codeSample = panToSample;
            else if (state.codeBlockType === 'fitbounds') codeSample = fitBoundsSample;
            else if (state.codeBlockType === 'getbounds') codeSample = getBoundsSample;
            else if (state.codeBlockType === 'setzoom') codeSample = setZoomSample;
            else if (state.codeBlockType === 'resetView') codeSample = resetViewSample;
            else if (state.codeBlockType === 'copyView') codeSample = copyViewSample;
            else if (state.codeBlockType === 'rotateMap') codeSample = rotateMapSample;
            else if (state.codeBlockType === 'exportMapImage') codeSample = exportMapImageSample;
            else if (state.codeBlockType === 'getLayer') codeSample = getLayerSample;
            else if (state.codeBlockType === 'externalLayerName') codeSample = getExternalLayerNameSample;
            else if (state.codeBlockType === 'tableNameOfLayer') codeSample = getTableNameOfLayerSample;
            else if (state.codeBlockType === 'minDisplayZoomLevel') codeSample = getMinDisplayZoomLevelSample;
            else if (state.codeBlockType === 'maxDisplayZoomLevel') codeSample = getMaxDisplayZoomLevelSample;
            else if (state.codeBlockType === 'selectableFacility') codeSample = getSelectableFacilitySample;
            else if (state.codeBlockType === 'viewLayerInfo') codeSample = viewLayerInfoSample;
            else if (state.codeBlockType === 'toggleDisplayHide') codeSample = toggleDisplayHideSample;
            else if (state.codeBlockType === 'refreshLayer') codeSample = refreshLayerSample;
            else if (state.codeBlockType === 'addUserLayer') codeSample = addUserLayerSample;
            else if (state.codeBlockType === 'initUserLayer') codeSample = initUserLayerSample;
            else if (state.codeBlockType === 'deleteUserLayer') codeSample = deleteUserLayerSample;
            else if (state.codeBlockType === 'entireAreaUserLayer') codeSample = entireAreaUserLayerSample;
            else if (state.codeBlockType === 'defaultContextMenu') codeSample = defaultContextMenuSample;
            else if (state.codeBlockType === 'editContextMenu') codeSample = editContextMenuSample;
            else if (state.codeBlockType === 'setLayerDisplayLevel') codeSample = setLayerDisplayLevelSample;
            else if (state.codeBlockType === 'setLayerStyle') codeSample = setLayerStyleSample;
            else if (state.codeBlockType === 'setLayerStyleDefault') codeSample = setLayerStyleDefaultSample;
            else if (state.codeBlockType === 'setThematics') codeSample = setThematicsSample;
            else if (state.codeBlockType === 'select') codeSample = selectSample;
            else if (state.codeBlockType === 'advancedSelect') codeSample = advancedSelectSample;
            else if (state.codeBlockType === 'trailDistance') codeSample = trailDistanceSample;
            else if (state.codeBlockType === 'trailArea') codeSample = trailAreaSample;
            else if (state.codeBlockType === 'trailSimple') codeSample = trailSimpleSample;
            else if (state.codeBlockType === 'areaDrawRect') codeSample = areaDrawRectSample;
            else if (state.codeBlockType === 'areaDrawCircle') codeSample = areaDrawCircleSample;
            else if (state.codeBlockType === 'areaDrawPolygon') codeSample = areaDrawPolygonSample;
            else if (state.codeBlockType === 'getSelectedFeatures') codeSample = getSelectedFeaturesSample;
            else if (state.codeBlockType === 'getTrailCoordinate') codeSample = getTrailCoordinateSample;
            else if (state.codeBlockType === 'trailDrawLine') codeSample = trailDrawLineSample;
            else if (state.codeBlockType === 'advancedTrailDrawLine') codeSample = advancedTrailDrawLineSample;
            else if (state.codeBlockType === 'trailDrawPoint') codeSample = trailDrawPointSample;
else if (state.codeBlockType === 'advancedTrailDrawPoint') codeSample = advancedTrailDrawPointSample;
else if (state.codeBlockType === 'trailDrawPolygon') codeSample = trailDrawPolygonSample;
            else if (state.codeBlockType === 'advancedTrailDrawPolygon') codeSample = advancedTrailDrawPolygonSample;
            else if (state.codeBlockType === 'trailEdit') codeSample = trailEditSample;
            else if (state.codeBlockType === 'trailDelete') codeSample = trailDeleteSample;
            else if (state.codeBlockType === 'rectSelection') codeSample = rectSelectionSample;
            else if (state.codeBlockType === 'polygonSelection') codeSample = polygonSelectionSample;
            else if (state.codeBlockType === 'clearSelectLayer') codeSample = clearSelectLayerSample;
            else if (state.codeBlockType === 'circleSelection') codeSample = circleSelectionSample;
            else if (state.codeBlockType === 'setLayerOpacity') codeSample = setLayerOpacitySample;
            else if (state.codeBlockType === 'getLayerOpacity') codeSample = getLayerOpacitySample;
            else if (state.codeBlockType === 'resetLayerOpacity') codeSample = resetLayerOpacitySample;
            // 전역 변수로 설정하여 실행 버튼에서 접근 가능하도록 함
            (window as any).currentCodeSample = codeSample;
            return null;
          })()}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#222',
              padding: '14px 32px 10px 32px',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 17,
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {state.codeBlockType === 'center'
                ? 'Get Screen Center Point 코드 예시'
                : state.codeBlockType === 'zoom'
                ? 'Get Current Zoom Level 코드 예시'
                : state.codeBlockType === 'minzoom'
                ? 'Get Minimum Zoom Level 코드 예시'
                : state.codeBlockType === 'maxzoom'
                ? 'Get Max Zoom Level 코드 예시'
                : state.codeBlockType === 'movecenter'
                ? 'Move Center Point 코드 예시'
                : state.codeBlockType === 'movecenterzoom'
                ? 'Move Center Point and Change Level 코드 예시'
                : state.codeBlockType === 'movearea'
                ? 'Move Area 코드 예시'
                : state.codeBlockType === 'prevscreen'
                ? 'Previous Screen 코드 예시'
                : state.codeBlockType === 'forwardscreen'
                ? 'Forward Screen 코드 예시'
                : state.codeBlockType === 'zoomin'
                ? 'Zoom In Map 코드 예시'
                : state.codeBlockType === 'zoomout'
                ? 'Zoom Out Map 코드 예시'
                : state.codeBlockType === 'adjustscale'
                ? 'Adjust Scale 코드 예시'
                : state.codeBlockType === 'panby'
                ? 'Pan By (픽셀 단위 이동) 코드 예시'
                : state.codeBlockType === 'panto'
                ? 'Pan To (애니메이션 중심+줌 이동) 코드 예시'
                : state.codeBlockType === 'fitbounds'
                ? 'Fit Bounds (범용 영역 맞춤) 코드 예시'
                : state.codeBlockType === 'getbounds'
                ? 'Get Current Extent (현재 화면 extent 반환) 코드 예시'
                : state.codeBlockType === 'setzoom'
                ? 'Set Zoom (애니메이션) 코드 예시'
                : state.codeBlockType === 'resetView'
                ? 'Reset View (초기화) 코드 예시'
                : state.codeBlockType === 'copyView'
                ? 'Copy View State (클립보드 복사) 코드 예시'
                : state.codeBlockType === 'rotateMap'
                ? 'Rotate Map (지도 회전) 코드 예시'
                : state.codeBlockType === 'exportMapImage'
                ? 'Export Map as Image (지도 이미지 저장) 코드 예시'
                : state.codeBlockType === 'getLayer'
                ? 'Get Layer 코드 예시'
                : state.codeBlockType === 'externalLayerName'
                ? 'External Layer Name 코드 예시'
                : state.codeBlockType === 'tableNameOfLayer'
                ? 'Table Name of Layer 코드 예시'
                : state.codeBlockType === 'minDisplayZoomLevel'
                ? 'Minimum Display Zoom Level 코드 예시'
                : state.codeBlockType === 'maxDisplayZoomLevel'
                ? 'Maximum Display Zoom Level 코드 예시'
                : state.codeBlockType === 'selectableFacility'
                ? 'Selectable Facility 코드 예시'
                : state.codeBlockType === 'viewLayerInfo'
                ? 'View Layer Information 코드 예시'
                : state.codeBlockType === 'toggleDisplayHide'
                ? 'Toggle Display/Hide (레이어 표시/숨김 토글) 코드 예시'
                : state.codeBlockType === 'refreshLayer'
                ? 'Refresh Layer (레이어 새로고침) 코드 예시'
                : state.codeBlockType === 'addUserLayer'
                ? 'Add User Layer Feature 코드 예시'
                : state.codeBlockType === 'initUserLayer'
                ? 'Initialize User Layer 코드 예시'
                : state.codeBlockType === 'deleteUserLayer'
                ? 'Delete User Layer 코드 예시'
                : state.codeBlockType === 'entireAreaUserLayer'
                ? 'Entire Area of User Layer 코드 예시'
                : state.codeBlockType === 'defaultContextMenu'
                ? 'Default Right-Click Menu Configuration 코드 예시'
                : state.codeBlockType === 'editContextMenu'
                ? 'Edit Mode Right-Click Menu Configuration 코드 예시'
                : state.codeBlockType === 'setLayerOpacity'
                ? 'Set Layer Opacity (레이어 투명도 설정) 코드 예시'
                : state.codeBlockType === 'getLayerOpacity'
                ? 'Get Layer Opacity (레이어 투명도 조회) 코드 예시'
                : state.codeBlockType === 'resetLayerOpacity'
                ? 'Reset Layer Opacity (레이어 투명도 초기화) 코드 예시'
                : state.codeBlockType === 'setLayerDisplayLevel'
                ? 'Set Layer Display Level 코드 예시'
                : state.codeBlockType === 'setLayerStyle'
                ? 'Set Layer Style 코드 예시'
                : state.codeBlockType === 'setLayerStyleDefault'
                ? 'Set Layer Style Default 코드 예시'
                : state.codeBlockType === 'select'
                ? 'Select 코드 예시'
                : state.codeBlockType === 'trailDistance'
                ? 'Trail Distance 코드 예시'
                : state.codeBlockType === 'trailArea'
                ? 'Trail Area 코드 예시'
                : state.codeBlockType === 'trailSimple'
                ? 'Trail Simple (간단한 선 그리기) 코드 예시'
                : state.codeBlockType === 'areaDrawRect'
                ? 'Area Draw Rect (사각형 영역 그리기) 코드 예시'
                : state.codeBlockType === 'areaDrawCircle'
                ? 'Area Draw Circle (원형 영역 그리기) 코드 예시'
                : state.codeBlockType === 'areaDrawPolygon'
                ? 'Area Draw Polygon (다각형 영역 그리기) 코드 예시'
                : state.codeBlockType === 'getSelectedFeatures'
                ? 'Get Selected Features (선택된 피처 가져오기) 코드 예시'
                : state.codeBlockType === 'getTrailCoordinate'
                ? 'Get Trail coordinate (트레일 좌표 가져오기) 코드 예시'
                : state.codeBlockType === 'trailDrawLine'
                ? 'Trail Draw Line (선형 그리기) 코드 예시'
                : state.codeBlockType === 'advancedTrailDrawLine'
                ? 'Advanced Trail Draw Line (스냅 기능이 포함된 고급 선형 그리기) 코드 예시'
                : state.codeBlockType === 'trailDrawPoint'
                ? 'Trail Draw Point (점 그리기) 코드 예시'
                : state.codeBlockType === 'advancedTrailDrawPoint'
                ? 'Advanced Trail Draw Point (스냅 기능이 포함된 고급 점 그리기) 코드 예시'
                : state.codeBlockType === 'trailDrawPolygon'
                ? 'Trail Draw Polygon (다각형 그리기) 코드 예시'
                : state.codeBlockType === 'advancedTrailDrawPolygon'
                ? 'Advanced Trail Draw Polygon (고급 다각형 그리기) 코드 예시'
                : state.codeBlockType === 'trailEdit'
                ? 'Trail Edit (선형 객체 편집) 코드 예시'
                : state.codeBlockType === 'trailDelete'
                ? 'Trail Delete (피처 삭제) 코드 예시'
                : state.codeBlockType === 'rectSelection'
                ? 'Rect Selection 코드 예시'
                : state.codeBlockType === 'circleSelection'
                ? 'Circle Selection 코드 예시'
                : state.codeBlockType === 'polygonSelection'
                ? 'Polygon Selection 코드 예시'
                : state.codeBlockType === 'clearSelectLayer'
                ? 'Clear Select Layer 코드 예시'
                : state.codeBlockType === 'setThematics'
                ? 'Set Thematics 코드 예시'
                : state.codeBlockType === 'advancedSelect'
                ? 'Advanced Select 코드 예시'
                : state.codeBlockType === 'circleSelection'
                ? 'Circle Selection 코드 예시'
                : ''}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={async () => {
                  if (state.codeBlockType === 'selectableFacility') {
                    const result = await handleGetSelectableStatus('polygonHump', useMapbase);
                    if (result && result.success && result.isSelectable !== undefined) {
                      let resultText = '=== 레이어 선택 가능 여부 ===\n\n';
                      resultText += 'polygonHump: ' + (result.isSelectable ? '✅ 선택 가능' : '❌ 선택 불가') + '\n';
                      alert(resultText);
                    }
                  }
                  else if (state.codeBlockType === 'viewLayerInfo') {
                    const result = await handleGetViewLayerInfo('polygonHump', useMapbase);
                    if (result && result.success && result.properties) {
                      alert(JSON.stringify(result.properties, null, 2));
                    }
                  }
                  else if (state.codeBlockType === 'toggleDisplayHide') {
                    const result = await handleToggleDisplayHide('polygonHump', useMapbase);
                    if (result && result.success) {
                      alert(result.message);
                    }
                  }
                  else if (state.codeBlockType === 'defaultContextMenu') await handleRunDefaultContextMenuCode();
                  else if (state.codeBlockType === 'editContextMenu') await handleRunEditContextMenuCode();
                  else if (state.codeBlockType === 'refreshLayer') await handleRunRefreshLayerCode();
                  else if (state.codeBlockType === 'addUserLayer') await handleRunAddUserLayerCode();
                  else if (state.codeBlockType === 'initUserLayer') await handleRunInitUserLayerCode();
                  else if (state.codeBlockType === 'deleteUserLayer') await handleRunDeleteUserLayerCode();
                  else if (state.codeBlockType === 'entireAreaUserLayer') await handleRunEntireAreaUserLayerCode();
                  else if (state.codeBlockType === 'setLayerDisplayLevel') await handleRunSetLayerDisplayLevelCode();
                  else if (state.codeBlockType === 'setLayerStyle') await handleRunSetLayerStyleCode();
                  else if (state.codeBlockType === 'setLayerStyleDefault') await handleRunSetLayerStyleDefaultCode();
                  else if (state.codeBlockType === 'clearSelectLayer') {
                    try {
                      clearSelectLayer();
                      alert('선택된 피처들이 초기화되었습니다.');
                    } catch (error) {
                      console.error('Clear Select Layer 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'setThematics') await handleRunSetThemematicsCode();
                  else if (state.codeBlockType === 'advancedSelect') await handleRunAdvancedSelectCode();
                  else if (state.codeBlockType === 'rectSelection') {
                    try {
                      activateRectSelectionMode(state.mapRef.current, layerData || []);
                      alert('Rect Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');
                    } catch (error) {
                      console.error('Rect Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'circleSelection') {
                    try {
                      activateCircleSelectionMode(state.mapRef.current, layerData || []);
                      alert('Circle Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');
                    } catch (error) {
                      console.error('Circle Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'polygonSelection') {
                    try {
                      activatePolygonSelectionMode(state.mapRef.current, layerData || []);
                      alert('Polygon Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\n더블클릭으로 그리기를 완료하세요.');
                    } catch (error) {
                      console.error('Polygon Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailDistance') {
                    try {
                      activateTrailDistanceMode(state.mapRef.current);
                      alert('Trail Distance(거리 측정) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Trail Distance 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailArea') {
                    try {
                      activateTrailAreaMode(state.mapRef.current);
                      alert('Trail Area(면적 측정) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Trail Area 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'areaDrawRect') {
                    try {
                      activateAreaDrawRectMode({
                        style: {
                          color: 'red',
                          fillColor: 'blue',
                          weight: 4,
                          fill: true,
                          fillOpacity: 0.4,
                        },
                      });
                      alert('Area Draw Rect(사각형 영역 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Area Draw Rect 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'areaDrawCircle') {
                    try {
                      activateAreaDrawCircleMode({
                        style: {
                          color: 'red',
                          fillColor: 'blue',
                          weight: 4,
                          fill: true,
                          fillOpacity: 0.4,
                        },
                      });
                      alert('Area Draw Circle(원형 영역 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Area Draw Circle 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'areaDrawPolygon') {
                    try {
                      activateAreaDrawPolygonMode({
                        style: {
                          color: 'red',
                          fillColor: 'blue',
                          weight: 4,
                          fill: true,
                          fillOpacity: 0.4,
                        },
                      });
                      alert('Area Draw Polygon(다각형 영역 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Area Draw Polygon 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailDrawPoint') {
                    try {
                      activateTrailDrawPointMode({
                        showNodeTypeSelectorPopup: showNodeTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          state.drawnFeatureRef.current = feature;
                        }
                      });
                      alert('Trail Draw Point(점 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Trail Draw Point 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailDrawLine') {
                    try {
                      activateTrailDrawLineMode({
                        showLineTypeSelectorPopup: showLineTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          state.drawnFeatureRef.current = feature;
                        }
                      });
                      alert('Trail Draw Line(선형 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Trail Draw Line 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailDrawPolygon') {
                    try {
                      activateTrailDrawPolygonMode({
                        showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup,
                        setDrawnFeature: (feature: any) => {
                          state.drawnFeatureRef.current = feature;
                        }
                      });
                      alert('Trail Draw Polygon(다각형 그리기) 모드가 활성화되었습니다.');
                    } catch (error) {
                      console.error('Trail Draw Polygon 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'trailDelete') {
                    try {
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
                      const result = await layerDelete.deleteFeature({ feature: selectedFeature });
                      if (result.success) {
                        alert('피처가 성공적으로 삭제되었습니다.');
                        useMapbase.getState().setSelectedFeatures([]);
                        const layers = state.mapRef.current?.getLayers().getArray() || [];
                        layers.forEach(layer => {
                          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
                            const source = layer.getSource();
                            if (source && source.refresh) {
                              console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
                              source.refresh();
                            }
                          }
                        });
                      } else {
                        alert('삭제 실패: ' + result.message);
                      }
                    } catch (error) {
                      console.error('🗑️ 삭제 중 오류:', error);
                      alert('삭제 중 오류가 발생했습니다.');
                    } finally {
                      state.setIsCodeBlockActive(false);
                      setTimeout(() => {
                        state.setIsCodeBlockVisible(false);
                        state.setCodeBlockType(null);
                      }, 500);
                    }
                  }
                                      else if (state.codeBlockType === 'setLayerOpacity') await handleRunSetLayerOpacityCode();
            // Navigation 기능들 - fe6_2와 동일하게 new Function으로 샘플 코드 실행
            else if (state.codeBlockType === 'center') await handleRunGetCenterCode();
            else if (state.codeBlockType === 'zoom') await handleRunGetZoomCode();
            else if (state.codeBlockType === 'minzoom') await handleRunGetMinZoomCode();
            else if (state.codeBlockType === 'maxzoom') await handleRunGetMaxZoomCode();
            else if (state.codeBlockType === 'movecenter') await handleRunMoveCenterCode();
            else if (state.codeBlockType === 'movecenterzoom') await handleRunMoveCenterZoomCode();
            else if (state.codeBlockType === 'movearea') await handleRunMoveAreaCode();
            else if (state.codeBlockType === 'prevscreen') await handleRunPrevScreenCode();
            else if (state.codeBlockType === 'forwardscreen') await handleRunForwardScreenCode();
            else if (state.codeBlockType === 'zoomin') await handleRunZoomInCode();
            else if (state.codeBlockType === 'zoomout') await handleRunZoomOutCode();
            else if (state.codeBlockType === 'adjustscale') await handleRunAdjustScaleCode();
            else if (state.codeBlockType === 'panby') await handleRunPanByCode();
            else if (state.codeBlockType === 'panto') await handleRunPanToCode();
            else if (state.codeBlockType === 'fitbounds') await handleRunFitBoundsCode();
            else if (state.codeBlockType === 'getbounds') await handleRunGetBoundsCode();
            else if (state.codeBlockType === 'setzoom') await handleRunSetZoomCode();
            else if (state.codeBlockType === 'resetView') await handleRunResetViewCode();
            else if (state.codeBlockType === 'copyView') await handleRunCopyViewCode();
            else if (state.codeBlockType === 'rotateMap') await handleRunRotateMapCode();
            else if (state.codeBlockType === 'exportMapImage') await handleRunExportMapImageCode();
            
            // LayerManagement 기능들
            else if (state.codeBlockType === 'getLayer') handleGetLayer();
            else if (state.codeBlockType === 'externalLayerName') await handleRunGetExternalLayerNameCode();
            else if (state.codeBlockType === 'tableNameOfLayer') await handleRunGetTableNameOfLayerCode();
            else if (state.codeBlockType === 'minDisplayZoomLevel') await handleRunGetMinDisplayZoomLevelCode();
            else if (state.codeBlockType === 'maxDisplayZoomLevel') await handleRunGetMaxDisplayZoomLevelCode();
            else if (state.codeBlockType === 'selectableFacility') await handleRunSelectableFacilityCode();
            else if (state.codeBlockType === 'viewLayerInfo') handleGetViewLayerInfo();
            else if (state.codeBlockType === 'toggleDisplayHide') await handleRunToggleDisplayHideCode();
            else if (state.codeBlockType === 'refreshLayer') await handleRunRefreshLayerCode();
            else if (state.codeBlockType === 'getLayerOpacity') await handleRunGetLayerOpacityCode();
            else if (state.codeBlockType === 'resetLayerOpacity') await handleRunResetLayerOpacityCode();
                  else if (state.codeBlockType === 'select') {
                    try {
                      activateSelectMode(state.mapRef.current);
                      alert('Select 모드가 활성화되었습니다.\n지도에서 피처를 클릭하여 선택할 수 있습니다.');
                    } catch (error) {
                      console.error('Select 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'advancedSelect') {
                    try {
                      activateAdvancedSelectMode(state.mapRef.current);
                      alert('Advanced Select 모드가 활성화되었습니다.\n지도에서 피처를 클릭하여 선택할 수 있습니다.');
                    } catch (error) {
                      console.error('Advanced Select 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'rectSelection') {
                    try {
                      activateRectSelectionMode(state.mapRef.current);
                      alert('Rect Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');
                    } catch (error) {
                      console.error('Rect Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'circleSelection') {
                    try {
                      activateCircleSelectionMode(state.mapRef.current);
                      alert('Circle Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');
                    } catch (error) {
                      console.error('Circle Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'polygonSelection') {
                    try {
                      activatePolygonSelectionMode(state.mapRef.current);
                      alert('Polygon Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\n더블클릭으로 그리기를 완료하세요.');
                    } catch (error) {
                      console.error('Polygon Selection 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                  else if (state.codeBlockType === 'clearSelectLayer') {
                    try {
                      clearSelectLayer();
                      alert('선택된 피처들이 초기화되었습니다.');
                    } catch (error) {
                      console.error('Clear Select Layer 실행 중 오류:', error);
                      alert('실행 오류: ' + error);
                    }
                  }
                              else if (state.codeBlockType === 'getSelectedFeatures') {
              handleRunGetSelectedFeaturesCode();
            }
            else if (state.codeBlockType === 'trailSimple') {
              handleRunTrailSimpleCode();
            }
                  else if (state.codeBlockType === 'rectSelection') {
                    handleRunRectSelectionCode();
                  } else if (state.codeBlockType === 'circleSelection') {
                    handleRunCircleSelectionCode();
                  } else if (state.codeBlockType === 'polygonSelection') {
                    handleRunPolygonSelectionCode();
                  } else if (state.codeBlockType === 'areaDrawRect') {
                    handleRunAreaDrawRectCode();
                  } else if (state.codeBlockType === 'areaDrawCircle') {
                    handleRunAreaDrawCircleCode();
                  } else if (state.codeBlockType === 'areaDrawPolygon') {
                    handleRunAreaDrawPolygonCode();
                  } else if (state.codeBlockType === 'trailDrawLine') {
                    handleRunTrailDrawLineCode();
                  } else if (state.codeBlockType === 'advancedTrailDrawLine') {
                    handleRunAdvancedTrailDrawLineCode();
                  } else if (state.codeBlockType === 'trailDrawPoint') {
                    handleRunTrailDrawPointCode();
                  } else if (state.codeBlockType === 'advancedTrailDrawPoint') {
                    handleRunAdvancedTrailDrawPointCode();
                  } else if (state.codeBlockType === 'trailDrawPolygon') {
                    handleRunTrailDrawPolygonCode();
                  } else if (state.codeBlockType === 'advancedTrailDrawPolygon') {
                    handleRunAdvancedTrailDrawPolygonCode();
                  } else if (state.codeBlockType === 'trailEdit') {
                    handleRunTrailEditCode();
                  } else if (state.codeBlockType === 'trailDelete') {
                    handleRunTrailDeleteCode();
                  } else if ((window as any).currentCodeSample) {
                    try {
                      const asyncFunc = new Function('mapRef', 'useMapbase', 'getListFeaturesInPixel', 'mapHistory', 'handlePanBy', 'handleAdjustScale', 'handlePanTo', 'handleFitBounds', 'handleGetBounds', 'handleSetZoom', 'handleResetView', 'handleRotateMap', 'handleGetLayer', 'handleGetExternalLayerName', 'handleGetTableNameOfLayer', 'handleGetMinDisplayZoomLevel', 'handleGetMaxDisplayZoomLevel', 'handleGetSelectableStatus', (window as any).currentCodeSample);
                      
                      asyncFunc(state.mapRef.current, useMapbase, getListFeaturesInPixel, mapHistory, handlePanBy, handleAdjustScale, handlePanTo, handleFitBounds, handleGetBounds, handleSetZoom, handleResetView, handleRotateMap, handleGetLayer, (layerId?: string) => handleGetExternalLayerName(layerId, useMapbase), (layerId?: string) => handleGetTableNameOfLayer(layerId, useMapbase), (layerId?: string) => handleGetMinDisplayZoomLevel(layerId, useMapbase), (layerId?: string) => handleGetMaxDisplayZoomLevel(layerId, useMapbase), (layerId?: string) => handleGetSelectableStatus(layerId, useMapbase));
                      
                      // movecenter, movecenterzoom, movearea, prevscreen, forwardscreen, zoomin, zoomout, adjustscale, panby, panto, fitbounds, getbounds, setzoom, resetView, rotateMap, rectSelection, circleSelection, polygonSelection, trailSimple, areaDrawRect, areaDrawCircle 타입일 때는 에디터 박스를 닫지 않음
                      if (state.codeBlockType !== 'movecenter' && state.codeBlockType !== 'movecenterzoom' && state.codeBlockType !== 'movearea' && state.codeBlockType !== 'prevscreen' && state.codeBlockType !== 'forwardscreen' && state.codeBlockType !== 'zoomin' && state.codeBlockType !== 'zoomout' && state.codeBlockType !== 'adjustscale' && state.codeBlockType !== 'panby' && state.codeBlockType !== 'panto' && state.codeBlockType !== 'fitbounds' && state.codeBlockType !== 'getbounds' && state.codeBlockType !== 'setzoom' && state.codeBlockType !== 'resetView' && state.codeBlockType !== 'rotateMap' && state.codeBlockType !== 'rectSelection' && state.codeBlockType !== 'circleSelection' && state.codeBlockType !== 'polygonSelection' && state.codeBlockType !== 'trailSimple' && state.codeBlockType !== 'areaDrawRect' && state.codeBlockType !== 'areaDrawCircle' && state.codeBlockType !== 'areaDrawPolygon' && state.codeBlockType !== 'getSelectedFeatures' && state.codeBlockType !== 'getTrailCoordinate' && state.codeBlockType !== 'trailDrawLine' && state.codeBlockType !== 'trailDrawPoint' && state.codeBlockType !== 'trailDrawPolygon') {
                        state.setIsCodeBlockActive(false);
                        setTimeout(() => {
                          state.setIsCodeBlockVisible(false);
                          state.setCodeBlockType(null);
                        }, 500);
                      }
                    } catch (err) {
                      console.error('실행 오류:', err);
                      alert('실행 오류: ' + err);
                    }
                  } else {
                    alert('실행할 코드가 없습니다. codeBlockType: ' + state.codeBlockType);
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: 'none',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginRight: 8,
                  marginLeft: 18,
                  transition: 'background 0.18s, color 0.18s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  outline: 'none',
                  padding: 0,
                  fontSize: 18,
                }}
                aria-label="실행"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.32)';
                  e.currentTarget.style.color = '#0071e3';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="5,3 13,8 5,13" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={handleCloseCodeBlock}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: 'none',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: 0,
                  transition: 'background 0.18s, color 0.18s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  outline: 'none',
                  padding: 0,
                }}
                aria-label="코드 닫기"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.32)';
                  e.currentTarget.style.color = '#222';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div style={{ 
            padding: 24, 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
            <SyntaxHighlighter
              language="tsx"
              style={vscDarkPlus}
              customStyle={{ 
                borderRadius: 8, 
                fontSize: 15, 
                background: '#1e1e1e', 
                margin: 0,
                minHeight: 'auto'
              }}
            >
              {codeSample}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
      
      {/* 편집 모드 OFF 버튼 */}
      {state.isEditModeActive && (
        <div
          style={{
            position: 'absolute',
            left: state.editModePosition.x,
            top: state.editModePosition.y,
            zIndex: 2000,
            background: 'rgba(128, 128, 128, 0.9)',
            border: '1px solid #666',
            borderRadius: '4px',
            padding: '4px 8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '500',
            color: '#fff',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(4px)',
            userSelect: 'none',
            opacity: state.showEditModeButton ? 0.9 : 0,
            transform: state.showEditModeButton ? 'scale(1)' : 'scale(0.8)',
            pointerEvents: state.showEditModeButton ? 'auto' : 'none',
          }}
          onClick={cleanupEditMode}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 71, 87, 0.9)';
            e.currentTarget.style.borderColor = '#ff4757';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(128, 128, 128, 0.9)';
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '0.9';
          }}
        >
          Edit Off
        </div>
      )}
      
      {/* 노드 타입 선택기 */}
      {state.showNodeTypeSelector && state.drawnPointPixel && (
        <div
          style={{
            position: 'absolute',
            left: state.drawnPointPixel[0] + 10,
            top: state.drawnPointPixel[1] - 10,
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
            value={state.selectedNodeType}
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
            {state.availableNodeTypes.map((nodeType) => (
              <option key={nodeType.value} value={nodeType.value}>
                {nodeType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveClick}
            disabled={!state.selectedNodeType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: state.selectedNodeType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: state.selectedNodeType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              state.setShowNodeTypeSelector(false);
              state.setSelectedNodeType('');
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

      {/* 라인 타입 선택기 */}
      {state.showLineTypeSelector && state.drawnLinePixel && (
        <div
          style={{
            position: 'absolute',
            left: state.drawnLinePixel[0] + 10,
            top: state.drawnLinePixel[1] - 10,
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
            value={state.selectedLineType}
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
            {state.availableLineTypes.map((lineType) => (
              <option key={lineType.value} value={lineType.value}>
                {lineType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleLineSaveClick}
            disabled={!state.selectedLineType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: state.selectedLineType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: state.selectedLineType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              state.setShowLineTypeSelector(false);
              state.setSelectedLineType('');
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

      {/* 폴리곤 타입 선택기 */}
      {state.showPolygonTypeSelector && state.drawnPolygonPixel && (
        <div
          style={{
            position: 'absolute',
            left: state.drawnPolygonPixel[0] + 10,
            top: state.drawnPolygonPixel[1] - 10,
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
            value={state.selectedPolygonType}
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
            {state.availablePolygonTypes.map((polygonType) => (
              <option key={polygonType.value} value={polygonType.value}>
                {polygonType.label}
              </option>
            ))}
          </select>
          <button
            onClick={handlePolygonSaveClick}
            disabled={!state.selectedPolygonType}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #007bff',
              borderRadius: '4px',
              background: state.selectedPolygonType ? '#007bff' : '#ccc',
              color: 'white',
              cursor: state.selectedPolygonType ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              state.setShowPolygonTypeSelector(false);
              state.setSelectedPolygonType('');
              
              // 그린 feature 정리
              if (state.drawLayerRef.current) {
                const source = state.drawLayerRef.current.getSource();
                source.clear(); // 그린 feature들 제거
              }
              state.drawnFeatureRef.current = null;
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

      {/* 레이어 컨트롤 패널 */}
      <LayerControl 
        isVisible={state.showLayerControl}
        onToggle={handleToggleLayerControl}
        layerData={state.layerData}
        checkedLayers={state.checkedLayers}
        onLayerChange={handleLayerCheckboxChange}
        onShowAllLayers={handleShowAllLayers}
        onHideAllLayers={handleHideAllLayers}
        position={state.layerControlPosition}
        onDragStart={handleDragStart}
        isDragging={state.isDragging}
        hasMoved={state.hasMoved}
      />

      {/* 우클릭 메뉴 */}
      <Menu id={MENU_ID} theme="light" animation="fade">
        {contextMenuData?.map((item, idx) => (
          <Item 
            key={idx} 
            onClick={item.onClick} 
            style={{ 
              fontSize: 13, 
              padding: '6px 16px', 
              color: '#222', 
              borderRadius: 4,
              minHeight: 'auto',
              lineHeight: '1.2'
            }}
          >
            {item.label}
          </Item>
        ))}
      </Menu>

      {/* 코드 예시 패널 제거 (fe5 방식으로 되돌림) */}
          </div>
    );
  }