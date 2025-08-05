// Drawing 패키지 - useTrailDrawLine Hook
// 담당 기능: 선형 그리기

import { useCallback } from 'react';
import { TrailDrawLineService, TrailDrawLineCallbacks } from '../services/trailDrawLineService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailDrawLine = () => {
  const { map } = useMapbase();
  const trailDrawLineService = new TrailDrawLineService(map);

  const activateTrailDrawLineMode = useCallback((callbacks: TrailDrawLineCallbacks) => {
    return trailDrawLineService.activateTrailDrawLineMode(callbacks);
  }, [trailDrawLineService]);

  return {
    activateTrailDrawLineMode
  };
};

// Trail Draw Line 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailDrawLineMode = (callbacks: TrailDrawLineCallbacks) => {
  const { map } = useMapbase.getState();
  const trailDrawLineService = new TrailDrawLineService(map);
  return trailDrawLineService.activateTrailDrawLineMode(callbacks);
}; 