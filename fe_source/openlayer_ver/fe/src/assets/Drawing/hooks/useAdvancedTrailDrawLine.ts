// Drawing 패키지 - useAdvancedTrailDrawLine Hook
// 담당 기능: 스냅 기능이 포함된 고급 선형 그리기

import { useCallback } from 'react';
import { AdvancedTrailDrawLineService, AdvancedTrailDrawLineCallbacks } from '../services/advancedTrailDrawLineService';
import { useMapbase } from "../../../store/useMapbase";

export const useAdvancedTrailDrawLine = () => {
  const { map } = useMapbase();
  const advancedTrailDrawLineService = new AdvancedTrailDrawLineService(map);

  const activateAdvancedTrailDrawLineMode = useCallback((callbacks: AdvancedTrailDrawLineCallbacks) => {
    return advancedTrailDrawLineService.activateAdvancedTrailDrawLineMode(callbacks);
  }, [advancedTrailDrawLineService]);

  return {
    activateAdvancedTrailDrawLineMode
  };
};

// Advanced Trail Draw Line 모드 활성화 함수 (MainPage에서 사용)
export const activateAdvancedTrailDrawLineMode = (callbacks: AdvancedTrailDrawLineCallbacks) => {
  const { map } = useMapbase.getState();
  const advancedTrailDrawLineService = new AdvancedTrailDrawLineService(map);
  return advancedTrailDrawLineService.activateAdvancedTrailDrawLineMode(callbacks);
}; 