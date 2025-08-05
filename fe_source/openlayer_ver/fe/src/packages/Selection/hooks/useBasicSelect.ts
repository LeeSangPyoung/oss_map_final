import { useEffect, useRef, useCallback } from 'react';
import { Map } from 'ol';
import { useMapbase } from '~/store/useMapbase';
import { getListFeaturesInPixel } from '~/packages/OpenLayer/services/getFeatures';

export interface UseBasicSelectOptions {
  map: Map | null;
  layerData?: any[];
  onFeatureSelect?: (feature: any) => void;
  onFeatureDeselect?: () => void;
}

export const useBasicSelect = (options: UseBasicSelectOptions) => {
  const { map, layerData = [], onFeatureSelect, onFeatureDeselect } = options;
  const isActive = useRef(false);
  const clickHandler = useRef<((event: any) => void) | null>(null);

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
      console.log('BasicSelect: 피처 검색 시작', { coordinate, pixel, zoom });
      
      try {
        // getListFeaturesInPixel 함수 직접 호출
        const features = await getListFeaturesInPixel(
          currentLayerData,
          zoom,
          coordinate,
          undefined,  // bboxParams
          pixel       // clickPixel
        );
        
        if (features && features.length > 0) {
          console.log('BasicSelect: 피처 발견', features[0]);
          
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
            
            // useMapbase에 선택된 피처 저장
            useMapbase.getState().setSelectedFeatures([featureData]);
            
            // 콜백 호출
            if (onFeatureSelect) {
              onFeatureSelect(featureData);
            }
          }
        } else {
          console.log('BasicSelect: 피처 없음');
          useMapbase.getState().setSelectedFeatures([]);
          
          // 콜백 호출
          if (onFeatureDeselect) {
            onFeatureDeselect();
          }
        }
      } catch (error) {
        console.error('BasicSelect: 피처 검색 오류:', error);
        useMapbase.getState().setSelectedFeatures([]);
      }
    } else {
      console.log('BasicSelect: layerData 없음');
      useMapbase.getState().setSelectedFeatures([]);
    }
  }, [layerData, onFeatureSelect, onFeatureDeselect]);

  // 활성화
  const activate = useCallback(() => {
    if (!map || isActive.current) return;
    
    isActive.current = true;
    clickHandler.current = handleMapClick;
    map.on('click', clickHandler.current);
    console.log('useBasicSelect activated');
  }, [map, handleMapClick]);

  // map이 준비되면 자동으로 활성화
  useEffect(() => {
    if (map && !isActive.current) {
      activate();
    }
  }, [map, activate]);

  // 비활성화
  const deactivate = useCallback(() => {
    if (!map || !isActive.current) return;
    
    isActive.current = false;
    if (clickHandler.current) {
      map.un('click', clickHandler.current);
      clickHandler.current = null;
    }
    console.log('useBasicSelect deactivated');
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

// Select 모드 활성화 함수 (MainPage에서 사용)
export const activateSelectMode = (map?: Map | null, layerData?: any[]) => {
  // map이 없으면 전역에서 가져오기 시도
  const currentMap = map || (window as any).mapRef?.current;
  
  if (!currentMap) {
    console.warn('activateSelectMode: map이 없습니다.');
    return;
  }
  
  // 기존 선택 기능 비활성화
  useMapbase.getState().clearSelectedFeatures();
  
  // Select 모드 설정
  useMapbase.getState().setMode('select');
  
  console.log('Select 모드가 활성화되었습니다.');
}; 