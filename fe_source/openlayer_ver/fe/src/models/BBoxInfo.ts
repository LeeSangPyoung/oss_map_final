interface Geometry {
  type: string;
  coordinates: [number, number];
}

interface Feature {
  geometry?: Geometry;
  properties?: string;
}

export interface BBoxInfo {
  features: Feature[];
  total?: number;
  type?: string;
}
