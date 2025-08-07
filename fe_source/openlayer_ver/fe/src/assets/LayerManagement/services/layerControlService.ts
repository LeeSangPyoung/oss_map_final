// LayerManagement 패키지 - LayerControlService
// 담당 기능:
// - selectableFacility (선택 가능한 시설)
// - viewLayerInfo (레이어 정보 보기)
// - toggleDisplayHide (레이어 표시/숨김 토글)
// - refreshLayer (레이어 새로고침)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export interface SelectableFacilityResult {
  success: boolean;
  message: string;
  selectable?: boolean;
  error?: string;
}

export interface ViewLayerInfoResult {
  success: boolean;
  message: string;
  layerInfo?: any;
  error?: string;
}

export interface ToggleDisplayHideResult {
  success: boolean;
  message: string;
  visible?: boolean;
  error?: string;
}

export interface RefreshLayerResult {
  success: boolean;
  message: string;
  error?: string;
}

export class LayerControlService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async getSelectableFacility(layerName: string): Promise<SelectableFacilityResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.',
          error: 'Map not initialized'
        };
      }

      const layer = await useMapbase.getState().getLayerById(layerName);
      
      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`,
          error: 'Layer not found'
        };
      }

      const selectable = layer.get('selectable') || false;

      return {
        success: true,
        message: `레이어 '${layerName}'의 선택 가능 여부: ${selectable ? '가능' : '불가능'}`,
        selectable
      };
    } catch (error) {
      return {
        success: false,
        message: `선택 가능 여부 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }

  async viewLayerInfo(layerName: string): Promise<ViewLayerInfoResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.',
          error: 'Map not initialized'
        };
      }

      const layer = await useMapbase.getState().getLayerById(layerName);
      
      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`,
          error: 'Layer not found'
        };
      }

      const layerInfo = {
        id: layer.get('id'),
        name: layer.get('name'),
        type: layer.get('type'),
        visible: layer.getVisible(),
        opacity: layer.getOpacity(),
        zIndex: layer.getZIndex(),
        properties: layer.getProperties(),
        minZoom: layer.get('minZoom'),
        maxZoom: layer.get('maxZoom'),
        layerName: layer.get('layerName'),
        selectable: layer.get('selectable'),
        externalLayerName: layer.get('externalLayerName'),
        tableName: layer.get('tableName')
      };

      return {
        success: true,
        message: `레이어 '${layerName}' 정보를 조회했습니다.`,
        layerInfo
      };
    } catch (error) {
      return {
        success: false,
        message: `레이어 정보 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }

  async toggleDisplayHide(layerName: string): Promise<ToggleDisplayHideResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.',
          error: 'Map not initialized'
        };
      }

      const layer = await useMapbase.getState().getLayerById(layerName);
      
      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`,
          error: 'Layer not found'
        };
      }

      const currentVisible = layer.getVisible();
      layer.setVisible(!currentVisible);
      const newVisible = layer.getVisible();

      return {
        success: true,
        message: `레이어 '${layerName}' 표시 상태가 ${newVisible ? '보임' : '숨김'}으로 변경되었습니다.`,
        visible: newVisible
      };
    } catch (error) {
      return {
        success: false,
        message: `레이어 표시 상태 변경 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }

  async refreshLayer(layerName: string): Promise<RefreshLayerResult> {
    try {
      if (!this.map) {
        return {
          success: false,
          message: '지도가 초기화되지 않았습니다.',
          error: 'Map not initialized'
        };
      }

      const layer = await useMapbase.getState().getLayerById(layerName);
      
      if (!layer) {
        return {
          success: false,
          message: `레이어 '${layerName}'를 찾을 수 없습니다.`,
          error: 'Layer not found'
        };
      }

      // 레이어를 보이게 함 (숨겨진 경우 다시 보이게)
      layer.setVisible(true);
      
      // refresh 메서드가 있으면 호출
      if (typeof layer.refresh === 'function') {
        layer.refresh();
      }

      // 소스의 refresh 메서드가 있으면 호출
      const source = layer.getSource();
      if (source && typeof source.refresh === 'function') {
        source.refresh();
      }

      return {
        success: true,
        message: `레이어 '${layerName}'가 새로고침되고 표시되었습니다.`
      };
    } catch (error) {
      return {
        success: false,
        message: `레이어 새로고침 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }
} 