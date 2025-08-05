// Drawing 패키지 - useTrailMeasurement Hook
// 담당 기능:
// - trailDistance (트레일 거리 측정)
// - trailArea (트레일 면적 측정)
// - trailSimple (트레일 간단 측정)

import { useCallback } from 'react';
import { TrailMeasurementService } from '../services/trailMeasurementService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailMeasurement = () => {
  const { map } = useMapbase();
  const trailMeasurementService = new TrailMeasurementService(map);

  const trailDistance = useCallback((options: any) => {
    return trailMeasurementService.trailDistance(options);
  }, [trailMeasurementService]);

  const trailArea = useCallback((options: any) => {
    return trailMeasurementService.trailArea(options);
  }, [trailMeasurementService]);

  const trailSimple = useCallback((options: any) => {
    return trailMeasurementService.trailSimple(options);
  }, [trailMeasurementService]);

  return {
    trailDistance,
    trailArea,
    trailSimple
  };
}; 