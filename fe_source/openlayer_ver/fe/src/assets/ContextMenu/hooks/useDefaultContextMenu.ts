// ContextMenu 패키지 - useDefaultContextMenu Hook
// 담당 기능: defaultContextMenu (기본 우클릭 메뉴 설정)

import { useCallback } from 'react';
import { DefaultContextMenuService } from '../services/defaultContextMenuService';
import { useMapbase } from "../../../store/useMapbase";
import { DefaultContextMenuOptions, ContextMenuResult } from '../types';

export const useDefaultContextMenu = () => {
  const { map } = useMapbase();
  const defaultContextMenuService = new DefaultContextMenuService(map);

  const setDefaultContextMenu = useCallback((options: DefaultContextMenuOptions = {}): ContextMenuResult => {
    return defaultContextMenuService.setDefaultContextMenu(options);
  }, [defaultContextMenuService]);

  return {
    setDefaultContextMenu
  };
}; 