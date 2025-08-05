import { useCallback } from 'react';
import { GetSelectedFeaturesService, GetSelectedFeaturesResult } from '../services/getSelectedFeaturesService';

export const useGetSelectedFeatures = () => {
  const getSelectedFeatures = useCallback((): GetSelectedFeaturesResult => {
    return GetSelectedFeaturesService.getSelectedFeatures();
  }, []);

  return {
    getSelectedFeatures
  };
};

export const getSelectedFeatures = (): GetSelectedFeaturesResult => {
  return GetSelectedFeaturesService.getSelectedFeatures();
}; 