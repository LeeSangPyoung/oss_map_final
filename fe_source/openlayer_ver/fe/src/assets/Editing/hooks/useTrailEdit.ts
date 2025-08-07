// Editing 패키지 - useTrailEdit Hook
// 담당 기능: 트레일 편집

import { useCallback } from 'react';
import { TrailEditService } from '../services/trailEditService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailEdit = () => {
  const { map } = useMapbase();
  const trailEditService = new TrailEditService(map);

  const activateTrailEditMode = useCallback(() => {
    return trailEditService.activateTrailEditMode();
  }, [trailEditService]);

  return {
    activateTrailEditMode
  };
};

// Trail Edit 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailEditMode = (map: any) => {
  const trailEditService = new TrailEditService(map);
  return trailEditService.activateTrailEditMode();
}; 