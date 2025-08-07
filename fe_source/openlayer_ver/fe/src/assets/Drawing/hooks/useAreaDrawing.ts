// Drawing 패키지 - useAreaDrawing Hook
// 담당 기능:
// - areaDrawRect (영역 사각형 그리기)
// - areaDrawCircle (영역 원 그리기)
// - areaDrawPolygon (영역 다각형 그리기)

import { useCallback } from 'react';
import { AreaDrawingService } from '../services/areaDrawingService';
import { useMapbase } from "../../../store/useMapbase";

export const useAreaDrawing = () => {
  const { map } = useMapbase();
  const areaDrawingService = new AreaDrawingService(map);

  const areaDrawRect = useCallback((options: any) => {
    return areaDrawingService.areaDrawRect(options);
  }, [areaDrawingService]);

  const areaDrawCircle = useCallback((options: any) => {
    return areaDrawingService.areaDrawCircle(options);
  }, [areaDrawingService]);

  const areaDrawPolygon = useCallback((options: any) => {
    return areaDrawingService.areaDrawPolygon(options);
  }, [areaDrawingService]);

  return {
    areaDrawRect,
    areaDrawCircle,
    areaDrawPolygon
  };
}; 