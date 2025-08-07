// LayerManagement 패키지 - useLayerInfo Hook
// 담당 기능:
// - getLayer (레이어 정보 가져오기)
// - externalLayerName (외부 레이어 aliasName 가져오기)
// - tableNameOfLayer (레이어 테이블명 가져오기)

import { useCallback } from 'react';
import { LayerInfoService } from '../services/layerInfoService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerInfo = () => {
  const { map } = useMapbase();
  const layerInfoService = new LayerInfoService(map);

  const getLayer = useCallback((layerName: string) => {
    return layerInfoService.getLayer(layerName);
  }, [layerInfoService]);

  const getExternalLayerName = useCallback((layerName: string) => {
    return layerInfoService.getExternalLayerName(layerName);
  }, [layerInfoService]);

  const getTableNameOfLayer = useCallback((layerName: string) => {
    return layerInfoService.getTableNameOfLayer(layerName);
  }, [layerInfoService]);

  return {
    getLayer,
    getExternalLayerName,
    getTableNameOfLayer
  };
}; 