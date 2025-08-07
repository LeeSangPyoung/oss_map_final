import { useMapbase } from '../../../store/useMapbase';

export interface GetTrailCoordinateResult {
  success: boolean;
  coordinates: any[] | null;
  count: number;
  message: string;
}

export class GetTrailCoordinateService {
  static getTrailCoordinates(): GetTrailCoordinateResult {
    try {
      const trailCoords = useMapbase.getState().getTrailCoordinates();
      
      if (trailCoords && trailCoords.length > 0) {
        return {
          success: true,
          coordinates: trailCoords,
          count: trailCoords.length,
          message: `트레일 좌표 ${trailCoords.length}개를 성공적으로 가져왔습니다.`
        };
      } else {
        return {
          success: false,
          coordinates: null,
          count: 0,
          message: '저장된 트레일 좌표가 없습니다. 먼저 Trail Simple, Trail Distance, Trail Area 등을 사용하여 트레일을 그려주세요.'
        };
      }
    } catch (error) {
      return {
        success: false,
        coordinates: null,
        count: 0,
        message: `트레일 좌표 가져오기 중 오류가 발생했습니다: ${error}`
      };
    }
  }
} 