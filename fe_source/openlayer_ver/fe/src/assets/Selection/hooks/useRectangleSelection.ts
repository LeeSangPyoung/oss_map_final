import { DragBox } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';
import { getListFeaturesInPixel } from '~/assets/OpenLayer/services/getFeatures';
import { LayerModel } from '~/models/Layer';
import { useMapbase } from '~/store/useMapbase';
import { FeatureBase } from '~/models/Coords';
import { useEffect, useRef } from 'react';

interface Props {
  map: any;
  onEndDraw?: () => void;
}

export const useRectangleSelection = ({ map, onEndDraw }: Props) => {
  const mapStore = useMapbase();
  const selectionRef = useRef<DragBox | null>(null);

  useEffect(() => {
    if (mapStore.selectorMode === 'RECT') {
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

  const startSelectorFeature = (layerData?: LayerModel[]) => {
    checkInteraction();
    const dragBox = new DragBox({
      condition: shiftKeyOnly,
    });
    dragBox.set('id', 'rect-selection');
    dragBox.set('selectorMode', 'RECT');
    dragBox.on('boxend', async () => {
      const extent = dragBox.getGeometry().getExtent().join(',');
      const currentZoom = mapStore.map?.getView().getZoom() ?? 0;
      
      // 임시로 줌 레벨 필터링 완화 (모든 레이어 포함)
      const filterLayerValid = layerData || [];
      
      // 사각형의 중심점 계산
      const boxGeometry = dragBox.getGeometry();
      const boxExtent = boxGeometry.getExtent();
      const centerX = (boxExtent[0] + boxExtent[2]) / 2;
      const centerY = (boxExtent[1] + boxExtent[3]) / 2;
      const boxCenter = [centerX, centerY];
      
      const features = await getListFeaturesInPixel(filterLayerValid, currentZoom, boxCenter, extent);
      
      if (features.length > 0) {
        console.log('사각형 중심점:', boxCenter);
        console.log('선택된 features 개수:', features.length);
        
        // 각 feature의 중심점과 사각형 중심점 사이의 거리 계산
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
            Math.pow(featureCenter[0] - boxCenter[0], 2) + 
            Math.pow(featureCenter[1] - boxCenter[1], 2)
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
      
      onEndDraw?.();
    });
    selectionRef.current = dragBox;
    mapStore.map?.addInteraction(dragBox);
  };

  return {
    startSelectorFeature,
  };
};

// Rect Selection 모드 활성화 함수 (MainPage에서 사용)
export const activateRectSelectionMode = (map: any, layerData?: LayerModel[]) => {
  if (!map) return;
  
  // 기존 선택 기능 비활성화
  useMapbase.getState().clearSelectedFeatures();
  
  // Rect Selection 모드 설정
  useMapbase.getState().setSelectorMode('RECT');
  
  console.log('Rect Selection 모드가 활성화되었습니다.');
}; 