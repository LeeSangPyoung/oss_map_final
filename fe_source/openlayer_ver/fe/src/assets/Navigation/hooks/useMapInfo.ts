// Navigation 패키지 - useMapInfo Hook
// 담당 기능:
// - center (화면 중심점 가져오기)
// - zoom (현재 줌 레벨 가져오기)
// - minzoom (최소 줌 레벨 가져오기)
// - maxzoom (최대 줌 레벨 가져오기)
// - getbounds (현재 화면 extent 반환)

import { useCallback } from 'react';
import { Map } from 'ol';
import { MapInfoService, MapCenterResult, MapZoomResult, MapInfoResult, MapBoundsResult } from '../services/mapInfoService';
import { useMapbase } from '../../../store/useMapbase';

export const useMapInfo = (customMap?: Map | null) => {
  const { map: storeMap } = useMapbase();
  const map = customMap || storeMap;

  const getCenter = useCallback((): MapCenterResult => {
    const mapInfoService = new MapInfoService(map);
    return mapInfoService.getCenter();
  }, [map]);

  const getZoom = useCallback((): MapZoomResult => {
    const mapInfoService = new MapInfoService(map);
    return mapInfoService.getZoom();
  }, [map]);

  const getMinZoom = useCallback((): MapInfoResult => {
    const mapInfoService = new MapInfoService(map);
    return mapInfoService.getMinZoom();
  }, [map]);

  const getMaxZoom = useCallback((): MapInfoResult => {
    const mapInfoService = new MapInfoService(map);
    return mapInfoService.getMaxZoom();
  }, [map]);

  const getBounds = useCallback((): MapBoundsResult => {
    const mapInfoService = new MapInfoService(map);
    return mapInfoService.getBounds();
  }, [map]);

  return {
    getCenter,
    getZoom,
    getMinZoom,
    getMaxZoom,
    getBounds
  };
}; 