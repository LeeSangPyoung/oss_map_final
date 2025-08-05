// UserLayer 패키지 타입 정의

export interface UserLayerFeature {
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[] | number[][] | [[number[]]];
  };
  style?: {
    id: string;
    [key: string]: any;
  };
  properties?: {
    [key: string]: any;
  };
}

export interface UserLayerConfig {
  layerName: string;
  features?: UserLayerFeature[];
  style?: {
    id: string;
    [key: string]: any;
  };
  visible?: boolean;
  zIndex?: number;
}

export interface AddUserLayerOptions {
  layerName?: string;
  features?: UserLayerFeature[];
  style?: {
    id: string;
    [key: string]: any;
  };
}

export interface AddUserLayerResult {
  success: boolean;
  message: string;
  layerName?: string;
  layer?: any;
  error?: string;
}

export interface InitUserLayerOptions {
  layerName?: string;
}

export interface InitUserLayerResult {
  success: boolean;
  message: string;
  layerName?: string;
  error?: string;
}

export interface DeleteUserLayerOptions {
  layerName: string;
}

export interface DeleteUserLayerResult {
  success: boolean;
  message: string;
  layerName?: string;
  error?: string;
}

export interface EntireAreaUserLayerOptions {
  layerName: string;
}

export interface EntireAreaUserLayerResult {
  success: boolean;
  message: string;
  layerName?: string;
  bounds?: number[];
  center?: number[];
  zoom?: number;
  error?: string;
} 