// ContextMenu 패키지 - DefaultContextMenuService
// 담당 기능: defaultContextMenu (기본 우클릭 메뉴 설정)
// fe6_3와 동일한 기능 구현

import { Map } from 'ol';
import { 
  DefaultContextMenuOptions, 
  ContextMenuResult,
  ContextMenuItem 
} from '../types';

export class DefaultContextMenuService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  setDefaultContextMenu(options: DefaultContextMenuOptions = {}): ContextMenuResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.',
        error: 'Map not initialized'
      };
    }

    try {
      // fe6_3와 동일한 기본 메뉴 아이템 설정
      const defaultMenuItems = [
        {
          label: 'ZoomIn',
          onClick: function () {
            // useMapbase의 zoomIn 호출
            if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
              (window as any).mapbaseStore.getState().zoomIn();
            }
          },
        },
        {
          label: 'Zoomout',
          onClick: function () {
            // useMapbase의 zoomOut 호출
            if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
              (window as any).mapbaseStore.getState().zoomOut();
            }
          },
        },
      ];

      // 전역 상태에 메뉴 설정 저장 (fe6_3 방식)
      if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
        (window as any).mapbaseStore.getState().setDefaultContextMenu(defaultMenuItems);
      }

      return {
        success: true,
        message: '기본 우클릭 메뉴가 설정되었습니다.',
        menuConfig: {
          items: defaultMenuItems,
          type: 'default'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `기본 우클릭 메뉴 설정 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }
} 