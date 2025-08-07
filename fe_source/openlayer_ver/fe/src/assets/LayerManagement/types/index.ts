// LayerManagement 패키지 타입 정의
// 레이어 정보/제어 관련 타입들

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

export interface LayerManagementOptions {
  layerId?: string;
  layerType?: string;
}

export interface LayerManagementResult {
  success: boolean;
  message: string;
  error?: string;
} 