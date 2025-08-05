// MapHistory 패키지 메인 export
export { useMapHistory } from './hooks/useMapHistory';
export { MapHistoryService } from './services/mapHistoryService';
export type { 
  MapViewState, 
  MapHistoryState, 
  UseMapHistoryOptions, 
  MapHistoryActions 
} from './types';
export { 
  captureMapState, 
  restoreMapState, 
  isStateEqual, 
  limitHistorySize 
} from './utils/historyUtils'; 