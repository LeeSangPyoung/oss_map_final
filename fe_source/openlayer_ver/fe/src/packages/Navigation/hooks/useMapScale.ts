// Navigation 패키지 - useMapScale Hook
// 담당 기능:
// - adjustScale (스케일 조정)

import { useCallback } from 'react';
import { Map } from 'ol';
import { MapScaleService, MapScaleOptions, MapScaleResult } from '../services/mapScaleService';
import { useMapbase } from '../../../store/useMapbase';

export const useMapScale = (customMap?: Map | null) => {
  const { map: storeMap } = useMapbase();
  const map = customMap || storeMap;

  const adjustScale = useCallback((options: MapScaleOptions = {}): MapScaleResult => {
    const mapScaleService = new MapScaleService(map);
    return mapScaleService.adjustScale(options);
  }, [map]);

  const getCurrentResolution = useCallback((): number | undefined => {
    const mapScaleService = new MapScaleService(map);
    return mapScaleService.getCurrentResolution();
  }, [map]);

  return {
    adjustScale,
    getCurrentResolution
  };
}; 