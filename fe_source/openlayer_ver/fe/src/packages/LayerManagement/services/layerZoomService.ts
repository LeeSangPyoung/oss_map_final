// LayerManagement 패키지 - LayerZoomService
// 담당 기능:
// - minDisplayZoomLevel (레이어 표시 최소 줌레벨)
// - maxDisplayZoomLevel (레이어 표시 최대 줌레벨)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export interface ZoomLevelResult {
  success: boolean;
  message: string;
  zoomLevel?: number;
  error?: string;
}

export class LayerZoomService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async getMinDisplayZoomLevel(layerName: string): Promise<ZoomLevelResult> {
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

      const minZoom = layer.get('minZoom') || layer.get('minDisplayZoomLevel') || 0;

      return {
        success: true,
        message: `레이어 '${layerName}'의 최소 표시 줌 레벨: ${minZoom}`,
        zoomLevel: minZoom
      };
    } catch (error) {
      return {
        success: false,
        message: `최소 줌 레벨 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }

  async getMaxDisplayZoomLevel(layerName: string): Promise<ZoomLevelResult> {
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

      const maxZoom = layer.get('maxZoom') || layer.get('maxDisplayZoomLevel') || 22;

      return {
        success: true,
        message: `레이어 '${layerName}'의 최대 표시 줌 레벨: ${maxZoom}`,
        zoomLevel: maxZoom
      };
    } catch (error) {
      return {
        success: false,
        message: `최대 줌 레벨 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }
} 