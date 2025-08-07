// Navigation 패키지 - useMapExport Hook
// 담당 기능:
// - exportMapImage (지도 이미지 내보내기)
// - copyView (뷰 복사)

import { useCallback } from 'react';
import { Map } from 'ol';
import { MapExportService, MapExportOptions, MapExportResult, MapCopyViewResult } from '../services/mapExportService';
import { useMapbase } from '../../../store/useMapbase';

export const useMapExport = (customMap?: Map | null) => {
  const { map: storeMap } = useMapbase();
  const map = customMap || storeMap;

  const exportMapImage = useCallback((options: MapExportOptions = {}): MapExportResult => {
    const mapExportService = new MapExportService(map);
    return mapExportService.exportMapImage(options);
  }, [map]);

  const copyView = useCallback((): MapCopyViewResult => {
    const mapExportService = new MapExportService(map);
    return mapExportService.copyView();
  }, [map]);

  return {
    exportMapImage,
    copyView
  };
}; 