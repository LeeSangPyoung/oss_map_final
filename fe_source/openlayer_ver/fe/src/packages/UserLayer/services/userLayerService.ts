// UserLayer 패키지 - UserLayerService
// 담당 기능:
// - addUserLayer (사용자 레이어 추가)
// - initUserLayer (사용자 레이어 초기화)
// - deleteUserLayer (사용자 레이어 삭제)
// - entireAreaUserLayer (사용자 레이어 전체 영역)

import { Map } from 'ol';
import { useMapbase } from '../../../store/useMapbase';
import {
  AddUserLayerOptions,
  AddUserLayerResult,
  InitUserLayerOptions,
  InitUserLayerResult,
  DeleteUserLayerOptions,
  DeleteUserLayerResult,
  EntireAreaUserLayerOptions,
  EntireAreaUserLayerResult,
  UserLayerFeature
} from '../types';

export class UserLayerService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  async addUserLayer(options: AddUserLayerOptions = {}): Promise<AddUserLayerResult> {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { layerName = 'TEST_USER_LAYER', features = [], style } = options;

    try {
      const mapStore = useMapbase.getState();
      
      // 기존 레이어 확인
      let layer = mapStore.getCustomLayerByName(layerName);
      
      // 레이어가 없으면 새로 생성
      if (!layer) {
        layer = mapStore.addCustomLayerByName(layerName);
      }

      if (!layer) {
        return {
          success: false,
          error: '사용자 레이어를 생성할 수 없습니다.',
          message: '사용자 레이어를 생성할 수 없습니다.'
        };
      }

      // 전달받은 피처가 있으면 사용하고, 없으면 기본 피처 추가
      if (features && features.length > 0) {
        layer.addData(features);
      } else {
        const defaultFeatures: UserLayerFeature[] = [
          {
            geometry: {
              type: 'Point',
              coordinates: [127.062289345605, 37.5087805938127],
            },
            style: { id: 'nodeBusinessPlan' },
          },
          {
            geometry: {
              type: 'LineString',
              coordinates: [
                [127.062289345605, 37.5087805938127],
                [127.045617, 37.495418],
              ],
            },
            style: { id: 'linkSafeWayHome' },
          },
        ];
        
        layer.addData(defaultFeatures);
      }

      return {
        success: true,
        message: `${layerName}에 피처가 추가되었습니다.`,
        layerName,
        layer
      };
    } catch (error) {
      return {
        success: false,
        error: `사용자 레이어 추가 중 오류: ${error}`,
        message: `사용자 레이어 추가 중 오류: ${error}`
      };
    }
  }

  async initUserLayer(options: InitUserLayerOptions = {}): Promise<InitUserLayerResult> {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { layerName = 'TEST_USER_LAYER' } = options;

    try {
      const mapStore = useMapbase.getState();
      const layer = mapStore.getCustomLayerByName(layerName);
      
      if (layer) {
        layer.clearLayers();
        return {
          success: true,
          message: `${layerName}가 초기화되었습니다. 모든 피처가 제거되었습니다.`,
          layerName
        };
      } else {
        return {
          success: false,
          error: `${layerName}가 존재하지 않습니다.`,
          message: `${layerName}가 존재하지 않습니다.`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `사용자 레이어 초기화 중 오류: ${error}`,
        message: `사용자 레이어 초기화 중 오류: ${error}`
      };
    }
  }

  async deleteUserLayer(options: DeleteUserLayerOptions): Promise<DeleteUserLayerResult> {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { layerName } = options;

    try {
      const mapStore = useMapbase.getState();
      const layer = mapStore.getCustomLayerByName(layerName);
      
      if (layer) {
        mapStore.removeCustomLayerByName(layerName);
        return {
          success: true,
          message: `${layerName}가 삭제되었습니다.`,
          layerName
        };
      } else {
        return {
          success: false,
          error: `${layerName}가 존재하지 않습니다.`,
          message: `${layerName}가 존재하지 않습니다.`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `사용자 레이어 삭제 중 오류: ${error}`,
        message: `사용자 레이어 삭제 중 오류: ${error}`
      };
    }
  }

  async entireAreaUserLayer(options: EntireAreaUserLayerOptions): Promise<EntireAreaUserLayerResult> {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { layerName } = options;

    try {
      const mapStore = useMapbase.getState();
      const layer = mapStore.getCustomLayerByName(layerName);
      
      if (!layer) {
        return {
          success: false,
          error: `${layerName}가 존재하지 않습니다.`,
          message: `${layerName}가 존재하지 않습니다.`
        };
      }

      // 레이어의 전체 영역 계산
      const bounds = layer.getBounds();
      
      if (bounds && bounds.length === 4) {
        // 지도를 전체 영역으로 이동
        const view = this.map.getView();
        view.fit(bounds, {
          duration: 800,
          padding: [50, 50, 50, 50]
        });

        return {
          success: true,
          message: `${layerName}의 전체 영역으로 이동했습니다.`,
          layerName,
          bounds,
          center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
          zoom: view.getZoom()
        };
      } else {
        return {
          success: false,
          error: `${layerName}의 영역을 계산할 수 없습니다.`,
          message: `${layerName}의 영역을 계산할 수 없습니다.`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `사용자 레이어 전체 영역 이동 중 오류: ${error}`,
        message: `사용자 레이어 전체 영역 이동 중 오류: ${error}`
      };
    }
  }
} 