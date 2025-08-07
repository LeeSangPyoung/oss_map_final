// Editing 패키지 - TrailEditService
// 담당 기능: 트레일 편집

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export class TrailEditService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 트레일 편집 모드 활성화
  activateTrailEditMode(): void {
    try {
      const selected = useMapbase.getState().selectedFeatures;
      if (!selected || selected.length !== 1) {
        console.log('편집할 객체를 하나만 선택하세요.');
        return;
      }
      
      // geoType을 feature의 geometry.type에서 추출
      let geoType: 'LineString' | 'Polygon' | 'Point' = 'LineString';
      if (selected[0]?.geometry?.type === 'Polygon') geoType = 'Polygon';
      else if (selected[0]?.geometry?.type === 'Point') geoType = 'Point';
      
      useMapbase.getState().setMode('trail-edit', { feature: selected[0], geoType });
      console.log('Trail Edit 모드가 활성화되었습니다. - geoType:', geoType);
    } catch (error) {
      console.error('Trail Edit 모드 활성화 중 오류:', error);
      throw error;
    }
  }
} 