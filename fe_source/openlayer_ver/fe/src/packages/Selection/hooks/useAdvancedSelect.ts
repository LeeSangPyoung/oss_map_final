import { useEffect, useRef, useCallback } from 'react';
import { Map } from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Polygon from 'ol/geom/Polygon';
import { useMapbase } from '~/store/useMapbase';
import { getListFeaturesInPixel, loadAllFeaturesToVectorLayer } from '~/packages/OpenLayer/services/getFeatures';

export interface UseAdvancedSelectOptions {
  map: Map | null;
  layerData?: any[];
  onFeatureSelect?: (feature: any) => void;
  onFeatureDeselect?: () => void;
  onFeatureHover?: (feature: any) => void;
  onFeatureHoverEnd?: () => void;
}

export const useAdvancedSelect = (options: UseAdvancedSelectOptions) => {
  const { map, layerData = [], onFeatureSelect, onFeatureDeselect, onFeatureHover, onFeatureHoverEnd } = options;
  
  // Hover에서 찾은 피처를 저장
  const hoveredFeatureRef = useRef<any>(null);
  const isActive = useRef(false);
  const clickHandler = useRef<((event: any) => void) | null>(null);
  const mouseMoveHandler = useRef<((event: any) => void) | null>(null);
  const mouseMoveTimeout = useRef<number | undefined>(undefined);
  const mapMoveHandler = useRef<((event: any) => void) | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const UPDATE_DEBOUNCE_TIME = 2000; // 2초 디바운싱

  // 맵 마우스 이동 핸들러 (hover 기능)
  const handleMapMouseMove = useCallback(async (event: any) => {
    if (!isActive.current) {
      console.log('AdvancedSelect: Manager가 비활성화 상태');
      return;
    }
    
    // 이전 타임아웃이 있으면 취소
    if (mouseMoveTimeout.current) {
      clearTimeout(mouseMoveTimeout.current);
    }

    // 20ms 후에 실행 (디바운싱 시간 더욱 단축 - 더 빠른 반응)
    mouseMoveTimeout.current = window.setTimeout(async () => {
      console.log('AdvancedSelect: 마우스 이동 처리 시작');
      const coordinate = event.coordinate;
      const pixel = event.pixel;
      const zoom = map?.getView().getZoom() || 0;
      
      // 기본 layerData (API 호출 실패 시 사용)
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
      
      const currentLayerData = layerData.length > 0 ? layerData : fallbackLayerData;
      
      // layerData가 비어있으면 처리하지 않음
      if (!currentLayerData || currentLayerData.length === 0) {
        if (onFeatureHoverEnd) {
          onFeatureHoverEnd();
        }
        return;
      }

      try {
        // 마우스 오버 시에는 브라우저 내 검색만 사용 (WFS API 호출 없음)
        const features = await getListFeaturesInPixel(
          currentLayerData,
          zoom,
          coordinate,
          undefined,  // bboxParams
          pixel,      // clickPixel
          true,       // useBrowserSearch = true
          map         // map 객체 전달
        );

        if (features && features.length > 0) {
          const feature = features[0];
          console.log('AdvancedSelect: hover 피처 발견', feature);
          
          // Hover에서 찾은 피처를 저장
          hoveredFeatureRef.current = feature;
          
          // 포인트 피처인 경우 더 엄격한 검증
          if (feature.geometry?.type === 'Point') {
            // 포인트와의 거리를 다시 계산하여 더 엄격하게 검증
            const distance = Math.sqrt(
              Math.pow(coordinate[0] - feature.geometry.coordinates[0], 2) +
              Math.pow(coordinate[1] - feature.geometry.coordinates[1], 2)
            );
            const resolution = map?.getView().getResolution() || 1;
            const pixelDistance = distance / resolution;
            
            // 포인트는 2픽셀 이내에서만 hover 허용 (조금 완화)
            if (pixelDistance <= 2) {
              if (onFeatureHover) {
                onFeatureHover(feature);
              }
            } else {
              console.log('AdvancedSelect: 포인트 거리 초과 - hover 해제', { pixelDistance });
              hoveredFeatureRef.current = null; // 저장된 피처도 제거
              if (onFeatureHoverEnd) {
                onFeatureHoverEnd();
              }
            }
          } else {
            // 포인트가 아닌 경우 기존 로직 사용
            if (onFeatureHover) {
              onFeatureHover(feature);
            }
          }
        } else {
          console.log('AdvancedSelect: hover 피처 없음');
          hoveredFeatureRef.current = null; // 저장된 피처 제거
          
          // hover 종료 콜백 호출
          if (onFeatureHoverEnd) {
            onFeatureHoverEnd();
          }
        }
      } catch (error) {
        console.error('AdvancedSelect: hover 피처 찾기 오류:', error);
        
        // hover 종료 콜백 호출
        if (onFeatureHoverEnd) {
          onFeatureHoverEnd();
        }
      }
    }, 20); // 20ms 디바운싱 (더 빠른 반응)
  }, [layerData, onFeatureHover, onFeatureHoverEnd]);

  // 맵 클릭 핸들러
  const handleMapClick = useCallback(async (event: any) => {
    if (!isActive.current || !map) return;
    
    const coordinate = event.coordinate;
    const pixel = event.pixel;
    const zoom = map.getView().getZoom() || 0;
    
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
    
    // 기본 layerData (API 호출 실패 시 사용)
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
    
    const currentLayerData = layerData.length > 0 ? layerData : fallbackLayerData;
    
    if (currentLayerData && currentLayerData.length > 0) {
      console.log('AdvancedSelect: 클릭 피처 검색 시작', { coordinate, pixel, zoom });
      
            try {
        // Hover에서 찾은 피처가 있으면 그 피처를 사용
        if (hoveredFeatureRef.current) {
          console.log('AdvancedSelect: 저장된 hover 피처 사용', hoveredFeatureRef.current);
          
          const selectedFeature = hoveredFeatureRef.current;
          
          const featureData = {
            id: `${selectedFeature.id}`,
            geometry: {
              coordinates: selectedFeature.geometry.coordinates,
              type: selectedFeature.geometry.type as string,
            },
            properties: selectedFeature.properties,
          };
          
          // useMapbase에 선택된 피처 저장 (FeatureBase로 변환)
          let featureBase: any = {
            id: featureData.id,
            geometry: featureData.geometry,
            properties: {
              ...featureData.properties || {},
              // layer 정보 추가 (ID에서 추출)
              layer: featureData.id ? featureData.id.split('.')[0] : 'unknown'
            },
            type: featureData.geometry.type,
          };
          useMapbase.getState().setSelectedFeatures([featureBase]);
          console.log('🎯 useAdvancedSelect: FeatureBase 저장:', featureBase);
          if (onFeatureSelect) {
            onFeatureSelect(featureBase);
          }
        } else {
          console.log('AdvancedSelect: 저장된 hover 피처 없음 - 브라우저 검색 사용');
          
          // 저장된 피처가 없으면 브라우저 검색 사용
          const features = await getListFeaturesInPixel(
            currentLayerData,
            zoom,
            coordinate,
            undefined,  // bboxParams
            pixel,      // clickPixel
            true,       // useBrowserSearch = true (브라우저 검색 사용)
            map         // map 객체 전달
          );

          if (features && features.length > 0) {
            console.log('AdvancedSelect: 클릭 피처 발견', features[0]);
            
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
              
              // useMapbase에 선택된 피처 저장 (FeatureBase로 변환)
              let featureBase: any = {
                id: featureData.id,
                geometry: featureData.geometry,
                properties: {
                  ...featureData.properties || {},
                  // layer 정보 추가 (ID에서 추출)
                  layer: featureData.id ? featureData.id.split('.')[0] : 'unknown'
                },
                type: featureData.geometry.type,
              };
              useMapbase.getState().setSelectedFeatures([featureBase]);
              console.log('🎯 useAdvancedSelect: FeatureBase 저장:', featureBase);
              if (onFeatureSelect) {
                onFeatureSelect(featureBase);
              }
            }
          } else {
            console.log('AdvancedSelect: 클릭 피처 없음');
            useMapbase.getState().setSelectedFeatures([]);
            
            // 콜백 호출
            if (onFeatureDeselect) {
              onFeatureDeselect();
            }
          }
        }
      } catch (error) {
        console.error('AdvancedSelect: 클릭 피처 검색 오류:', error);
        useMapbase.getState().setSelectedFeatures([]);
      }
    } else {
      console.log('AdvancedSelect: layerData 없음');
      useMapbase.getState().setSelectedFeatures([]);
    }
  }, [layerData, onFeatureSelect, onFeatureDeselect]);

  // 맵 이동/줌 핸들러 (Vector 레이어 업데이트)
  const handleMapMove = useCallback(async (event: any) => {
    if (!isActive.current || !map) return;
    
    const now = Date.now();
    if (now - lastUpdateTime.current < UPDATE_DEBOUNCE_TIME) {
      return; // 디바운싱
    }
    lastUpdateTime.current = now;
    
    console.log('AdvancedSelect: 맵 이동/줌 감지 - Vector 레이어 업데이트');
    
    const coordinate = map.getView().getCenter();
    const zoom = map.getView().getZoom() || 0;
    
    if (!coordinate || !Array.isArray(coordinate) || coordinate.length < 2) {
      return;
    }
    
    // 기본 layerData
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
    
    const currentLayerData = layerData.length > 0 ? layerData : fallbackLayerData;
    
    try {
      // Vector 레이어 재생성
      await loadAllFeaturesToVectorLayer(map, currentLayerData, coordinate, zoom);
      console.log('AdvancedSelect: Vector 레이어 업데이트 완료');
    } catch (error) {
      console.error('AdvancedSelect: Vector 레이어 업데이트 오류:', error);
    }
  }, [map, layerData]);

  // 활성화
  const activate = useCallback(() => {
    if (!map || isActive.current) return;
    
    isActive.current = true;
    clickHandler.current = handleMapClick;
    mouseMoveHandler.current = handleMapMouseMove;
    mapMoveHandler.current = handleMapMove;
    
    map.on('click', clickHandler.current);
    map.on('pointermove', mouseMoveHandler.current);
    map.on('moveend', mapMoveHandler.current); // 맵 이동/줌 완료 시
    
    console.log('useAdvancedSelect activated');
  }, [map, handleMapClick, handleMapMouseMove, handleMapMove]);

  // 비활성화
  const deactivate = useCallback(() => {
    if (!map || !isActive.current) return;
    
    isActive.current = false;
    
    if (clickHandler.current) {
      map.un('click', clickHandler.current);
      clickHandler.current = null;
    }
    
    if (mouseMoveHandler.current) {
      map.un('pointermove', mouseMoveHandler.current);
      mouseMoveHandler.current = null;
    }
    
    if (mapMoveHandler.current) {
      map.un('moveend', mapMoveHandler.current);
      mapMoveHandler.current = null;
    }
    
    // 타임아웃 정리
    if (mouseMoveTimeout.current) {
      clearTimeout(mouseMoveTimeout.current);
      mouseMoveTimeout.current = undefined;
    }
    
    console.log('useAdvancedSelect deactivated');
  }, [map]);

  // 정리
  useEffect(() => {
    return () => {
      deactivate();
    };
  }, [deactivate]);

  return {
    activate,
    deactivate,
    isActive: () => isActive.current
  };
}; 

// Advanced Select 모드 활성화 함수 (MainPage에서 사용)
export const activateAdvancedSelectMode = (map?: Map | null, layerData?: any[]) => {
  // map이 없으면 전역에서 가져오기 시도
  const currentMap = map || (window as any).mapRef?.current;
  
  if (!currentMap) {
    console.warn('activateAdvancedSelectMode: map이 없습니다.');
    return;
  }
  
  // 기존 선택 기능 비활성화
  useMapbase.getState().clearSelectedFeatures();
  
  // Advanced Select 모드 설정
  useMapbase.getState().setMode('advanced-select');
  
  console.log('Advanced Select 모드가 활성화되었습니다.');
}; 