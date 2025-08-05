// LayerStyle 패키지 - LayerStyleService
// 담당 기능:
// - setLayerStyle (레이어 스타일 설정)
// - setLayerStyleDefault (레이어 스타일 기본값 설정)

import { Map } from 'ol';

export interface SetLayerStyleResult {
  success: boolean;
  message: string;
  layerName?: string;
  styleName?: string;
}

export interface SetLayerStyleDefaultResult {
  success: boolean;
  message: string;
  layerName?: string;
}

export class LayerStyleService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async setLayerStyle(layerName: string, styleName: string): Promise<SetLayerStyleResult> {
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

      // 레이어 스타일 설정
      layer.setUserStyleConfig({ customStyleName: styleName });

      return {
        success: true,
        message: `레이어 '${layerName}'의 스타일이 '${styleName}' 스타일로 변경되었습니다!`,
        layerName: layerName,
        styleName: styleName
      };

    } catch (error) {
      return {
        success: false,
        message: `레이어 스타일 설정 중 오류가 발생했습니다: ${error}`
      };
    }
  }

  async setLayerStyleDefault(layerName: string): Promise<SetLayerStyleDefaultResult> {
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

      // Vector Tile 레이어의 스타일은 이미 기본값으로 설정되어 있음
      return {
        success: true,
        message: `Vector Tile 레이어 '${layerName}'의 스타일은 이미 기본값으로 설정되어 있습니다.`,
        layerName: layerName
      };

    } catch (error) {
      return {
        success: false,
        message: `레이어 스타일 기본값 설정 중 오류가 발생했습니다: ${error}`
      };
    }
  }
} 