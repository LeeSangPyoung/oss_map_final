// Drawing 패키지 - useTrailSimple Hook
// 담당 기능: 간단한 선 그리기

import { useCallback } from 'react';
import { TrailSimpleService } from '../services/trailSimpleService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailSimple = () => {
  const { map } = useMapbase();
  const trailSimpleService = new TrailSimpleService(map);

  const activateTrailSimpleMode = useCallback(() => {
    return trailSimpleService.activateTrailSimpleMode();
  }, [trailSimpleService]);

  return {
    activateTrailSimpleMode
  };
};

// Trail Simple 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailSimpleMode = () => {
  const map = useMapbase.getState().map;
  const trailSimpleService = new TrailSimpleService(map);
  return trailSimpleService.activateTrailSimpleMode();
}; 