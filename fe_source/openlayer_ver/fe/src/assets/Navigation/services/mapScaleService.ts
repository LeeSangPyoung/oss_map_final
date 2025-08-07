// Navigation 패키지 - MapScaleService
// 담당 기능:
// - adjustScale (스케일 조정)

import { Map } from 'ol';

export interface MapScaleOptions {
  resolution?: number;
  duration?: number;
}

export interface MapScaleResult {
  success: boolean;
  message: string;
  previousResolution?: number;
  newResolution?: number;
}

export class MapScaleService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  adjustScale(options: MapScaleOptions = {}): MapScaleResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { resolution = 10, duration = 800 } = options;
    const view = this.map.getView();
    const previousResolution = view.getResolution();

    try {
      view.animate({ 
        resolution, 
        duration 
      });

      return {
        success: true,
        message: `스케일이 조정되었습니다. (해상도: ${previousResolution} → ${resolution})`,
        previousResolution,
        newResolution: resolution
      };
    } catch (error) {
      return {
        success: false,
        message: `스케일 조정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousResolution
      };
    }
  }

  getCurrentResolution(): number | undefined {
    if (!this.map) return undefined;
    return this.map.getView().getResolution();
  }
} 