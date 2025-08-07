// ContextMenu 패키지 - EditContextMenuService
// 담당 기능: editContextMenu (편집 모드 우클릭 메뉴 설정)
// fe6_3와 동일한 기능 구현

import { Map } from 'ol';
import { 
  EditContextMenuOptions, 
  ContextMenuResult,
  ContextMenuItem 
} from '../types';

export class EditContextMenuService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  setEditContextMenu(options: EditContextMenuOptions = {}): ContextMenuResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.',
        error: 'Map not initialized'
      };
    }

    try {
      // 편집 모드 메뉴 아이템 설정 (수정, 삭제)
      const editMenuItems = [
        {
          label: '수정',
          onClick: function () {
            // Trail Edit 모드 활성화
            if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
              const map = (window as any).mapbaseStore.getState().mapRef?.current;
              if (map) {
                try {
                  // activateTrailEditMode 함수 호출
                  if (typeof (window as any).activateTrailEditMode === 'function') {
                    (window as any).activateTrailEditMode(map);
                  }
                } catch (error) {
                  console.error('Trail Edit 모드 활성화 실패:', error);
                }
              }
            }
          },
        },
        {
          label: '삭제',
          onClick: function () {
            // Trail Delete 모드 활성화
            if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
              const map = (window as any).mapbaseStore.getState().mapRef?.current;
              if (map) {
                try {
                  // activateTrailDeleteMode 함수 호출
                  if (typeof (window as any).activateTrailDeleteMode === 'function') {
                    (window as any).activateTrailDeleteMode(map);
                  }
                } catch (error) {
                  console.error('Trail Delete 모드 활성화 실패:', error);
                }
              }
            }
          },
        },
      ];

      // 전역 상태에 메뉴 설정 저장 (fe6_3 방식)
      if (typeof window !== 'undefined' && (window as any).mapbaseStore) {
        (window as any).mapbaseStore.getState().setDefaultContextMenu(editMenuItems);
      }

      return {
        success: true,
        message: '편집 모드 우클릭 메뉴가 설정되었습니다.',
        menuConfig: {
          items: editMenuItems,
          type: 'edit'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `편집 모드 우클릭 메뉴 설정 중 오류가 발생했습니다: ${error}`,
        error: String(error)
      };
    }
  }
} 