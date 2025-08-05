// LayerStyle 패키지 - LayerDisplayService
// 담당 기능:
// - setLayerDisplayLevel (레이어 표시 레벨 설정)

import { Map } from 'ol';

export interface SetLayerDisplayLevelResult {
  success: boolean;
  message: string;
  layerName?: string;
  minZoom?: number;
  maxZoom?: number;
}

export class LayerDisplayService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async setLayerDisplayLevel(layerName: string, minZoom: number, maxZoom: number): Promise<SetLayerDisplayLevelResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.'
        };
      }

      // useMapbase를 통해 레이어 가져오기
      const { useMapbase } = await import('../../../store/useMapbase');
      const layer = await useMapbase.getState().getLayerById(layerName);

      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`
        };
      }

      // 현재 줌 레벨 확인
      const currentMinZoom = layer.get('minZoom');
      
      // 레이어 표시 레벨 설정
      layer.setUserLayerConfig({
        minZoom: minZoom,
        maxZoom: maxZoom
      });

      return {
        success: true,
        message: `레이어 '${layerName}'의 표시 줌 레벨이 변경되었습니다!\\n현재: 줌 ${minZoom}-${maxZoom}`,
        layerName: layerName,
        minZoom: minZoom,
        maxZoom: maxZoom
      };

    } catch (error) {
      return {
        success: false,
        message: `레이어 표시 레벨 설정 중 오류가 발생했습니다: ${error}`
      };
    }
  }
} 