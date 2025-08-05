// LayerManagement 패키지 - useLayerControl Hook
// 담당 기능:
// - selectableFacility (선택 가능한 시설)
// - viewLayerInfo (레이어 정보 보기)
// - toggleDisplayHide (레이어 표시/숨김 토글)
// - refreshLayer (레이어 새로고침)

import { useCallback } from 'react';
import { LayerControlService } from '../services/layerControlService';
import { useMapbase } from "../../../store/useMapbase";

export const useLayerControl = () => {
  const { map } = useMapbase();
  const layerControlService = new LayerControlService(map);

  const getSelectableFacility = useCallback((layerName: string) => {
    return layerControlService.getSelectableFacility(layerName);
  }, [layerControlService]);

  const viewLayerInfo = useCallback((layerName: string) => {
    return layerControlService.viewLayerInfo(layerName);
  }, [layerControlService]);

  const toggleDisplayHide = useCallback((layerName: string) => {
    return layerControlService.toggleDisplayHide(layerName);
  }, [layerControlService]);

  const refreshLayer = useCallback((layerName: string) => {
    return layerControlService.refreshLayer(layerName);
  }, [layerControlService]);

  return {
    getSelectableFacility,
    viewLayerInfo,
    toggleDisplayHide,
    refreshLayer
  };
}; 