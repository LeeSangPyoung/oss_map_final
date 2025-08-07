// LayerManagement 패키지 - useLayerZoom Hook
// 담당 기능:
// - minDisplayZoomLevel (레이어 표시 최소 줌레벨)
// - maxDisplayZoomLevel (레이어 표시 최대 줌레벨)

import { useCallback } from 'react';
import { LayerZoomService } from '../services/layerZoomService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerZoom = () => {
  const { map } = useMapbase();
  const layerZoomService = new LayerZoomService(map);

  const getMinDisplayZoomLevel = useCallback((layerName: string) => {
    return layerZoomService.getMinDisplayZoomLevel(layerName);
  }, [layerZoomService]);

  const getMaxDisplayZoomLevel = useCallback((layerName: string) => {
    return layerZoomService.getMaxDisplayZoomLevel(layerName);
  }, [layerZoomService]);

  return {
    getMinDisplayZoomLevel,
    getMaxDisplayZoomLevel
  };
}; 