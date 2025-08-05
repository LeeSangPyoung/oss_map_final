export interface MapViewState {
  center: [number, number];
  zoom: number;
  rotation: number;
  extent?: [number, number, number, number];
}

export interface MapHistoryState {
  past: MapViewState[];
  present: MapViewState;
  future: MapViewState[];
}

export interface UseMapHistoryOptions {
  maxHistorySize?: number;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
}

export interface MapHistoryActions {
  back: (animationDuration?: number) => void;
  forward: (animationDuration?: number) => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  saveCurrentState: () => void;
  clearHistory: () => void;
  getHistoryInfo: () => { pastCount: number; futureCount: number };
} 