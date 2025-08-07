import { FeatureBase } from './Coords';

// 기존 타입 유지 (하위 호환성)
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

// 새로운 독립적인 모드 관리 구조
export type ActiveMode = 'none' | 'select' | 'pointDraw' | 'lineDraw' | 'polygonDraw' | 'measurement' | 'edit';

// 각 모드의 세부 타입
export type SelectMode = 'none' | 'basic' | 'advanced' | 'rect' | 'circle' | 'polygon';
export type DrawMode = 'none' | 'basic' | 'advanced';
export type MeasurementMode = 'none' | 'distance' | 'area';
export type EditMode = 'none' | 'edit' | 'delete';

// 새로운 모드 상태 인터페이스
export interface ModeState {
  // 현재 활성 모드 (단일 모드만 허용)
  activeMode: ActiveMode;
  
  // 각 모드의 세부 설정
  selectMode: SelectMode;
  pointDrawMode: DrawMode;
  lineDrawMode: DrawMode;
  polygonDrawMode: DrawMode;
  measurementMode: MeasurementMode;
  editMode: EditMode;
  
  // 모드별 활성화 상태 (디버깅용)
  isSelectActive: boolean;
  isPointDrawActive: boolean;
  isLineDrawActive: boolean;
  isPolygonDrawActive: boolean;
  isMeasurementActive: boolean;
  isEditActive: boolean;
}

export type ModeSelector = 'RECT' | 'POLYGON' | 'CIRCLE';

export interface ModeOptions {
  geoType?: 'LineString' | 'Polygon' | 'Point' | 'Rect' | 'Circle';
  feature?: any;
  areaDrawOption?: any;
}
