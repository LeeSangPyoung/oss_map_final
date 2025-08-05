// Drawing 패키지 - TrailDrawPointService
// 담당 기능: 점 그리기

import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

export interface TrailDrawPointCallbacks {
  showNodeTypeSelectorPopup: (coordinate: number[], pixel: number[]) => void;
  setDrawnFeature: (feature: any) => void;
}

export class TrailDrawPointService {
  private map: Map | null;
  private vectorSource: VectorSource;
  private drawLayer: VectorLayer<VectorSource> | null = null;
  private clickHandler: ((event: any) => void) | null = null;
  private moveHandler: ((event: any) => void) | null = null;
  private previewFeature: Feature | null = null;
  private static instances: TrailDrawPointService[] = [];

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
    TrailDrawPointService.instances.push(this);
  }

  // 전역 정리 함수
  static cleanupAll(): void {
    TrailDrawPointService.instances.forEach(instance => {
      instance.cleanup();
    });
    TrailDrawPointService.instances = [];
  }

  // 점 그리기 모드 활성화
  activateTrailDrawPointMode(callbacks: TrailDrawPointCallbacks): void {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      // 기존 핸들러 제거
      this.cleanup();

      // 그리기용 레이어 생성
      this.drawLayer = new VectorLayer({
        source: this.vectorSource,
        style: new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        })
      });

      // 미리보기 점 생성
      this.previewFeature = new Feature({
        geometry: new Point([0, 0])
      });
      this.previewFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: '#ff0000' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      }));

      // 마우스 이동 이벤트 핸들러
      this.moveHandler = (event: any) => {
        const coordinate = this.map?.getCoordinateFromPixel(event.pixel);
        if (coordinate && this.previewFeature) {
          const geometry = this.previewFeature.getGeometry() as Point;
          if (geometry) {
            geometry.setCoordinates(coordinate);
            this.vectorSource.changed();
          }
        }
      };

      // 클릭 이벤트 핸들러 생성
      this.clickHandler = (event: any) => {
        const coordinate = this.map?.getCoordinateFromPixel(event.pixel);
        if (coordinate) {
          // 클릭한 위치에 실제 점 생성
          const pointFeature = new Feature({
            geometry: new Point(coordinate)
          });
          
          // 점을 레이어에 추가
          this.vectorSource.addFeature(pointFeature);
          
          // 그린 feature를 MainPage.tsx에 저장
          callbacks.setDrawnFeature(pointFeature);
          
          // 미리보기 점 제거 (실제 점은 유지)
          if (this.previewFeature) {
            this.vectorSource.removeFeature(this.previewFeature);
            this.previewFeature = null;
          }
          
          // 노드 타입 선택기 표시
          callbacks.showNodeTypeSelectorPopup(coordinate, event.pixel);
          
          // 이벤트 리스너만 제거 (레이어는 유지)
          if (this.map) {
            if (this.clickHandler) {
              this.map.un('click', this.clickHandler);
              this.clickHandler = null;
            }
            if (this.moveHandler) {
              this.map.un('pointermove', this.moveHandler);
              this.moveHandler = null;
            }
          }
        }
      };
      
      // 미리보기 점을 레이어에 추가
      this.vectorSource.addFeature(this.previewFeature);
      
      // 이벤트 리스너 추가
      this.map.on('pointermove', this.moveHandler);
      this.map.on('click', this.clickHandler);
      
      // 그리기용 레이어를 맵에 추가
      this.map.addLayer(this.drawLayer);
    } catch (error) {
      console.error('Trail Draw Point 모드 활성화 중 오류:', error);
      throw error;
    }
  }

  // 정리 함수
  cleanup(): void {
    if (this.map) {
      if (this.clickHandler) {
        this.map.un('click', this.clickHandler);
        this.clickHandler = null;
      }
      if (this.moveHandler) {
        this.map.un('pointermove', this.moveHandler);
        this.moveHandler = null;
      }
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer);
        this.drawLayer = null;
      }
    }
    this.previewFeature = null;
  }
} 