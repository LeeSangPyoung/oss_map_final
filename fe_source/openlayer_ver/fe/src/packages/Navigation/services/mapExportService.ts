// Navigation 패키지 - MapExportService
// 담당 기능:
// - exportMapImage (지도 이미지 내보내기)
// - copyView (뷰 복사)

import { Map } from 'ol';

export interface MapExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
}

export interface MapExportResult {
  success: boolean;
  message: string;
  dataUrl?: string;
}

export interface MapCopyViewResult {
  success: boolean;
  message: string;
  viewInfo?: {
    center: number[];
    zoom: number;
    rotation: number;
  };
}

export class MapExportService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  exportMapImage(options: MapExportOptions = {}): MapExportResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    const { filename = 'map', format = 'png', quality = 0.9 } = options;

    try {
      this.map.once('rendercomplete', () => {
        const canvas = this.map?.getTargetElement().querySelector('canvas') as HTMLCanvasElement;
        if (canvas) {
          const dataUrl = canvas.toDataURL(`image/${format}`, quality);
          const link = document.createElement('a');
          link.download = `${filename}.${format}`;
          link.href = dataUrl;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
      
      this.map.renderSync();

      return {
        success: true,
        message: `지도 이미지가 ${filename}.${format}로 내보내기되었습니다.`,
        dataUrl: this.map.getTargetElement().querySelector('canvas')?.toDataURL(`image/${format}`, quality)
      };
    } catch (error) {
      return {
        success: false,
        message: `지도 이미지 내보내기 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  copyView(): MapCopyViewResult {
    if (!this.map) {
      return {
        success: false,
        message: '지도가 초기화되지 않았습니다.'
      };
    }

    try {
      const view = this.map.getView();
      const center = view.getCenter();
      const zoom = view.getZoom();
      const rotation = view.getRotation();

      const viewInfo = {
        center: center || [0, 0],
        zoom: zoom || 0,
        rotation: rotation || 0
      };

      // 클립보드에 복사
      navigator.clipboard.writeText(JSON.stringify(viewInfo, null, 2)).then(() => {
        console.log('뷰 정보가 클립보드에 복사되었습니다.');
      }).catch((err) => {
        console.error('클립보드 복사 실패:', err);
      });

      return {
        success: true,
        message: '뷰 정보가 클립보드에 복사되었습니다.',
        viewInfo
      };
    } catch (error) {
      return {
        success: false,
        message: `뷰 복사 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
} 