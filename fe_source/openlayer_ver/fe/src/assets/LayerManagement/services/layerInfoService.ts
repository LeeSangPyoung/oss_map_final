// LayerManagement 패키지 - LayerInfoService
// 담당 기능:
// - getLayer (레이어 정보 가져오기)
// - externalLayerName (외부 레이어 aliasName 가져오기)
// - tableNameOfLayer (레이어 테이블명 가져오기)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';

export interface LayerInfoResult {
  success: boolean;
  message: string;
  layerInfo?: any;
  error?: string;
}

export interface ExternalLayerNameResult {
  success: boolean;
  message: string;
  externalLayerName?: string;
  error?: string;
}

export interface TableNameResult {
  success: boolean;
  message: string;
  tableName?: string;
  error?: string;
}

export class LayerInfoService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async getLayer(layerName: string): Promise<LayerInfoResult> {
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
        sourceParams: layer.getSource()?.getParams?.() || {},
        minZoom: layer.get('minZoom'),
        maxZoom: layer.get('maxZoom'),
        layerName: layer.get('layerName')
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

  async getExternalLayerName(layerName: string): Promise<ExternalLayerNameResult> {
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

      const externalLayerName = layer.get('externalLayerName') || layer.get('aliasName') || layerName;

      return {
        success: true,
        message: `레이어 '${layerName}'의 외부 레이어명: ${externalLayerName}`,
        externalLayerName
      };
    } catch (error) {
      return {
        success: false,
        message: `외부 레이어명 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }

  async getTableNameOfLayer(layerName: string): Promise<TableNameResult> {
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

      const tableName = layer.get('tableName') || layer.get('sourceTable') || layerName;

      return {
        success: true,
        message: `레이어 '${layerName}'의 테이블명: ${tableName}`,
        tableName
      };
    } catch (error) {
      return {
        success: false,
        message: `테이블명 조회 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }
} 