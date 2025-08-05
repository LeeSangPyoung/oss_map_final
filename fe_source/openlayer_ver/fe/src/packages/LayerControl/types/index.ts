export interface FeatureBase {
  id: string;
  geometry?: {
    type: string;
    coordinates: number[];
  };
  properties?: Record<string, any>;
  type?: string;
}

export interface DeleteFeatureParams {
  feature: FeatureBase;
  layerName?: string;
}

export interface DeleteFeatureResult {
  success: boolean;
  message: string;
  deletedFeatureId?: string;
  error?: string;
}

export type GeometryType = 'Point' | 'LineString' | 'MultiLineString' | 'Polygon';
