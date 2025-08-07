import { Map } from 'ol';

export interface UseMapControlsProps {
  map: Map | null;
}

export interface MapScaleOptions {
  resolution?: number;
  duration?: number;
}

export interface MapScaleResult {
  success: boolean;
  message: string;
  previousResolution?: number;
  newResolution?: number;
}

export interface MapPanOptions {
  offsetX: number;
  offsetY: number;
  duration?: number;
}

export interface MapPanResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
}

export interface MapPanToOptions {
  center: number[];  // 필수 파라미터
  zoom: number;      // 필수 파라미터
  duration?: number;
}

export interface MapPanToResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
  previousZoom?: number;
  newZoom?: number;
}

export interface MapFitBoundsOptions {
  extent: number[];  // [minX, minY, maxX, maxY]
  duration?: number;
  padding?: number[];
  maxZoom?: number;
}

export interface MapFitBoundsResult {
  success: boolean;
  message: string;
  previousExtent?: number[];
  newExtent?: number[];
  previousZoom?: number;
  newZoom?: number;
}

export interface MapGetBoundsResult {
  success: boolean;
  message: string;
  extent?: number[];
  center?: number[];
  zoom?: number;
}

export interface MapSetZoomOptions {
  zoom: number;      // 필수 파라미터
  duration?: number;
}

export interface MapSetZoomResult {
  success: boolean;
  message: string;
  previousZoom?: number;
  newZoom?: number;
}

export interface MapResetViewOptions {
  center?: number[];  // [경도, 위도] - EPSG:4326
  zoom?: number;
  rotation?: number;
  duration?: number;
}

export interface MapResetViewResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
  previousZoom?: number;
  newZoom?: number;
  previousRotation?: number;
  newRotation?: number;
}

export interface MapRotateOptions {
  angle?: number;      // 라디안 단위 (기본값: Math.PI / 4 = 45도)
  duration?: number;   // 애니메이션 시간 (ms)
}

export interface MapRotateResult {
  success: boolean;
  message: string;
  previousRotation?: number;
  newRotation?: number;
  angleApplied?: number;
}

export interface MapGetLayerOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 레이어)
  layerType?: string;    // 레이어 타입 필터
}

export interface LayerInfo {
  id?: string;
  name?: string;
  type?: string;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  properties?: any;
  sourceParams?: any;
  minZoom?: number;
  maxZoom?: number;
  layerName?: string;
}

export interface MapGetLayerResult {
  success: boolean;
  message: string;
  layers?: LayerInfo[];
  layer?: LayerInfo;
  totalCount?: number;
}

export interface MapGetExternalLayerNameOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 외부 레이어)
}

export interface MapGetExternalLayerNameResult {
  success: boolean;
  message: string;
  aliasName?: string;
  layerId?: string;
  error?: string;
}

export interface MapGetTableNameOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 레이어)
}

export interface MapGetTableNameResult {
  success: boolean;
  message: string;
  tableName?: string;
  layerId?: string;
  error?: string;
}

export interface MapGetMinZoomOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 레이어)
}

export interface MapGetMinZoomResult {
  success: boolean;
  message: string;
  minZoom?: number;
  layerId?: string;
  error?: string;
}

export interface MapGetMaxZoomOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 레이어)
}

export interface MapGetMaxZoomResult {
  success: boolean;
  message: string;
  maxZoom?: number;
  layerId?: string;
  error?: string;
}

export interface MapGetSelectableOptions {
  layerId?: string;      // 특정 레이어 ID (없으면 모든 레이어)
}

export interface MapGetSelectableResult {
  success: boolean;
  message: string;
  isSelectable?: boolean;
  layerId?: string;
  error?: string;
}

// MapInfoService 관련 타입들
export interface MapInfoResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface MapCenterResult extends MapInfoResult {
  data?: {
    center: number[];
    lat: number;
    lng: number;
  };
}

export interface MapZoomResult extends MapInfoResult {
  data?: {
    current: number;
    min: number;
    max: number;
  };
}

export interface MapBoundsResult extends MapInfoResult {
  data?: {
    extent: number[];
    center: number[];
    zoom: number;
  };
}

// MapHistoryService 관련 타입들
export interface MapHistoryResult {
  success: boolean;
  message: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

// MapExportService 관련 타입들
export interface MapExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
}

export interface MapExportResult {
  success: boolean;
  message: string;
  dataUrl?: string;
}

export interface MapCopyViewResult {
  success: boolean;
  message: string;
  viewInfo?: {
    center: number[];
    zoom: number;
    rotation: number;
  };
} 