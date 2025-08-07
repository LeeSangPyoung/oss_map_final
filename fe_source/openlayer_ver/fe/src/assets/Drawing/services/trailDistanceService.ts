// Drawing 패키지 - TrailDistanceService
// 담당 기능: 거리 측정

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class TrailDistanceService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 거리 측정 모드 활성화
  activateTrailDistanceMode(): void {
    try {
      useMapbase.getState().setMode('trail-distance');
    } catch (error) {
      console.error('Trail Distance 모드 활성화 중 오류:', error);
      throw error;
    }
  }
} 