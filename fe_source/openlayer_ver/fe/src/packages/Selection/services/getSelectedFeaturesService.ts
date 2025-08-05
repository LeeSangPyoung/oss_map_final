import { useMapbase } from '~/store/useMapbase';

export interface GetSelectedFeaturesResult {
  success: boolean;
  features: any[];
  count: number;
  message: string;
}

export class GetSelectedFeaturesService {
  static getSelectedFeatures(): GetSelectedFeaturesResult {
    try {
      const selectedFeatures = useMapbase.getState().getSelectedFeatures();
      
      if (selectedFeatures && selectedFeatures.length > 0) {
        return {
          success: true,
          features: selectedFeatures,
          count: selectedFeatures.length,
          message: `선택된 피처 ${selectedFeatures.length}개를 가져왔습니다.`
        };
      } else {
        return {
          success: true,
          features: [],
          count: 0,
          message: '선택된 피처가 없습니다.'
        };
      }
    } catch (error) {
      console.error('Get Selected Features 오류:', error);
      return {
        success: false,
        features: [],
        count: 0,
        message: `오류 발생: ${error}`
      };
    }
  }
} 