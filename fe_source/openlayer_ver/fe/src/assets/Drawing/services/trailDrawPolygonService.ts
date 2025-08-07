// Drawing 패키지 - TrailDrawPolygonService
// 담당 기능: 다각형 그리기

import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { useMapbase } from '../../../store/useMapbase';

export interface TrailDrawPolygonCallbacks {
  showPolygonTypeSelectorPopup: (coordinate: number[], pixel: number[]) => void;
  setDrawnFeature: (feature: any) => void;
}

export class TrailDrawPolygonService {
  private map: Map | null;
  private vectorSource: VectorSource;
  private drawInteraction: Draw | null = null;
  private drawLayer: VectorLayer<VectorSource> | null = null;
  private static instances: TrailDrawPolygonService[] = [];

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
    TrailDrawPolygonService.instances.push(this);
  }

  // 전역 정리 함수
  static cleanupAll(): void {
    TrailDrawPolygonService.instances.forEach(instance => {
      instance.cleanup();
    });
    TrailDrawPolygonService.instances = [];
  }

  // 다각형 그리기 모드 활성화
  activateTrailDrawPolygonMode(callbacks: TrailDrawPolygonCallbacks): void {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      // 기존 Draw interaction 정리
      this.cleanup();

      // 그리기용 레이어 생성
      const drawSource = new VectorSource();
      this.drawLayer = new VectorLayer({
        source: drawSource,
        style: new Style({
          stroke: new Stroke({ color: '#ff0000', width: 3 }),
          fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        })
      });

      // Draw interaction 생성
      this.drawInteraction = new Draw({
        source: drawSource,
        type: 'Polygon'
      });

      // 그리기 완료 이벤트 처리
      this.drawInteraction.on('drawend', (event: any) => {
        // 그린 feature를 MainPage.tsx에 저장
        callbacks.setDrawnFeature(event.feature);
        
        // 그린 feature의 중심점 계산
        const geometry = event.feature.getGeometry();
        if (geometry) {
          const extent = geometry.getExtent();
          const centerX = (extent[0] + extent[2]) / 2;
          const centerY = (extent[1] + extent[3]) / 2;
          const centerCoord = [centerX, centerY];
          const centerPixel = this.map?.getPixelFromCoordinate(centerCoord);
          
          if (centerPixel) {
            // 폴리곤 타입 선택기 표시
            callbacks.showPolygonTypeSelectorPopup(centerCoord, centerPixel);
          }
        }
        
        // Draw interaction만 제거 (레이어는 유지)
        if (this.map && this.drawInteraction) {
          this.map.removeInteraction(this.drawInteraction);
          this.drawInteraction = null;
        }
      });

      // Draw interaction과 레이어 추가
      this.map.addInteraction(this.drawInteraction);
      this.map.addLayer(this.drawLayer);
    } catch (error) {
      console.error('Trail Draw Polygon 모드 활성화 중 오류:', error);
      throw error;
    }
  }

  // 정리 함수
  cleanup(): void {
    if (this.map) {
      if (this.drawInteraction) {
        this.map.removeInteraction(this.drawInteraction);
        this.drawInteraction = null;
      }
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer);
        this.drawLayer = null;
      }
    }
  }
} 