// Selection 패키지 - usePolygonSelection Hook
// 담당 기능:
// - polygonSelection (다각형 선택)

import { Draw } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import { getListFeaturesInPixel } from '~/assets/OpenLayer/services/getFeatures';
import { LayerModel } from '~/models/Layer';
import { useMapbase } from '~/store/useMapbase';
import { FeatureBase } from '~/models/Coords';
import { useEffect, useRef } from 'react';

interface Props {
  map: any;
  onEndDraw?: () => void;
}

export const usePolygonSelection = ({ map, onEndDraw }: Props) => {
  const mapStore = useMapbase();
  const selectionRef = useRef<Draw | null>(null);

  useEffect(() => {
    if (mapStore.selectorMode === 'POLYGON') {
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

  const startPolygonSelection = (layerData?: LayerModel[]) => {
    checkInteraction();
    
    // 임시 벡터 소스를 생성하여 다각형을 그리기 위한 레이어 생성
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
      type: 'Polygon',
      condition: shiftKeyOnly,
      freehand: false,
    });
    
    draw.set('id', 'polygon-selection');
    draw.set('selectorMode', 'POLYGON');
    
    draw.on('drawend', async (event) => {
      const polygonGeometry = event.feature.getGeometry();
      
      if (polygonGeometry) {
        const extent = polygonGeometry.getExtent();
        const center = [
          (extent[0] + extent[2]) / 2,
          (extent[1] + extent[3]) / 2
        ];
        const extentString = extent.join(',');
        const currentZoom = mapStore.map?.getView().getZoom() ?? 0;
        const filterLayerValid = layerData || [];
        const features = await getListFeaturesInPixel(filterLayerValid, currentZoom, center, extentString);
        
        console.log('다각형 내부 features 개수:', features?.length || 0);
        
        // 다각형 내부에 있는 모든 feature 선택
        const selectedFeatures: FeatureBase[] = (features || []).map(item => ({
          id: `${item.id}`,
          geometry: {
            coordinates: item.geometry.coordinates,
            type: `${item.geometry.type}`,
          },
          properties: item.properties,
        }));
        
        mapStore.setSelectedFeatures(selectedFeatures);
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
    startPolygonSelection,
  };
};

// Polygon Selection 모드 활성화 함수 (MainPage에서 사용)
export const activatePolygonSelectionMode = (map: any, layerData?: LayerModel[]) => {
  if (!map) return;
  
  // 기존 선택 기능 비활성화
  useMapbase.getState().clearSelectedFeatures();
  
  // Polygon Selection 모드 설정
  useMapbase.getState().setSelectorMode('POLYGON');
  
  console.log('Polygon Selection 모드가 활성화되었습니다.');
}; 