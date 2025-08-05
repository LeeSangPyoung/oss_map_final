import { useCallback } from 'react';
import { GetTrailCoordinateService, GetTrailCoordinateResult } from '../services/getTrailCoordinateService';

export const useGetTrailCoordinate = () => {
  const getTrailCoordinates = useCallback((): GetTrailCoordinateResult => {
    return GetTrailCoordinateService.getTrailCoordinates();
  }, []);

  return {
    getTrailCoordinates
  };
};

export const getTrailCoordinates = (): GetTrailCoordinateResult => {
  return GetTrailCoordinateService.getTrailCoordinates();
}; 