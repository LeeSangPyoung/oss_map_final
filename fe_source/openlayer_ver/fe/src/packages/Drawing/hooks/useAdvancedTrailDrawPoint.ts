// Drawing 패키지 - useAdvancedTrailDrawPoint Hook
// 담당 기능: 스냅 기능이 포함된 고급 점 그리기

import { useCallback } from 'react';
import { AdvancedTrailDrawPointService, AdvancedTrailDrawPointCallbacks } from '../services/advancedTrailDrawPointService';
import { useMapbase } from "../../../store/useMapbase";

export const useAdvancedTrailDrawPoint = () => {
  const { map } = useMapbase();
  const advancedTrailDrawPointService = new AdvancedTrailDrawPointService(map);

  const activateAdvancedTrailDrawPointMode = useCallback(async (callbacks: AdvancedTrailDrawPointCallbacks) => {
    return await advancedTrailDrawPointService.activateAdvancedTrailDrawPointMode(callbacks);
  }, [advancedTrailDrawPointService]);

  return {
    activateAdvancedTrailDrawPointMode
  };
};

// Advanced Trail Draw Point 모드 활성화 함수 (MainPage에서 사용)
export const activateAdvancedTrailDrawPointMode = async (callbacks: AdvancedTrailDrawPointCallbacks) => {
  const { map } = useMapbase.getState();
  const advancedTrailDrawPointService = new AdvancedTrailDrawPointService(map);
  return await advancedTrailDrawPointService.activateAdvancedTrailDrawPointMode(callbacks);
}; 