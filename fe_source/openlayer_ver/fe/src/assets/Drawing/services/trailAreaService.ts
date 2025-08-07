// Drawing 패키지 - TrailAreaService
// 담당 기능: 면적 측정

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class TrailAreaService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 면적 측정 모드 활성화
  activateTrailAreaMode(): void {
    try {
      useMapbase.getState().setMode('trail-area');
    } catch (error) {
      console.error('Trail Area 모드 활성화 중 오류:', error);
      throw error;
    }
  }
} 