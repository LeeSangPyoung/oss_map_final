// Drawing 패키지 - useTrailDrawPolygon Hook
// 담당 기능: 다각형 그리기

import { useCallback } from 'react';
import { TrailDrawPolygonService, TrailDrawPolygonCallbacks } from '../services/trailDrawPolygonService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailDrawPolygon = () => {
  const { map } = useMapbase();
  const trailDrawPolygonService = new TrailDrawPolygonService(map);

  const activateTrailDrawPolygonMode = useCallback((callbacks: TrailDrawPolygonCallbacks) => {
    return trailDrawPolygonService.activateTrailDrawPolygonMode(callbacks);
  }, [trailDrawPolygonService]);

  return {
    activateTrailDrawPolygonMode
  };
};

// Trail Draw Polygon 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailDrawPolygonMode = (callbacks: TrailDrawPolygonCallbacks) => {
  const { map } = useMapbase.getState();
  const trailDrawPolygonService = new TrailDrawPolygonService(map);
  return trailDrawPolygonService.activateTrailDrawPolygonMode(callbacks);
}; 