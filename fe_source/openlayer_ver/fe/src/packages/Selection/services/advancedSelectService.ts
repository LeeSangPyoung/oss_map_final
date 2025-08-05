// Selection 패키지 - AdvancedSelectService
// 담당 기능: 고급 선택 기능 (마우스 오버 포함)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class AdvancedSelectService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 고급 선택 기능 활성화
  activateAdvancedSelectMode(layerData?: any[]): void {
    try {
      useMapbase.getState().clearSelectedFeatures();
      useMapbase.getState().setSelectorMode('ADVANCED_SELECT');
      console.log('Advanced Select 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Select 모드 활성화 중 오류:', error);
      throw error;
    }
  }
} 