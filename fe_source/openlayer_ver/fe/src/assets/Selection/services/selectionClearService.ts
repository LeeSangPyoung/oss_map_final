// Selection 패키지 - SelectionClearService
// 담당 기능: 선택 레이어 초기화

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class SelectionClearService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 선택된 피처들 초기화
  clearSelectLayer(): void {
    try {
      useMapbase.getState().clearSelectedFeatures?.();
      console.log('선택된 피처들이 초기화되었습니다.');
    } catch (error) {
      console.error('Clear Select Layer 실행 중 오류:', error);
      throw error;
    }
  }
} 