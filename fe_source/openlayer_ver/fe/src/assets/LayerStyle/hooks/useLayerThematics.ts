// LayerStyle 패키지 - useLayerThematics Hook
// 담당 기능:
// - setThematics (테마틱 스타일 설정)

import { useCallback } from 'react';
import { LayerThematicsService, SetThematicsResult } from '../services/layerThematicsService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerThematics = () => {
  const { map } = useMapbase();

  const setThematics = useCallback(async (layerName: string, thematicConfig: any = {}): Promise<SetThematicsResult> => {
    const layerThematicsService = new LayerThematicsService(map);
    return await layerThematicsService.setThematics(layerName, thematicConfig);
  }, [map]);

  return {
    setThematics
  };
}; 