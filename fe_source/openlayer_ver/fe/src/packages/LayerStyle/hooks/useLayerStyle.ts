// LayerStyle 패키지 - useLayerStyle Hook
// 담당 기능:
// - setLayerStyle (레이어 스타일 설정)
// - setLayerStyleDefault (레이어 스타일 기본값 설정)

import { useCallback } from 'react';
import { LayerStyleService, SetLayerStyleResult, SetLayerStyleDefaultResult } from '../services/layerStyleService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerStyle = () => {
  const { map } = useMapbase();

  const setLayerStyle = useCallback(async (layerName: string, styleName: string): Promise<SetLayerStyleResult> => {
    const layerStyleService = new LayerStyleService(map);
    return await layerStyleService.setLayerStyle(layerName, styleName);
  }, [map]);

  const setLayerStyleDefault = useCallback(async (layerName: string): Promise<SetLayerStyleDefaultResult> => {
    const layerStyleService = new LayerStyleService(map);
    return await layerStyleService.setLayerStyleDefault(layerName);
  }, [map]);

  return {
    setLayerStyle,
    setLayerStyleDefault
  };
}; 