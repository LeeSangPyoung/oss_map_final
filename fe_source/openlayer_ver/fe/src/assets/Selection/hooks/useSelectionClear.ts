// Selection 패키지 - useSelectionClear Hook
// 담당 기능: 선택 레이어 초기화

import { useCallback } from 'react';
import { SelectionClearService } from '../services/selectionClearService';
import { useMapbase } from "../../../store/useMapbase";

export const useSelectionClear = () => {
  const { map } = useMapbase();
  const selectionClearService = new SelectionClearService(map);

  const clearSelectLayer = useCallback(() => {
    return selectionClearService.clearSelectLayer();
  }, [selectionClearService]);

  return {
    clearSelectLayer
  };
};

// Clear Select Layer 함수 (MainPage에서 사용)
export const clearSelectLayer = () => {
  try {
    useMapbase.getState().clearSelectedFeatures?.();
    console.log('선택된 피처들이 초기화되었습니다.');
  } catch (error) {
    console.error('Clear Select Layer 실행 중 오류:', error);
    throw error;
  }
}; 