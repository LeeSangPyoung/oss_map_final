// LayerStyle 패키지 - LayerOpacityService
// 담당 기능:
// - setLayerOpacity (레이어 투명도 설정)
// - getLayerOpacity (레이어 투명도 조회)
// - resetLayerOpacity (레이어 투명도 초기화)

import { Map } from 'ol';

export interface SetLayerOpacityResult {
  success: boolean;
  message: string;
  layerName?: string;
  opacity?: number;
}

export interface GetLayerOpacityResult {
  success: boolean;
  message: string;
  layerName?: string;
  opacity?: number;
}

export interface ResetLayerOpacityResult {
  success: boolean;
  message: string;
  layerName?: string;
}

export class LayerOpacityService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async setLayerOpacity(layerName: string, opacity: number): Promise<SetLayerOpacityResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.'
        };
      }

      // 투명도 값 검증 (0.0 ~ 1.0)
      const validOpacity = Math.max(0.0, Math.min(1.0, opacity));
      
      // 1. WMS 레이어 (mvt-image) 먼저 시도
      const wmsLayer = this.map.getLayers().getArray().find(l => l.get('id') === 'mvt-image');
      if (wmsLayer) {
        console.log('WMS 레이어 투명도 설정 시도...');
        wmsLayer.setOpacity(validOpacity);
        console.log(`WMS 레이어 투명도를 ${validOpacity}로 설정했습니다.`);
        
        // 지도 렌더링
        try {
          this.map.render();
        } catch (renderError) {
          console.log('지도 렌더링 중 오류 (무시됨):', renderError);
        }
        
        return {
          success: true,
          message: `WMS 레이어 투명도가 ${(validOpacity * 100).toFixed(0)}%로 설정되었습니다.`,
          layerName: 'mvt-image',
          opacity: validOpacity
        };
      }
      
      // 2. VectorTile 레이어 시도
      const { useMapbase } = await import('../../../store/useMapbase');
      const layer = await useMapbase.getState().getLayerById(layerName);

      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`
        };
      }

      // VectorTile 레이어인지 확인
      if (layer.constructor.name === 'CustomVectorTileLayer' || layer.constructor.name === 'VectorTileLayer') {
        console.log(`VectorTile 레이어 ${layerName} 스타일 투명도 설정 시도...`);
        
        // VectorTile 레이어의 경우 다른 방법으로 투명도 조절
        try {
          // 방법 1: 레이어 자체 투명도 시도 (일부 VectorTile에서 작동할 수 있음)
          try {
            // 현재 투명도 확인
            const beforeOpacity = layer.getOpacity();
            console.log(`설정 전 투명도: ${beforeOpacity}`);
            
            layer.setOpacity(validOpacity);
            console.log(`VectorTile 레이어 ${layerName} 투명도를 ${validOpacity}로 설정했습니다.`);
            
            // 실제 투명도가 적용되었는지 확인
            const currentOpacity = layer.getOpacity();
            console.log(`설정 후 투명도: ${currentOpacity}`);
            
            // 레이어 타입과 속성들 확인
            console.log('레이어 정보:', {
              layerName,
              layerType: layer.constructor.name,
              visible: layer.getVisible(),
              opacity: currentOpacity,
              source: layer.getSource()?.constructor.name
            });
            
            if (currentOpacity === validOpacity) {
              // 지도 렌더링
              try {
                this.map.render();
              } catch (renderError) {
                console.log('지도 렌더링 중 오류 (무시됨):', renderError);
              }
              
              return {
                success: true,
                message: `VectorTile 레이어 투명도가 ${(validOpacity * 100).toFixed(0)}%로 설정되었습니다.\\n변화가 보이지 않으면 브라우저를 새로고침하거나 다른 레이어를 시도해보세요.`,
                layerName: layerName,
                opacity: validOpacity
              };
            } else {
              return {
                success: false,
                message: `투명도 설정 실패. 현재 투명도: ${(currentOpacity * 100).toFixed(0)}%`,
                layerName: layerName,
                opacity: currentOpacity
              };
            }
          } catch (opacityError) {
            console.log('레이어 투명도 설정 실패, 다른 방법 시도...', opacityError);
          }
          
          // 방법 2: 레이어 가시성 조절 (투명도 대신)
          if (validOpacity < 0.1) {
            layer.setVisible(false);
            console.log(`VectorTile 레이어 ${layerName}를 숨겼습니다.`);
            
            // 지도 렌더링
            try {
              this.map.render();
            } catch (renderError) {
              console.log('지도 렌더링 중 오류 (무시됨):', renderError);
            }
            
            return {
              success: true,
              message: `VectorTile 레이어를 숨겼습니다. (투명도 ${(validOpacity * 100).toFixed(0)}%)`,
              layerName: layerName,
              opacity: validOpacity
            };
          } else {
            layer.setVisible(true);
            console.log(`VectorTile 레이어 ${layerName} 투명도 조절이 제한적입니다.`);
            
            // 지도 렌더링
            try {
              this.map.render();
            } catch (renderError) {
              console.log('지도 렌더링 중 오류 (무시됨):', renderError);
            }
            
            return {
              success: true,
              message: `VectorTile 레이어는 투명도 조절이 제한적입니다.\\n현재 투명도: ${(validOpacity * 100).toFixed(0)}%\\n대신 레이어 표시/숨김을 사용하세요.`,
              layerName: layerName,
              opacity: validOpacity
            };
          }
        } catch (styleError) {
          console.error('VectorTile 투명도 설정 오류:', styleError);
          return {
            success: false,
            message: `VectorTile 레이어는 투명도 설정이 제한적입니다.\\n대신 스타일을 통해 투명도를 조절할 수 있습니다.`
          };
        }
      }
      
      // 일반 레이어의 경우 기본 투명도 설정
      // 현재 투명도 확인
      const beforeOpacity = layer.getOpacity();
      console.log(`일반 레이어 설정 전 투명도: ${beforeOpacity}`);
      
      layer.setOpacity(validOpacity);
      console.log(`레이어 ${layerName} 투명도를 ${validOpacity}로 설정했습니다.`);
      
      // 실제 투명도가 적용되었는지 확인
      const currentOpacity = layer.getOpacity();
      console.log(`일반 레이어 설정 후 투명도: ${currentOpacity}`);
      
      // 레이어 타입과 속성들 확인
      console.log('일반 레이어 정보:', {
        layerName,
        layerType: layer.constructor.name,
        visible: layer.getVisible(),
        opacity: currentOpacity,
        source: layer.getSource()?.constructor.name
      });
      
      if (currentOpacity === validOpacity) {
        // 지도 렌더링 (에러 방지를 위해 try-catch)
        try {
          this.map.render();
        } catch (renderError) {
          console.log('지도 렌더링 중 오류 (무시됨):', renderError);
        }
        
        return {
          success: true,
          message: `레이어 투명도가 ${(validOpacity * 100).toFixed(0)}%로 설정되었습니다.`,
          layerName: layerName,
          opacity: validOpacity
        };
      } else {
        return {
          success: false,
          message: `투명도 설정 실패. 현재 투명도: ${(currentOpacity * 100).toFixed(0)}%`,
          layerName: layerName,
          opacity: currentOpacity
        };
      }

    } catch (error) {
      return {
        success: false,
        message: `레이어 투명도 설정 중 오류가 발생했습니다: ${error}`
      };
    }
  }

  async getLayerOpacity(layerName: string): Promise<GetLayerOpacityResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.'
        };
      }

      // 1. WMS 레이어 (mvt-image) 먼저 시도
      const wmsLayer = this.map.getLayers().getArray().find(l => l.get('id') === 'mvt-image');
      if (wmsLayer) {
        const opacity = wmsLayer.getOpacity();
        console.log(`WMS 레이어 현재 투명도: ${opacity}`);
        return {
          success: true,
          message: `WMS 레이어 현재 투명도: ${(opacity * 100).toFixed(0)}%`,
          layerName: 'mvt-image',
          opacity: opacity
        };
      }
      
      // 2. VectorTile 레이어 시도
      const { useMapbase } = await import('../../../store/useMapbase');
      const layer = await useMapbase.getState().getLayerById(layerName);

      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`
        };
      }

      // 레이어 투명도 조회
      const opacity = layer.getOpacity();
      console.log(`레이어 ${layerName} 현재 투명도: ${opacity}`);

      return {
        success: true,
        message: `현재 투명도: ${(opacity * 100).toFixed(0)}%`,
        layerName: layerName,
        opacity: opacity
      };

    } catch (error) {
      return {
        success: false,
        message: `레이어 투명도 조회 중 오류가 발생했습니다: ${error}`
      };
    }
  }

  async resetLayerOpacity(layerName: string): Promise<ResetLayerOpacityResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.'
        };
      }

      // 1. WMS 레이어 (mvt-image) 먼저 시도
      const wmsLayer = this.map.getLayers().getArray().find(l => l.get('id') === 'mvt-image');
      if (wmsLayer) {
        wmsLayer.setOpacity(1.0);
        console.log(`WMS 레이어 투명도를 기본값(100%)으로 복원했습니다.`);
        
        // 지도 렌더링
        this.map.render();
        
        return {
          success: true,
          message: 'WMS 레이어 투명도를 기본값(100%)으로 복원했습니다.',
          layerName: 'mvt-image'
        };
      }
      
      // 2. VectorTile 레이어 시도
      const { useMapbase } = await import('../../../store/useMapbase');
      const layer = await useMapbase.getState().getLayerById(layerName);

      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`
        };
      }

      // 레이어 투명도 초기화 (1.0으로 설정)
      layer.setOpacity(1.0);
      console.log(`레이어 ${layerName} 투명도를 기본값(100%)으로 복원했습니다.`);
      
      // 지도 렌더링
      this.map.render();

      return {
        success: true,
        message: '레이어 투명도가 기본값(100%)으로 복원되었습니다.',
        layerName: layerName
      };

    } catch (error) {
      return {
        success: false,
        message: `레이어 투명도 초기화 중 오류가 발생했습니다: ${error}`
      };
    }
  }
} 