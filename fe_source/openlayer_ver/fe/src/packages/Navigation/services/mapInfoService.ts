// Navigation 패키지 - MapInfoService
// 담당 기능:
// - center (화면 중심점 가져오기)
// - zoom (현재 줌 레벨 가져오기)
// - minzoom (최소 줌 레벨 가져오기)
// - maxzoom (최대 줌 레벨 가져오기)
// - getbounds (현재 화면 extent 반환)

import { Map } from 'ol';
import { transform } from 'ol/proj';
import proj4 from 'proj4';

export interface MapInfoResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface MapCenterResult extends MapInfoResult {
  data?: {
    center: number[];
    lat: number;
    lng: number;
  };
}

export interface MapZoomResult extends MapInfoResult {
  data?: {
    current: number;
    min: number;
    max: number;
  };
}

export interface MapBoundsResult extends MapInfoResult {
  data?: {
    extent: number[];
    center: number[];
    zoom: number;
  };
}

export class MapInfoService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  getCenter(): MapCenterResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const coordinate = this.map.getView().getCenter();
      if (coordinate) {
        const latLng = proj4('EPSG:5179', 'EPSG:4326', coordinate);
        return {
          success: true,
          message: '화면 중심점을 성공적으로 가져왔습니다.',
          data: {
            center: coordinate,
            lat: latLng[1],
            lng: latLng[0]
          }
        };
      } else {
        return {
          success: false,
          message: '현재 지도 중심을 가져올 수 없습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `화면 중심점 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  getZoom(): MapZoomResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const view = this.map.getView();
      const current = view.getZoom() ?? 1;
      const min = view.getMinZoom();
      const max = view.getMaxZoom();

      return {
        success: true,
        message: '줌 레벨 정보를 성공적으로 가져왔습니다.',
        data: {
          current,
          min,
          max
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `줌 레벨 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  getMinZoom(): MapInfoResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const minZoom = this.map.getView().getMinZoom();
      return {
        success: true,
        message: `최소 줌 레벨: ${minZoom}`,
        data: minZoom
      };
    } catch (error) {
      return {
        success: false,
        message: `최소 줌 레벨 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  getMaxZoom(): MapInfoResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const maxZoom = this.map.getView().getMaxZoom();
      return {
        success: true,
        message: `최대 줌 레벨: ${maxZoom}`,
        data: maxZoom
      };
    } catch (error) {
      return {
        success: false,
        message: `최대 줌 레벨 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  getBounds(): MapBoundsResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const view = this.map.getView();
      const extent = view.calculateExtent();
      const center = view.getCenter();
      const zoom = view.getZoom();

      const transformedExtent = transform(extent, 'EPSG:5179', 'EPSG:4326');
      const transformedCenter = center ? transform(center, 'EPSG:5179', 'EPSG:4326') : undefined;

      return {
        success: true,
        message: '현재 화면 extent를 성공적으로 가져왔습니다.',
        data: {
          extent: transformedExtent,
          center: transformedCenter || [],
          zoom: zoom || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `현재 화면 extent 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
} 