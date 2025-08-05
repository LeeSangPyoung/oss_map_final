// Drawing 패키지 - useAdvancedTrailDrawPolygon Hook
// 담당 기능: 고급 다각형 그리기

import { useCallback } from 'react';
import { AdvancedTrailDrawPolygonService, AdvancedTrailDrawPolygonCallbacks } from '../services/advancedTrailDrawPolygonService';
import { useMapbase } from "../../../store/useMapbase";

export const useAdvancedTrailDrawPolygon = () => {
  const { map } = useMapbase();
  const advancedTrailDrawPolygonService = new AdvancedTrailDrawPolygonService(map);

  const activateAdvancedTrailDrawPolygonMode = useCallback(async (callbacks: AdvancedTrailDrawPolygonCallbacks) => {
    return await advancedTrailDrawPolygonService.activateAdvancedTrailDrawPolygonMode(callbacks);
  }, [advancedTrailDrawPolygonService]);

  return {
    activateAdvancedTrailDrawPolygonMode
  };
};

// Advanced Trail Draw Polygon 모드 활성화 함수 (MainPage에서 사용)
export const activateAdvancedTrailDrawPolygonMode = async (callbacks: AdvancedTrailDrawPolygonCallbacks) => {
  const { map } = useMapbase.getState();
  const advancedTrailDrawPolygonService = new AdvancedTrailDrawPolygonService(map);
  return await advancedTrailDrawPolygonService.activateAdvancedTrailDrawPolygonMode(callbacks);
}; 