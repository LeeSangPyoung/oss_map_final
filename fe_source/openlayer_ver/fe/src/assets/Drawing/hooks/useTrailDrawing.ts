// Drawing 패키지 - useTrailDrawing Hook
// 담당 기능:
// - trailDrawLine (트레일 선 그리기)
// - trailDrawPoint (트레일 점 그리기)
// - trailDrawPolygon (트레일 다각형 그리기)

import { useCallback } from 'react';
import { TrailDrawingService } from '../services/trailDrawingService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailDrawing = () => {
  const { map } = useMapbase();
  const trailDrawingService = new TrailDrawingService(map);

  const trailDrawLine = useCallback((options: any) => {
    return trailDrawingService.trailDrawLine(options);
  }, [trailDrawingService]);

  const trailDrawPoint = useCallback((options: any) => {
    return trailDrawingService.trailDrawPoint(options);
  }, [trailDrawingService]);

  const trailDrawPolygon = useCallback((options: any) => {
    return trailDrawingService.trailDrawPolygon(options);
  }, [trailDrawingService]);

  return {
    trailDrawLine,
    trailDrawPoint,
    trailDrawPolygon
  };
}; 