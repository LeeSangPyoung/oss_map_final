import { useCallback, useRef, useEffect } from 'react';
import { Map } from 'ol';
import { MapHistoryService } from '../services/mapHistoryService';
import { UseMapHistoryOptions, MapHistoryActions } from '../types';

export const useMapHistory = (
  map: Map | null,
  options: UseMapHistoryOptions = {}
): MapHistoryActions => {
  const serviceRef = useRef<MapHistoryService | null>(null);

  // 서비스 초기화
  useEffect(() => {
    if (!map) {
      return;
    }

    serviceRef.current = new MapHistoryService(map, options);

    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
        serviceRef.current = null;
      }
    };
  }, [map, options.maxHistorySize, options.enableAutoSave, options.autoSaveInterval]);

                const back = useCallback((animationDuration?: number) => {
                if (serviceRef.current) {
                  return serviceRef.current.back(animationDuration);
                }
                return false;
              }, []);

              const forward = useCallback((animationDuration?: number) => {
                if (serviceRef.current) {
                  return serviceRef.current.forward(animationDuration);
                }
                return false;
              }, []);

  const canGoBack = useCallback(() => {
    if (serviceRef.current) {
      return serviceRef.current.canGoBack();
    }
    return false;
  }, []);

  const canGoForward = useCallback(() => {
    if (serviceRef.current) {
      return serviceRef.current.canGoForward();
    }
    return false;
  }, []);

  const saveCurrentState = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.saveCurrentState();
    }
  }, []);

  const clearHistory = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.clearHistory();
    }
  }, []);

  const getHistoryInfo = useCallback(() => {
    if (serviceRef.current) {
      return serviceRef.current.getHistoryInfo();
    }
    return { pastCount: 0, futureCount: 0 };
  }, []);

  return {
    back,
    forward,
    canGoBack,
    canGoForward,
    saveCurrentState,
    clearHistory,
    getHistoryInfo,
  };
}; 