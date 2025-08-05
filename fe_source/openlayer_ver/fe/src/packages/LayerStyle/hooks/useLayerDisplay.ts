// LayerStyle 패키지 - useLayerDisplay Hook
// 담당 기능:
// - setLayerDisplayLevel (레이어 표시 레벨 설정)

import { useCallback } from 'react';
import { LayerDisplayService, SetLayerDisplayLevelResult } from '../services/layerDisplayService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerDisplay = () => {
  const { map } = useMapbase();

  const setLayerDisplayLevel = useCallback(async (layerName: string, minZoom: number, maxZoom: number): Promise<SetLayerDisplayLevelResult> => {
    const layerDisplayService = new LayerDisplayService(map);
    return await layerDisplayService.setLayerDisplayLevel(layerName, minZoom, maxZoom);
  }, [map]);

  return {
    setLayerDisplayLevel
  };
}; 