import { Feature, Map } from 'ol';
import { Geometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';

export interface DrawMapParams {
  map?: Map | null;
  vectorSource?: VectorSource<Feature<Geometry>>;
  onEndDraw?: () => void;
  onStartDraw?: () => void;
}
