// Navigation 패키지 - MapHistoryService
// 담당 기능:
// - prevscreen (이전 화면)
// - forwardscreen (다음 화면)

import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import { useMapHistoryStore } from '../../../store/useHistoryStore';

export interface MapHistoryResult {
  success: boolean;
  message: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export class MapHistoryService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  prevScreen(): MapHistoryResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      // useMapHistoryStore에서 back 함수 호출
      const { back, isBack } = useMapHistoryStore.getState();
      
      if (!isBack()) {
        return {
          success: false,
          message: '이전 화면이 없습니다.',
          canGoBack: false
        };
      }

      // 직접 호출
      useMapHistoryStore.getState().back();

      return {
        success: true,
        message: '이전 화면으로 이동했습니다.',
        canGoBack: isBack(),
        canGoForward: true
      };
    } catch (error) {
      return {
        success: false,
        message: `이전 화면 이동 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  forwardScreen(): MapHistoryResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      // useMapHistoryStore에서 forward 함수 호출
      const { forward, isForward } = useMapHistoryStore.getState();
      
      if (!isForward()) {
        return {
          success: false,
          message: '다음 화면이 없습니다.',
          canGoForward: false
        };
      }

      // 직접 호출
      useMapHistoryStore.getState().forward();

      return {
        success: true,
        message: '다음 화면으로 이동했습니다.',
        canGoBack: true,
        canGoForward: isForward()
      };
    } catch (error) {
      return {
        success: false,
        message: `다음 화면 이동 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  canGoBack(): boolean {
    try {
      const { isBack } = useMapHistoryStore.getState();
      return isBack();
    } catch (error) {
      return false;
    }
  }

  canGoForward(): boolean {
    try {
      const { isForward } = useMapHistoryStore.getState();
      return isForward();
    } catch (error) {
      return false;
    }
  }
} 