// Navigation 패키지 - MapPanService
// 담당 기능:
// - panBy (픽셀 단위 이동)
// - panTo (애니메이션 중심+줌 이동)
// - fitBounds (범용 영역 맞춤)
// - getBounds (현재 화면 extent 반환)
// - setZoom (애니메이션 줌 설정)
// - resetView (초기화)
// - rotate (지도 회전)

import { Map } from 'ol';
import { transform } from 'ol/proj';

export interface MapPanOptions {
  offsetX: number;
  offsetY: number;
  duration?: number;
}

export interface MapPanResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
}

export interface MapPanToOptions {
  center?: number[];
  zoom?: number;
  duration?: number;
}

export interface MapPanToResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
  previousZoom?: number;
  newZoom?: number;
}

export interface MapFitBoundsOptions {
  extent?: number[];
  duration?: number;
  padding?: number[];
  maxZoom?: number;
}

export interface MapFitBoundsResult {
  success: boolean;
  message: string;
  previousExtent?: number[];
  newExtent?: number[];
  previousZoom?: number;
  newZoom?: number;
}

export interface MapGetBoundsResult {
  success: boolean;
  message: string;
  extent?: number[];
  center?: number[];
  zoom?: number;
}

export interface MapSetZoomOptions {
  zoom: number;
  duration?: number;
}

export interface MapSetZoomResult {
  success: boolean;
  message: string;
  previousZoom?: number;
  newZoom?: number;
}

export interface MapResetViewOptions {
  center?: number[];
  zoom?: number;
  rotation?: number;
  duration?: number;
}

export interface MapResetViewResult {
  success: boolean;
  message: string;
  previousCenter?: number[];
  newCenter?: number[];
  previousZoom?: number;
  newZoom?: number;
  previousRotation?: number;
  newRotation?: number;
}

export interface MapRotateOptions {
  angle?: number;
  duration?: number;
}

export interface MapRotateResult {
  success: boolean;
  message: string;
  previousRotation?: number;
  newRotation?: number;
  angleApplied?: number;
}

export class MapPanService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  panBy(options: MapPanOptions): MapPanResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { offsetX, offsetY, duration = 300 } = options;
    const view = this.map.getView();
    const center = view.getCenter();

    if (!center) {
      return {
        success: false,
        message: '현재 지도 중심을 가져올 수 없습니다.'
      };
    }

    try {
      const currentPixel = this.map.getPixelFromCoordinate(center);
      const newPixel = [currentPixel[0] + offsetX, currentPixel[1] + offsetY];
      const newCenter = this.map.getCoordinateFromPixel(newPixel);

      view.animate({ center: newCenter, duration });

      return {
        success: true,
        message: `지도가 픽셀 단위로 이동했습니다. (X: ${offsetX}px, Y: ${offsetY}px)`,
        previousCenter: center,
        newCenter: newCenter
      };
    } catch (error) {
      return {
        success: false,
        message: `팬 이동 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousCenter: center
      };
    }
  }

  panTo(options: MapPanToOptions): MapPanToResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { center = [127.0, 37.5], zoom = 13, duration = 800 } = options;
    const view = this.map.getView();
    const previousCenter = view.getCenter();
    const previousZoom = view.getZoom();

    try {
      const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:5179');
      
      view.animate({ 
        center: transformedCenter, 
        zoom: zoom, 
        duration: duration 
      });

      return {
        success: true,
        message: `지도가 지정된 위치로 이동했습니다. (중심: [${center[0]}, ${center[1]}], 줌: ${zoom})`,
        previousCenter,
        newCenter: transformedCenter,
        previousZoom,
        newZoom: zoom
      };
    } catch (error) {
      return {
        success: false,
        message: `팬 이동 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousCenter,
        previousZoom
      };
    }
  }

  fitBounds(options: MapFitBoundsOptions): MapFitBoundsResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { extent = [126.5, 37.0, 127.5, 38.0], duration = 800, padding = [50, 50, 50, 50], maxZoom = 18 } = options;
    const view = this.map.getView();
    const previousExtent = view.calculateExtent();
    const previousZoom = view.getZoom();

    try {
      // extent 유효성 검사
      if (!extent || extent.length !== 4) {
        return {
          success: false,
          message: '유효하지 않은 extent입니다. 4개의 좌표가 필요합니다.',
          previousExtent,
          previousZoom
        };
      }

      // 각 좌표를 개별적으로 변환
      const minX = transform([extent[0], extent[1]], 'EPSG:4326', 'EPSG:5179');
      const maxX = transform([extent[2], extent[3]], 'EPSG:4326', 'EPSG:5179');
      const transformedExtent = [minX[0], minX[1], maxX[0], maxX[1]];
      
      view.fit(transformedExtent, {
        duration: duration,
        padding: padding,
        maxZoom: maxZoom
      });

      return {
        success: true,
        message: `지도가 지정된 영역에 맞춰졌습니다. (extent: [${extent[0]}, ${extent[1]}, ${extent[2]}, ${extent[3]}])`,
        previousExtent,
        newExtent: transformedExtent,
        previousZoom,
        newZoom: view.getZoom()
      };
    } catch (error) {
      return {
        success: false,
        message: `영역 맞춤 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousExtent,
        previousZoom
      };
    }
  }

  getBounds(): MapGetBoundsResult {
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

      // extent 유효성 검사
      if (!extent || extent.length !== 4) {
        return {
          success: false,
          message: '유효하지 않은 extent입니다.',
          zoom: zoom
        };
      }

      // 각 좌표를 개별적으로 변환
      const minX = transform([extent[0], extent[1]], 'EPSG:5179', 'EPSG:4326');
      const maxX = transform([extent[2], extent[3]], 'EPSG:5179', 'EPSG:4326');
      const transformedExtent = [minX[0], minX[1], maxX[0], maxX[1]];
      const transformedCenter = center ? transform(center, 'EPSG:5179', 'EPSG:4326') : undefined;

      return {
        success: true,
        message: '현재 화면 extent를 성공적으로 가져왔습니다.',
        extent: transformedExtent,
        center: transformedCenter,
        zoom: zoom
      };
    } catch (error) {
      return {
        success: false,
        message: `현재 화면 extent 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  setZoom(options: MapSetZoomOptions): MapSetZoomResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { zoom, duration = 800 } = options;
    const view = this.map.getView();
    const previousZoom = view.getZoom();

    try {
      view.animate({ 
        zoom: zoom, 
        duration: duration 
      });

      return {
        success: true,
        message: `지도 줌 레벨이 변경되었습니다. (줌: ${zoom})`,
        previousZoom,
        newZoom: zoom
      };
    } catch (error) {
      return {
        success: false,
        message: `줌 설정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousZoom
      };
    }
  }

  resetView(options: MapResetViewOptions = {}): MapResetViewResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { center = [127.0, 37.5], zoom = 7, rotation = 0, duration = 800 } = options;
    const view = this.map.getView();
    const previousCenter = view.getCenter();
    const previousZoom = view.getZoom();
    const previousRotation = view.getRotation();

    try {
      const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:5179');
      
      view.animate({ 
        center: transformedCenter, 
        zoom: zoom, 
        rotation: rotation,
        duration: duration 
      });

      return {
        success: true,
        message: `지도가 초기 상태로 리셋되었습니다. (중심: [${center[0]}, ${center[1]}], 줌: ${zoom}, 회전: ${rotation})`,
        previousCenter,
        newCenter: transformedCenter,
        previousZoom,
        newZoom: zoom,
        previousRotation,
        newRotation: rotation
      };
    } catch (error) {
      return {
        success: false,
        message: `지도 초기화 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousCenter,
        previousZoom,
        previousRotation
      };
    }
  }

  rotate(options: MapRotateOptions = {}): MapRotateResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { angle = Math.PI / 4, duration = 500 } = options;
    const view = this.map.getView();
    const previousRotation = view.getRotation();

    try {
      // fe5와 동일하게 상대적 회전 적용
      const newRotation = previousRotation + angle;
      view.animate({ 
        rotation: newRotation, 
        duration: duration 
      });

      return {
        success: true,
        message: `지도가 회전되었습니다. (각도: ${angle} 라디안, ${(angle * 180 / Math.PI).toFixed(1)}도)`,
        previousRotation,
        newRotation: newRotation,
        angleApplied: angle
      };
    } catch (error) {
      return {
        success: false,
        message: `지도 회전 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
        previousRotation
      };
    }
  }
} 