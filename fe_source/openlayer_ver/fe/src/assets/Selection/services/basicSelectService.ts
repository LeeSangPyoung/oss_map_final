// Selection 패키지 - BasicSelectService
// 담당 기능: 기본 선택 기능 (마우스 오버 없음)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class BasicSelectService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 기본 선택 기능 활성화
  activateSelectMode(layerData?: any[]): void {
    try {
      useMapbase.getState().clearSelectedFeatures();
      useMapbase.getState().setSelectorMode('SELECT');
      console.log('Select 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Select 모드 활성화 중 오류:', error);
      throw error;
    }
  }
} 