// LayerStyle 패키지 - LayerThematicsService
// 담당 기능:
// - setThematics (테마틱 스타일 설정)

import { Map } from 'ol';

export interface SetThematicsResult {
  success: boolean;
  message: string;
  layerName?: string;
  thematicConfig?: any;
}

export class LayerThematicsService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async setThematics(layerName: string, thematicConfig: any = {}): Promise<SetThematicsResult> {
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

      // 테마틱 스타일 적용
      await layer.setThemematics({ customStyleName: 'polygon-thematics' });
      
      // 맵 새로고침으로 변경사항 강제 적용
      setTimeout(() => {
        this.map?.updateSize();
        this.map?.render();
      }, 500);

      return {
        success: true,
        message: `테마틱 스타일이 적용되었습니다!\\n레이어가 테마틱 스타일로 변경되었습니다.\\n변경사항이 보이지 않으면 줌을 조금 변경해보세요.`,
        layerName: layerName,
        thematicConfig: thematicConfig
      };

    } catch (error) {
      return {
        success: false,
        message: `테마틱 스타일 설정 중 오류가 발생했습니다: ${error}`
      };
    }
  }
} 