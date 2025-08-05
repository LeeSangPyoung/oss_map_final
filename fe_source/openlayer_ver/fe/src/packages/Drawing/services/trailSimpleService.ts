// Drawing 패키지 - TrailSimpleService
// 담당 기능: 간단한 선 그리기

import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { useMapbase } from '../../../store/useMapbase';

export class TrailSimpleService {
  private map: Map | null;
  private vectorSource: VectorSource;
  private drawInteraction: Draw | null = null;
  private drawLayer: VectorLayer<VectorSource> | null = null;
  private static instances: TrailSimpleService[] = [];

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
    TrailSimpleService.instances.push(this);
  }

  // 전역 정리 함수
  static cleanupAll(): void {
    TrailSimpleService.instances.forEach(instance => {
      instance.cleanup();
    });
    TrailSimpleService.instances = [];
  }

  // 간단한 선 그리기 모드 활성화
  activateTrailSimpleMode(): void {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      // 기존 Draw interaction 정리
      this.cleanup();

      // 모드 설정
      useMapbase.getState().setMode('trail-simple');

      // 그리기용 레이어 생성
      const drawSource = new VectorSource();
      this.drawLayer = new VectorLayer({
        source: drawSource,
        style: new Style({
          stroke: new Stroke({ color: '#ff0000', width: 3 }),
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
        type: 'LineString'
      });

      // 그리기 완료 이벤트 처리
      this.drawInteraction.on('drawend', (event: any) => {
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
      console.error('Trail Simple 모드 활성화 중 오류:', error);
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