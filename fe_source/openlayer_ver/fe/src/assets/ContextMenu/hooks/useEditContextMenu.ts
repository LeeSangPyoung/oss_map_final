// ContextMenu 패키지 - useEditContextMenu Hook
// 담당 기능: editContextMenu (편집 모드 우클릭 메뉴 설정)

import { useCallback } from 'react';
import { EditContextMenuService } from '../services/editContextMenuService';
import { useMapbase } from "../../../store/useMapbase";
import { EditContextMenuOptions, ContextMenuResult } from '../types';

export const useEditContextMenu = () => {
  const { map } = useMapbase();
  const editContextMenuService = new EditContextMenuService(map);

  const setEditContextMenu = useCallback((options: EditContextMenuOptions = {}): ContextMenuResult => {
    return editContextMenuService.setEditContextMenu(options);
  }, [editContextMenuService]);

  return {
    setEditContextMenu
  };
}; 