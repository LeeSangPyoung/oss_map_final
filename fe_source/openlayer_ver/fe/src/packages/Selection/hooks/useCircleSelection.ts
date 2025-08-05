// Selection 패키지 - useCircleSelection Hook
// 담당 기능:
// - circleSelection (원형 선택)

import { Draw } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';
import { Circle as CircleGeometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import { getListFeaturesInPixel } from '~/packages/OpenLayer/services/getFeatures';
import { LayerModel } from '~/models/Layer';
import { useMapbase } from '~/store/useMapbase';
import { FeatureBase } from '~/models/Coords';
import { useEffect, useRef } from 'react';

interface Props {
  map: any;
  onEndDraw?: () => void;
}

export const useCircleSelection = ({ map, onEndDraw }: Props) => {
  const mapStore = useMapbase();
  const selectionRef = useRef<Draw | null>(null);

  useEffect(() => {
    if (mapStore.selectorMode === 'CIRCLE') {
      selectionRef?.current?.setActive(!mapStore.isDrawing);
    }
  }, [mapStore.isDrawing, mapStore.selectorMode]);

  const checkInteraction = () => {
    mapStore.map
      ?.getInteractions()
      .getArray()
      .filter(it => it.get('selectorMode'))
      .forEach(it => {
        mapStore.map?.removeInteraction(it);
      });
  };

  const startCircleSelection = (layerData?: LayerModel[]) => {
    checkInteraction();
    
    // 임시 벡터 소스를 생성하여 원을 그리기 위한 레이어 생성
    const tempSource = new VectorSource();
    const tempLayer = new VectorLayer({
      source: tempSource,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 123, 255, 0.8)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0, 123, 255, 0.1)',
        }),
      }),
    });
    
    // 임시 레이어를 맵에 추가
    mapStore.map?.addLayer(tempLayer);
    
    const draw = new Draw({
      source: tempSource,
      type: 'Circle',
      condition: shiftKeyOnly,
      // 마우스 버튼을 떼면 원 그리기 완료
      finishCondition: (event) => {
        return event.type === 'pointerup';
      },
    });
    
    draw.set('id', 'circle-selection');
    draw.set('selectorMode', 'CIRCLE');
    
    draw.on('drawend', async (event) => {
      const circleGeometry = event.feature.getGeometry() as CircleGeometry;
      const center = circleGeometry.getCenter();
      const radius = circleGeometry.getRadius();
      
      console.log('원 중심점:', center);
      console.log('원 반지름:', radius);
      
      // 원의 경계 상자 계산
      const extent = circleGeometry.getExtent().join(',');
      const currentZoom = mapStore.map?.getView().getZoom() ?? 0;
      const filterLayerValid = layerData || [];
      const features = await getListFeaturesInPixel(filterLayerValid, currentZoom, center, extent);
      
      if (features.length > 0) {
        console.log('선택된 features 개수:', features.length);
        
        // 각 feature의 중심점과 원 중심점 사이의 거리 계산
        let closestFeature = features[0];
        let minDistance = Infinity;
        
        features.forEach((feature, index) => {
          let featureCenter: number[];
          
          // feature의 중심점 계산
          if (feature.geometry.type === 'Point') {
            featureCenter = feature.geometry.coordinates as unknown as number[];
          } else if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates as unknown as number[][];
            const midIndex = Math.floor(coords.length / 2);
            featureCenter = coords[midIndex];
          } else if (feature.geometry.type === 'Polygon') {
            // Polygon의 첫 번째 ring의 중심점 계산
            const coords = (feature.geometry.coordinates as unknown as number[][][])[0];
            const centerX = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;
            const centerY = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
            featureCenter = [centerX, centerY];
          } else {
            // 기본값으로 첫 번째 좌표 사용
            const coords = feature.geometry.coordinates as unknown as number[][];
            featureCenter = coords[0] || [0, 0];
          }
          
          // 유클리드 거리 계산
          const distance = Math.sqrt(
            Math.pow(featureCenter[0] - center[0], 2) + 
            Math.pow(featureCenter[1] - center[1], 2)
          );
          
          console.log(`Feature ${index} 중심점:`, featureCenter, '거리:', distance);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestFeature = feature;
          }
        });
        
        console.log('가장 가까운 feature:', closestFeature, '거리:', minDistance);
        
        // 가장 가까운 feature만 선택
        const selectedFeature: FeatureBase = {
          id: `${closestFeature.id}`,
          geometry: {
            coordinates: closestFeature.geometry.coordinates,
            type: `${closestFeature.geometry.type}`,
          },
          properties: closestFeature.properties,
        };
        
        mapStore.setSelectedFeatures([selectedFeature]);
      } else {
        mapStore.setSelectedFeatures([]);
      }
      
      // 2초 후 임시 레이어 제거
      setTimeout(() => {
        mapStore.map?.removeLayer(tempLayer);
      }, 2000);
      
      onEndDraw?.();
    });
    
    selectionRef.current = draw;
    mapStore.map?.addInteraction(draw);
  };

  return {
    startCircleSelection,
  };
};

// Circle Selection 모드 활성화 함수 (MainPage에서 사용)
export const activateCircleSelectionMode = (map: any, layerData?: LayerModel[]) => {
  if (!map) return;
  
  // 기존 선택 기능 비활성화
  useMapbase.getState().clearSelectedFeatures();
  
  // Circle Selection 모드 설정
  useMapbase.getState().setSelectorMode('CIRCLE');
  
  console.log('Circle Selection 모드가 활성화되었습니다.');
}; 