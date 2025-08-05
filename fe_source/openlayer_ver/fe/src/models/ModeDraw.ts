import { FeatureBase } from './Coords';

export type ModeDraw = 
  | 'select' 
  | 'advanced-select'
  | 'trail-distance' 
  | 'trail-area' 
  | 'trail-simple' 
  | 'area-draw' 
  | 'trail-draw' 
  | 'advanced-trail-draw'
  | 'advanced-trail-draw-polygon'
  | 'advanced-trail-draw-point'
  | 'draw-end'
  | 'trail-edit';

export type ModeSelector = 'RECT' | 'POLYGON' | 'CIRCLE';

export interface ModeOptions {
  geoType?: 'LineString' | 'Polygon' | 'Point' | 'Rect' | 'Circle';
  feature?: any;
  areaDrawOption?: any;
}
