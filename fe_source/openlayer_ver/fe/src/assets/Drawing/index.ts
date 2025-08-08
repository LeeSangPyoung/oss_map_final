// Drawing 패키지 - 메인 export 파일

// 기존 서비스들
export { TrailDistanceService } from './services/trailDistanceService';
export { TrailAreaService } from './services/trailAreaService';
export { TrailSimpleService } from './services/trailSimpleService';
export { AreaDrawRectService } from './services/areaDrawRectService';
export { AreaDrawCircleService } from './services/areaDrawCircleService';
export { AreaDrawPolygonService } from './services/areaDrawPolygonService';

// 새로운 Trail Draw 서비스들
export { TrailDrawPointService } from './services/trailDrawPointService';
export { TrailDrawLineService } from './services/trailDrawLineService';
export { AdvancedTrailDrawLineService } from './services/advancedTrailDrawLineService';
export { TrailDrawPolygonService } from './services/trailDrawPolygonService';
export { AdvancedTrailDrawPolygonService } from './services/advancedTrailDrawPolygonService';
export { AdvancedTrailDrawPointService } from './services/advancedTrailDrawPointService';
export { GetTrailCoordinateService } from './services/getTrailCoordinateService';

// 콜백 인터페이스들
export type { TrailDrawPointCallbacks } from './services/trailDrawPointService';
export type { TrailDrawLineCallbacks } from './services/trailDrawLineService';
export type { AdvancedTrailDrawLineCallbacks } from './services/advancedTrailDrawLineService';
export type { TrailDrawPolygonCallbacks } from './services/trailDrawPolygonService';
export type { AdvancedTrailDrawPolygonCallbacks } from './services/advancedTrailDrawPolygonService';
export type { AdvancedTrailDrawPointCallbacks } from './services/advancedTrailDrawPointService';

// 전역 정리 함수들
export { TrailDrawPointService as TrailDrawPointCleanup } from './services/trailDrawPointService';
export { TrailDrawLineService as TrailDrawLineCleanup } from './services/trailDrawLineService';
export { AdvancedTrailDrawLineService as AdvancedTrailDrawLineCleanup } from './services/advancedTrailDrawLineService';
export { TrailDrawPolygonService as TrailDrawPolygonCleanup } from './services/trailDrawPolygonService';
export { AdvancedTrailDrawPolygonService as AdvancedTrailDrawPolygonCleanup } from './services/advancedTrailDrawPolygonService';
export { AdvancedTrailDrawPointService as AdvancedTrailDrawPointCleanup } from './services/advancedTrailDrawPointService';

// 기존 훅들
export { useTrailDistance } from './hooks/useTrailDistance';
export { useTrailArea } from './hooks/useTrailArea';
export { useAdvancedTrailDistance } from './hooks/useAdvancedTrailDistance';
export { useAdvancedTrailArea } from './hooks/useAdvancedTrailArea';
export { useTrailSimple } from './hooks/useTrailSimple';
export { useAreaDrawRect } from './hooks/useAreaDrawRect';
export { useAreaDrawCircle } from './hooks/useAreaDrawCircle';
export { useAreaDrawPolygon } from './hooks/useAreaDrawPolygon';

// 새로운 Trail Draw 훅들
export { useTrailDrawPoint, activateTrailDrawPointMode } from './hooks/useTrailDrawPoint';
export { useTrailDrawLine, activateTrailDrawLineMode } from './hooks/useTrailDrawLine';
export { useAdvancedTrailDrawLine, activateAdvancedTrailDrawLineMode } from './hooks/useAdvancedTrailDrawLine';
export { useTrailDrawPolygon, activateTrailDrawPolygonMode } from './hooks/useTrailDrawPolygon';
export { useAdvancedTrailDrawPolygon, activateAdvancedTrailDrawPolygonMode } from './hooks/useAdvancedTrailDrawPolygon';
export { useAdvancedTrailDrawPoint, activateAdvancedTrailDrawPointMode } from './hooks/useAdvancedTrailDrawPoint';
export { useGetTrailCoordinate, getTrailCoordinates } from './hooks/useGetTrailCoordinate';

// 기존 activate 함수들
export { activateTrailDistanceMode } from './hooks/useTrailDistance';
export { activateTrailAreaMode } from './hooks/useTrailArea';
export { activateTrailSimpleMode } from './hooks/useTrailSimple';
export { activateAreaDrawRectMode } from './hooks/useAreaDrawRect';
export { activateAreaDrawCircleMode } from './hooks/useAreaDrawCircle';
export { activateAreaDrawPolygonMode } from './hooks/useAreaDrawPolygon';

// 타입들
export type { GetTrailCoordinateResult } from './services/getTrailCoordinateService'; 