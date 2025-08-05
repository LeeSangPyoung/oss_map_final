// LayerStyle 패키지 - useLayerOpacity Hook
// 담당 기능:
// - setLayerOpacity (레이어 투명도 설정)
// - getLayerOpacity (레이어 투명도 조회)
// - resetLayerOpacity (레이어 투명도 초기화)

import { useCallback } from 'react';
import { LayerOpacityService, SetLayerOpacityResult, GetLayerOpacityResult, ResetLayerOpacityResult } from '../services/layerOpacityService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerOpacity = () => {
  const { map } = useMapbase();

  const setLayerOpacity = useCallback(async (layerName: string, opacity: number): Promise<SetLayerOpacityResult> => {
    const layerOpacityService = new LayerOpacityService(map);
    return await layerOpacityService.setLayerOpacity(layerName, opacity);
  }, [map]);

  const getLayerOpacity = useCallback(async (layerName: string): Promise<GetLayerOpacityResult> => {
    const layerOpacityService = new LayerOpacityService(map);
    return await layerOpacityService.getLayerOpacity(layerName);
  }, [map]);

  const resetLayerOpacity = useCallback(async (layerName: string): Promise<ResetLayerOpacityResult> => {
    const layerOpacityService = new LayerOpacityService(map);
    return await layerOpacityService.resetLayerOpacity(layerName);
  }, [map]);

  return {
    setLayerOpacity,
    getLayerOpacity,
    resetLayerOpacity
  };
}; 