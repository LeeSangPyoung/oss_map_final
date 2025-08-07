// Drawing 패키지 - useAreaDrawCircle Hook
// 담당 기능: 원형 영역 그리기

import { useCallback } from 'react';
import { AreaDrawCircleService, AreaDrawCircleOptions } from '../services/areaDrawCircleService';
import { useMapbase } from "../../../store/useMapbase";

export const useAreaDrawCircle = () => {
  const { map } = useMapbase();
  const areaDrawCircleService = new AreaDrawCircleService(map);

  const activateAreaDrawCircleMode = useCallback((options?: AreaDrawCircleOptions) => {
    return areaDrawCircleService.activateAreaDrawCircleMode(options);
  }, [areaDrawCircleService]);

  return {
    activateAreaDrawCircleMode
  };
};

// Area Draw Circle 모드 활성화 함수 (MainPage에서 사용)
export const activateAreaDrawCircleMode = (options?: AreaDrawCircleOptions) => {
  const { map } = useMapbase.getState();
  const areaDrawCircleService = new AreaDrawCircleService(map);
  return areaDrawCircleService.activateAreaDrawCircleMode(options);
}; 