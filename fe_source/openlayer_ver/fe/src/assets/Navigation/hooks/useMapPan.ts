// Navigation 패키지 - useMapPan Hook
// 담당 기능:
// - panBy (픽셀 단위 이동)
// - panTo (애니메이션 중심+줌 이동)
// - fitBounds (범용 영역 맞춤)
// - getBounds (현재 화면 extent 반환)
// - setZoom (애니메이션 줌 설정)
// - resetView (초기화)
// - rotate (지도 회전)

import { useCallback } from 'react';
import { Map } from 'ol';
import { MapPanService, MapPanOptions, MapPanResult, MapPanToOptions, MapPanToResult, MapFitBoundsOptions, MapFitBoundsResult, MapGetBoundsResult, MapSetZoomOptions, MapSetZoomResult, MapResetViewOptions, MapResetViewResult, MapRotateOptions, MapRotateResult } from '../services/mapPanService';
import { useMapbase } from '../../../store/useMapbase';

export const useMapPan = (customMap?: Map | null) => {
  const { map: storeMap } = useMapbase();
  const map = customMap || storeMap;

  const panBy = useCallback((options: MapPanOptions): MapPanResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.panBy(options);
  }, [map]);

  const panTo = useCallback((options: MapPanToOptions): MapPanToResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.panTo(options);
  }, [map]);

  const fitBounds = useCallback((options: MapFitBoundsOptions): MapFitBoundsResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.fitBounds(options);
  }, [map]);

  const getBounds = useCallback((): MapGetBoundsResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.getBounds();
  }, [map]);

  const setZoom = useCallback((options: MapSetZoomOptions): MapSetZoomResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.setZoom(options);
  }, [map]);

  const resetView = useCallback((options: MapResetViewOptions = {}): MapResetViewResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.resetView(options);
  }, [map]);

  const rotate = useCallback((options: MapRotateOptions = {}): MapRotateResult => {
    const mapPanService = new MapPanService(map);
    return mapPanService.rotate(options);
  }, [map]);

  return {
    panBy,
    panTo,
    fitBounds,
    getBounds,
    setZoom,
    resetView,
    rotate
  };
}; 