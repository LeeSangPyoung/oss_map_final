// Editing 패키지 - useTrailDelete Hook
// 담당 기능: 트레일 삭제

import { useCallback } from 'react';
import { TrailDeleteService } from '../services/trailDeleteService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailDelete = () => {
  const { map } = useMapbase();
  const trailDeleteService = new TrailDeleteService(map);

  const activateTrailDeleteMode = useCallback(async () => {
    return await trailDeleteService.activateTrailDeleteMode();
  }, [trailDeleteService]);

  return {
    activateTrailDeleteMode
  };
};

// Trail Delete 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailDeleteMode = async (map: any) => {
  const trailDeleteService = new TrailDeleteService(map);
  return await trailDeleteService.activateTrailDeleteMode();
}; 