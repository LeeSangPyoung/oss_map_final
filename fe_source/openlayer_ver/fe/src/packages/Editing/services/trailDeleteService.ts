// Editing 패키지 - TrailDeleteService
// 담당 기능: 트레일 삭제

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';
import { deleteSelectedFeature } from '../../../packages/LayerControl';

export class TrailDeleteService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // 트레일 삭제 모드 활성화
  async activateTrailDeleteMode(): Promise<void> {
    try {
      const selected = useMapbase.getState().selectedFeatures;
      
      if (!selected || selected.length !== 1) {
        alert('삭제할 피처를 하나만 선택하세요.');
        return;
      }

      // 선택된 피처 정보 확인
      const selectedFeature = selected[0];
      console.log('🗑️ 삭제할 피처:', {
        id: selectedFeature.id,
        type: selectedFeature.geometry?.type,
        coordinates: selectedFeature.geometry?.coordinates
      });

      // 삭제 실행
      const result = await deleteSelectedFeature(selected as any, null);
      
      if (result.success) {
        alert('피처가 성공적으로 삭제되었습니다.');
        
        // 선택 해제
        useMapbase.getState().setSelectedFeatures([]);
        
        // WMS 레이어 새로고침
        if (this.map) {
          const layers = this.map.getLayers().getArray() || [];
          layers.forEach(layer => {
            if (layer.getSource() && layer.getSource().refresh) {
              console.log('🔄 WMS 레이어 새로고침:', layer.get('layerName') || 'unknown');
              layer.getSource().refresh();
            }
          });
        }
      } else {
        alert('삭제 실패: ' + result.message);
      }
    } catch (error) {
      console.error('🗑️ 삭제 중 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
      throw error;
    }
  }
} 