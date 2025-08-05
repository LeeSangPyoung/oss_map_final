// Drawing 패키지 - AdvancedTrailDrawPointService
// 담당 기능: 스냅 기능이 포함된 고급 점 그리기

import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { useMapbase } from '../../../store/useMapbase';
import { getListFeaturesInPixel, loadAllFeaturesToVectorLayer } from '~/packages/OpenLayer/services/getFeatures';
import { never } from 'ol/events/condition';

export interface AdvancedTrailDrawPointCallbacks {
  showNodeTypeSelectorPopup: (coordinate: number[], pixel: number[]) => void;
  setDrawnFeature: (feature: any) => void;
}

export class AdvancedTrailDrawPointService {
  private map: Map | null;
  private vectorSource: VectorSource;
  private drawInteraction: Draw | null = null;
  private drawLayer: VectorLayer<VectorSource> | null = null;
  private snapHighlightLayer: VectorLayer<VectorSource> | null = null;
  private snapHighlightSource: VectorSource | null = null;
  private currentSnapPoint: any = null;
  private snapStartCoordinate: number[] | null = null;
  private isSnapMode: boolean = false;
  private allFeaturesLayerCreated: boolean = false;
  private static instances: AdvancedTrailDrawPointService[] = [];

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
    AdvancedTrailDrawPointService.instances.push(this);
  }

  // 전역 정리 함수
  static cleanupAll(): void {
    AdvancedTrailDrawPointService.instances.forEach(instance => {
      instance.cleanup();
    });
    AdvancedTrailDrawPointService.instances = [];
  }

  // 스냅 하이라이트 레이어 생성
  private createSnapHighlightLayer(): void {
    this.snapHighlightSource = new VectorSource();
    this.snapHighlightLayer = new VectorLayer({
      source: this.snapHighlightSource,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255, 255, 0, 0.8)' }),
          stroke: new Stroke({ color: '#FFD700', width: 3 })
        })
      }),
      zIndex: 1000
    });
  }

  // 스냅 포인트 찾기 (advanced select 로직 그대로)
  private async findSnapPoint(mousePixel: number[]): Promise<any> {
    if (!this.map) return null;

    const coordinate = this.map.getCoordinateFromPixel(mousePixel);
    const zoom = this.map.getView().getZoom() || 0;
    
    if (!coordinate) return null;

    const layerData = useMapbase.getState().layerData;
    if (!layerData || layerData.length === 0) return null;

    // all-features-layer가 없으면 한 번만 생성 (advanced select와 동일)
    const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (!vectorLayer && !this.allFeaturesLayerCreated) {
      try {
        await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
        this.allFeaturesLayerCreated = true;
      } catch (error) {
        console.error('AdvancedTrailDrawPoint: all-features-layer 생성 실패:', error);
        return null;
      }
    }

    try {
      // 브라우저 검색으로 피처 찾기
      const features = await getListFeaturesInPixel(
        layerData,
        zoom,
        coordinate,
        undefined,
        mousePixel,
        true, // 브라우저 검색 사용
        this.map
      );

      if (features && features.length > 0) {
        const feature = features[0];
        
        // Point 피처인 경우 엄격한 거리 검증 (advanced select와 동일)
        if (feature.geometry?.type === 'Point') {
          const distance = Math.sqrt(
            Math.pow(coordinate[0] - feature.geometry.coordinates[0], 2) +
            Math.pow(coordinate[1] - feature.geometry.coordinates[1], 2)
          );
          const resolution = this.map?.getView().getResolution() || 1;
          const pixelDistance = distance / resolution;
          
          // 포인트는 2픽셀 이내에서만 스냅 허용 (advanced select와 동일)
          if (pixelDistance <= 2) {
            return feature;
          } else {
            return null;
          }
        }
        
        return feature;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // 동기적으로 스냅 포인트 찾기 (geometryFunction용) - Point, Line, Polygon 모든 꼭지점 지원
  private findSnapPointSync(mousePixel: number[]): number[] | null {
    if (!this.map) return null;

    const coordinate = this.map.getCoordinateFromPixel(mousePixel);
    if (!coordinate) return null;

    const layerData = useMapbase.getState().layerData;
    if (!layerData || layerData.length === 0) return null;

    // all-features-layer가 없으면 생성하지 않고 null 반환
    const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (!vectorLayer) return null;

    const source = (vectorLayer as any).getSource();
    if (!source) return null;

    const features = source.getFeatures();
    let closestCoord = null;
    let minDistance = Infinity;

    for (const feature of features) {
      const geometry = feature.getGeometry();
      if (!geometry) continue;

      const geometryType = geometry.getType();
      
      if (geometryType === 'Point') {
        // Point 피처: 기존 로직
        const featureCoord = geometry.getCoordinates();
        const distance = Math.sqrt(
          Math.pow(coordinate[0] - featureCoord[0], 2) +
          Math.pow(coordinate[1] - featureCoord[1], 2)
        );
        
        const resolution = this.map?.getView().getResolution() || 1;
        const pixelDistance = distance / resolution;
        
        // 15픽셀 이내에서만 스냅 허용
        if (pixelDistance <= 15 && pixelDistance < minDistance) {
          minDistance = pixelDistance;
          closestCoord = featureCoord;
        }
      } else if (geometryType === 'LineString') {
        // Line 피처: 모든 꼭지점에 스냅
        const coordinates = geometry.getCoordinates();
        for (const coord of coordinates) {
          const distance = Math.sqrt(
            Math.pow(coordinate[0] - coord[0], 2) +
            Math.pow(coordinate[1] - coord[1], 2)
          );
          
          const resolution = this.map?.getView().getResolution() || 1;
          const pixelDistance = distance / resolution;
          
          // 15픽셀 이내에서만 스냅 허용
          if (pixelDistance <= 15 && pixelDistance < minDistance) {
            minDistance = pixelDistance;
            closestCoord = coord;
          }
        }
      } else if (geometryType === 'MultiLineString') {
        // MultiLineString 피처: 모든 라인의 모든 꼭지점에 스냅
        const coordinates = geometry.getCoordinates();
        for (const line of coordinates) {
          for (const coord of line) {
            const distance = Math.sqrt(
              Math.pow(coordinate[0] - coord[0], 2) +
              Math.pow(coordinate[1] - coord[1], 2)
            );
            
            const resolution = this.map?.getView().getResolution() || 1;
            const pixelDistance = distance / resolution;
            
            // 15픽셀 이내에서만 스냅 허용
            if (pixelDistance <= 15 && pixelDistance < minDistance) {
              minDistance = pixelDistance;
              closestCoord = coord;
            }
          }
        }
      } else if (geometryType === 'Polygon') {
        // Polygon 피처: 모든 꼭지점에 스냅
        const coordinates = geometry.getCoordinates();
        for (const ring of coordinates) {
          for (const coord of ring) {
            const distance = Math.sqrt(
              Math.pow(coordinate[0] - coord[0], 2) +
              Math.pow(coordinate[1] - coord[1], 2)
            );
            
            const resolution = this.map?.getView().getResolution() || 1;
            const pixelDistance = distance / resolution;
            
            // 15픽셀 이내에서만 스냅 허용
            if (pixelDistance <= 15 && pixelDistance < minDistance) {
              minDistance = pixelDistance;
              closestCoord = coord;
            }
          }
        }
      }
    }

    return closestCoord;
  }

  // 스냅 하이라이트 표시
  private showSnapHighlight(feature: any): void {
    if (!this.snapHighlightSource || !feature) return;

    this.snapHighlightSource.clear();
    this.snapHighlightSource.addFeature(feature);
  }

  // 스냅 하이라이트 제거
  private hideSnapHighlight(): void {
    if (this.snapHighlightSource) {
      this.snapHighlightSource.clear();
    }
  }

  // 마우스 이동 이벤트 처리 (동기적 방식으로 변경)
  private handleMouseMove = (event: any): void => {
    if (!this.isSnapMode) {
      return;
    }

    const mousePixel = event.pixel;
    const snappedCoord = this.findSnapPointSync(mousePixel);

    if (snappedCoord) {
      // 스냅된 좌표가 있으면 하이라이트 표시
      if (!this.currentSnapPoint || 
          this.currentSnapPoint[0] !== snappedCoord[0] || 
          this.currentSnapPoint[1] !== snappedCoord[1]) {
        
        this.currentSnapPoint = snappedCoord;
        this.snapStartCoordinate = snappedCoord;
        
        // 하이라이트 피처 생성
        const highlightFeature = new Feature({
          geometry: new Point(snappedCoord)
        });
        this.showSnapHighlight(highlightFeature);
      }
    } else if (this.currentSnapPoint) {
      // 스냅된 좌표가 없으면 하이라이트 제거
      this.currentSnapPoint = null;
      this.snapStartCoordinate = null;
      this.hideSnapHighlight();
    }
  };

  // 맵 이동 시 all-features-layer 업데이트
  private handleMapMove = async (event: any): Promise<void> => {
    if (!this.isSnapMode || !this.map) {
      return;
    }

    // 맵 이동이 완료된 후 약간의 지연을 두고 업데이트
    setTimeout(async () => {
      try {
        if (!this.map) return;
        
        const coordinate = this.map.getView().getCenter();
        const zoom = this.map.getView().getZoom() || 0;
        
        if (!coordinate) return;

        const layerData = useMapbase.getState().layerData;
        if (!layerData || layerData.length === 0) return;

        // all-features-layer 업데이트
        await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
        console.log('🔧 AdvancedTrailDrawPoint: all-features-layer 업데이트 완료');
      } catch (error) {
        console.error('AdvancedTrailDrawPoint: all-features-layer 업데이트 실패:', error);
      }
    }, 500); // 500ms 지연
  };

  // 클릭 이벤트 처리 (하이라이트 영역 내 클릭 감지)
  private handleClick = (event: any): void => {
    if (!this.isSnapMode || !this.currentSnapPoint) return;

    // 클릭한 위치가 하이라이트 영역 내인지 확인
    const mousePixel = event.pixel;
    const clickedCoord = this.map?.getCoordinateFromPixel(mousePixel);
    
    if (clickedCoord && this.currentSnapPoint) {
      // 클릭한 위치와 하이라이트된 포인트 사이의 거리 계산
      const distance = Math.sqrt(
        Math.pow(clickedCoord[0] - this.currentSnapPoint[0], 2) +
        Math.pow(clickedCoord[1] - this.currentSnapPoint[1], 2)
      );
      
      const resolution = this.map?.getView().getResolution() || 1;
      const pixelDistance = distance / resolution;
      
      // 하이라이트 영역 내에서 클릭한 경우 (8픽셀 이내)
      if (pixelDistance <= 8) {
        // 하이라이트된 포인트의 정확한 중심점을 시작점으로 설정
        this.snapStartCoordinate = this.currentSnapPoint;
      }
    }
  };

  // 고급 점 그리기 모드 활성화 (스냅 기능 포함)
  async activateAdvancedTrailDrawPointMode(callbacks: AdvancedTrailDrawPointCallbacks): Promise<void> {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      // Advanced Trail Draw Point 모드로 명확히 설정
      useMapbase.getState().setMode('advanced-trail-draw-point');

      // 기존 정리
      this.cleanup();
      
      // all-features-layer 생성 플래그 리셋 (재활성화 시 새로 생성하기 위해)
      this.allFeaturesLayerCreated = false;

      // 스냅 하이라이트 레이어 생성
      this.createSnapHighlightLayer();
      this.map.addLayer(this.snapHighlightLayer!);

      // all-features-layer가 없으면 생성 (재활성화 시에도 생성)
      const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
      if (!vectorLayer) {
        const layerData = useMapbase.getState().layerData;
        if (layerData && layerData.length > 0) {
          const coordinate = this.map.getView().getCenter();
          const zoom = this.map.getView().getZoom() || 0;
          if (coordinate) {
            try {
              await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
              this.allFeaturesLayerCreated = true;
            } catch (error) {
              console.error('AdvancedTrailDrawPoint: all-features-layer 생성 실패:', error);
            }
          }
        }
      }

      // 스냅 모드 활성화
      this.isSnapMode = true;

      // 마우스 이동 이벤트 리스너 등록
      this.map.on('pointermove', this.handleMouseMove);
      
      // 클릭 이벤트 리스너 등록 (하이라이트 영역 내 클릭 감지)
      this.map.on('click', this.handleClick);
      
      // 맵 이동 이벤트 리스너 등록 (all-features-layer 업데이트용)
      this.map.on('moveend', this.handleMapMove);

      // 그리기용 레이어 생성
      const drawSource = new VectorSource();
      this.drawLayer = new VectorLayer({
        source: drawSource,
        style: new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        })
      });

      // Draw interaction 생성 (스냅 기능 포함)
      this.drawInteraction = new Draw({
        source: drawSource,
        type: 'Point',
        style: new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        }),
        // 클릭으로 그리기 시작
        freehandCondition: never,
      });

      // 그리기 이벤트 리스너
      this.drawInteraction.on('drawstart', (event: any) => {
        // 첫 번째 점을 스냅 좌표로 설정 (있는 경우)
        if (this.snapStartCoordinate) {
          const geometry = event.feature.getGeometry();
          if (geometry) {
            geometry.setCoordinates(this.snapStartCoordinate);
          }
        }
      });

      // 그리기 완료 이벤트 처리
      this.drawInteraction.on('drawend', (event: any) => {
        // 스냅 좌표가 있으면 스냅 좌표 사용
        const geometry = event.feature.getGeometry();
        if (geometry && this.snapStartCoordinate) {
          geometry.setCoordinates(this.snapStartCoordinate);
        }
        
        // 그린 feature를 MainPage.tsx에 저장
        callbacks.setDrawnFeature(event.feature);
        
        // 그린 feature의 중심점 계산
        const centerCoord = geometry ? geometry.getCoordinates() : [0, 0];
        const centerPixel = this.map?.getPixelFromCoordinate(centerCoord);
        
        if (centerPixel) {
          // 노드 타입 선택기 표시
          callbacks.showNodeTypeSelectorPopup(centerCoord, centerPixel);
        }
        
        // 스냅 상태 초기화 (모드는 유지)
        this.currentSnapPoint = null;
        this.snapStartCoordinate = null;
        
        // Advanced Trail Draw Line과 동일하게 Draw interaction을 다시 활성화하지 않음
        // 스냅 하이라이트와 마우스 이벤트는 계속 유지됨
        
        // drawMode는 바꾸지 않음 (계속 advanced-trail-draw-point 모드 유지)
      });

      // Draw interaction과 레이어 추가
      this.map.addInteraction(this.drawInteraction);
      this.map.addLayer(this.drawLayer);
    } catch (error) {
      console.error('Advanced Trail Draw Point 모드 활성화 중 오류:', error);
      throw error;
    }
  }

  // 정리 함수
  cleanup(): void {
    if (this.map) {
      // 마우스 이벤트 리스너 제거
      this.map.un('pointermove', this.handleMouseMove);
      this.map.un('click', this.handleClick);
      this.map.un('moveend', this.handleMapMove);
      
      // Draw interaction 제거
      if (this.drawInteraction) {
        this.map.removeInteraction(this.drawInteraction);
        this.drawInteraction = null;
      }
      
      // 레이어들 제거
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer);
        this.drawLayer = null;
      }
      
      if (this.snapHighlightLayer) {
        this.map.removeLayer(this.snapHighlightLayer);
        this.snapHighlightLayer = null;
      }
      
      if (this.snapHighlightSource) {
        this.snapHighlightSource.clear();
        this.snapHighlightSource = null;
      }
      
      // 상태 초기화
      this.currentSnapPoint = null;
      this.snapStartCoordinate = null;
      this.isSnapMode = false;
      
      // 모드를 select로 변경 (정리 시에는 항상 select 모드로)
      useMapbase.getState().setMode('select');
    }
  }
} 