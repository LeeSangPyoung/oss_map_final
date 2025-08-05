import { useCallback, useState } from 'react';
import { deleteFeatureService } from '../services/layerDeleteService';
import { DeleteFeatureParams, DeleteFeatureResult, FeatureBase } from '../types';

interface UseLayerDeleteReturn {
  isDeleting: boolean;
  deleteFeature: (params: DeleteFeatureParams) => Promise<DeleteFeatureResult>;
  lastResult: DeleteFeatureResult | null;
  resetResult: () => void;
}

/**
 * 레이어 삭제 훅
 * 현재 프로젝트에 영향을 주지 않도록 독립적으로 동작
 */
export const useLayerDelete = (): UseLayerDeleteReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastResult, setLastResult] = useState<DeleteFeatureResult | null>(null);

  const deleteFeature = useCallback(async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
    setIsDeleting(true);
    
    try {
      console.log('🗑️ useLayerDelete - 삭제 시작:', {
        featureId: params.feature.id,
        geometryType: params.feature.geometry.type
      });

      // 삭제 서비스 호출
      const result = await deleteFeatureService(params);
      
      // 결과 저장
      setLastResult(result);
      
      console.log('🗑️ useLayerDelete - 삭제 완료:', result);
      
      return result;
    } catch (error) {
      console.error('🗑️ useLayerDelete - 삭제 중 오류:', error);
      
      const errorResult: DeleteFeatureResult = {
        success: false,
        message: '삭제 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const resetResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    isDeleting,
    deleteFeature,
    lastResult,
    resetResult
  };
};

/**
 * 선택된 피처 삭제 헬퍼 함수
 * useMapbase의 selectedFeatures를 사용하여 삭제
 */
export const deleteSelectedFeature = async (
  selectedFeatures: FeatureBase[],
  deleteFeature: (params: DeleteFeatureParams) => Promise<DeleteFeatureResult>
): Promise<DeleteFeatureResult> => {
  // 선택된 피처 검증
  if (!selectedFeatures || selectedFeatures.length === 0) {
    return {
      success: false,
      message: '삭제할 피처가 선택되지 않았습니다.',
      error: 'No feature selected'
    };
  }

  if (selectedFeatures.length > 1) {
    return {
      success: false,
      message: '하나의 피처만 선택하여 삭제할 수 있습니다.',
      error: 'Multiple features selected'
    };
  }

  const selectedFeature = selectedFeatures[0];

  // 피처 유효성 검사
  if (!selectedFeature.id) {
    return {
      success: false,
      message: '선택된 피처의 ID가 없습니다.',
      error: 'Selected feature has no ID'
    };
  }

  if (!selectedFeature.geometry || !selectedFeature.geometry.type) {
    return {
      success: false,
      message: '선택된 피처의 지오메트리가 없습니다.',
      error: 'Selected feature has no geometry'
    };
  }

  console.log('🗑️ 선택된 피처 삭제 시작:', {
    featureId: selectedFeature.id,
    geometryType: selectedFeature.geometry.type
  });

  // 삭제 실행
  return await deleteFeature({
    feature: selectedFeature
  });
};
