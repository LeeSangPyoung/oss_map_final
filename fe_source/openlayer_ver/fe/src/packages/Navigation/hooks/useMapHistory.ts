// Navigation 패키지 - useMapHistory Hook
// 담당 기능:
// - prevscreen (이전 화면)
// - forwardscreen (다음 화면)

import { useCallback } from 'react';
import { Map } from 'ol';
import { MapHistoryService, MapHistoryResult } from '../services/mapHistoryService';
import { useMapbase } from '../../../store/useMapbase';

export const useMapHistory = (customMap?: Map | null) => {
  const { map: storeMap } = useMapbase();
  const map = customMap || storeMap;

  const prevScreen = useCallback((): MapHistoryResult => {
    const mapHistoryService = new MapHistoryService(map);
    return mapHistoryService.prevScreen();
  }, [map]);

  const forwardScreen = useCallback((): MapHistoryResult => {
    const mapHistoryService = new MapHistoryService(map);
    return mapHistoryService.forwardScreen();
  }, [map]);

  const canGoBack = useCallback((): boolean => {
    const mapHistoryService = new MapHistoryService(map);
    return mapHistoryService.canGoBack();
  }, [map]);

  const canGoForward = useCallback((): boolean => {
    const mapHistoryService = new MapHistoryService(map);
    return mapHistoryService.canGoForward();
  }, [map]);

  return {
    prevScreen,
    forwardScreen,
    canGoBack,
    canGoForward
  };
}; 