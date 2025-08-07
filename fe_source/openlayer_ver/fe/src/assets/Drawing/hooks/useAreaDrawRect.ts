// Drawing 패키지 - useAreaDrawRect Hook
// 담당 기능: 사각형 영역 그리기

import { useCallback } from 'react';
import { AreaDrawRectService, AreaDrawRectOptions } from '../services/areaDrawRectService';
import { useMapbase } from "../../../store/useMapbase";

export const useAreaDrawRect = () => {
  const { map } = useMapbase();
  const areaDrawRectService = new AreaDrawRectService(map);

  const activateAreaDrawRectMode = useCallback((options?: AreaDrawRectOptions) => {
    return areaDrawRectService.activateAreaDrawRectMode(options);
  }, [areaDrawRectService]);

  return {
    activateAreaDrawRectMode
  };
};

// Area Draw Rect 모드 활성화 함수 (MainPage에서 사용)
export const activateAreaDrawRectMode = (options?: AreaDrawRectOptions) => {
  const { map } = useMapbase.getState();
  const areaDrawRectService = new AreaDrawRectService(map);
  return areaDrawRectService.activateAreaDrawRectMode(options);
}; 