import RenderFeature from 'ol/render/Feature';

export interface Coords {
  x: number;
  y: number;
  z: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface FeatureBase {
  id: string;
  type?: string;
  geometry?: {
    type: string;
    coordinates: number[];
  };
  isSelected?: boolean;
  nativeFeature?: RenderFeature;
  properties?: {
    [key: string]: any;
  };
}
export interface FeatureDetail {
  type?: string;
  id: string;
  geometry: {
    type?: string;
    coordinates: number[];
  };
  properties?: {
    type?: string;
    property?: string;
  };
}
