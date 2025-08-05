// Drawing 패키지 - useAreaDrawPolygon Hook
// 담당 기능: 다각형 영역 그리기

import { useCallback } from 'react';
import { AreaDrawPolygonService, AreaDrawPolygonOptions } from '../services/areaDrawPolygonService';
import { useMapbase } from "../../../store/useMapbase";

export const useAreaDrawPolygon = () => {
  const { map } = useMapbase();
  const areaDrawPolygonService = new AreaDrawPolygonService(map);

  const activateAreaDrawPolygonMode = useCallback((options?: AreaDrawPolygonOptions) => {
    return areaDrawPolygonService.activateAreaDrawPolygonMode(options);
  }, [areaDrawPolygonService]);

  return {
    activateAreaDrawPolygonMode
  };
};

// Area Draw Polygon 모드 활성화 함수 (MainPage에서 사용)
export const activateAreaDrawPolygonMode = (options?: AreaDrawPolygonOptions) => {
  const { map } = useMapbase.getState();
  const areaDrawPolygonService = new AreaDrawPolygonService(map);
  return areaDrawPolygonService.activateAreaDrawPolygonMode(options);
}; 