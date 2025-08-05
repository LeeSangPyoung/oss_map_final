// Drawing 패키지 - AdvancedTrailDrawLineService
// 담당 기능: 스냅 기능이 포함된 고급 선형 그리기

import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { useMapbase } from '../../../store/useMapbase';
import { getListFeaturesInPixel, loadAllFeaturesToVectorLayer } from '../../OpenLayer/services/getFeatures';
import { never } from 'ol/events/condition';
import { LineString, Point } from 'ol/geom';
import Feature from 'ol/Feature';

export interface AdvancedTrailDrawLineCallbacks {
  showLineTypeSelectorPopup: (coordinate: number[], pixel: number[]) => void;
  setDrawnFeature: (feature: any) => void;
}

export class AdvancedTrailDrawLineService {
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

  private static instances: AdvancedTrailDrawLineService[] = [];

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
    AdvancedTrailDrawLineService.instances.push(this);
  }

  // 전역 정리 함수
  static cleanupAll(): void {
    AdvancedTrailDrawLineService.instances.forEach(instance => {
      instance.cleanup();
    });
    AdvancedTrailDrawLineService.instances = [];
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

  // 스냅 포인트 찾기 (모든 geometry 타입의 꼭지점 지원)
  private async findSnapPoint(mousePixel: number[]): Promise<any> {
    if (!this.map) return null;

    const coordinate = this.map.getCoordinateFromPixel(mousePixel);
    const zoom = this.map.getView().getZoom() || 0;
    
    if (!coordinate) return null;

    const layerData = useMapbase.getState().layerData;
    if (!layerData || layerData.length === 0) return null;

    // all-features-layer가 없으면 한 번만 생성
    const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (!vectorLayer && !this.allFeaturesLayerCreated) {
      try {
        await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
        this.allFeaturesLayerCreated = true;
      } catch (error) {
        console.error('AdvancedTrailDrawLine: all-features-layer 생성 실패:', error);
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
        // 모든 피처를 검사하여 가장 가까운 꼭지점 찾기
        let closestFeature = null;
        let closestCoord = null;
        let minDistance = Infinity;

        for (const feature of features) {
          const geometry = feature.geometry;
          if (!geometry) continue;

          if (geometry.type === 'Point') {
            // Point 피처: 기존 로직
            const featureCoord = geometry.coordinates;
            const distance = Math.sqrt(
              Math.pow(coordinate[0] - featureCoord[0], 2) +
              Math.pow(coordinate[1] - featureCoord[1], 2)
            );
            const resolution = this.map?.getView().getResolution() || 1;
            const pixelDistance = distance / resolution;
            
            // 15픽셀 이내에서만 스냅 허용
            if (pixelDistance <= 15 && pixelDistance < minDistance) {
              minDistance = pixelDistance;
              closestFeature = feature;
              closestCoord = featureCoord;
            }
          } else if (geometry.type === 'LineString') {
            // LineString 피처: 모든 꼭지점 검사
            const coordinates = geometry.coordinates;
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
                closestFeature = feature;
                closestCoord = coord;
              }
            }
          } else if (geometry.type === 'MultiLineString') {
            // MultiLineString 피처: 모든 라인의 모든 꼭지점 검사
            const coordinates = geometry.coordinates;
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
                  closestFeature = feature;
                  closestCoord = coord;
                }
              }
            }
          } else if (geometry.type === 'Polygon') {
            // Polygon 피처: 모든 꼭지점 검사
            const coordinates = geometry.coordinates;
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
                  closestFeature = feature;
                  closestCoord = coord;
                }
              }
            }
          }
        }

        // 가장 가까운 꼭지점이 있으면 해당 피처와 좌표 반환
        if (closestFeature && closestCoord) {
          return {
            feature: closestFeature,
            coordinate: closestCoord
          };
        }
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

    // 간단한 거리 기반 스냅 (동기적)
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



  // 마우스 이동 이벤트 처리 (비동기 방식으로 변경)
  private handleMouseMove = async (event: any): Promise<void> => {
    if (!this.isSnapMode) return;

    const mousePixel = event.pixel;
    const snapResult = await this.findSnapPoint(mousePixel);

    if (snapResult && snapResult.coordinate) {
      // 스냅된 좌표가 있으면 하이라이트 표시
      const snappedCoord = snapResult.coordinate;
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



  // 스냅 기능이 포함된 고급 선형 그리기 모드 활성화
  async activateAdvancedTrailDrawLineMode(callbacks: AdvancedTrailDrawLineCallbacks): Promise<void> {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      // Advanced Trail Draw Line 모드로 명확히 설정
      useMapbase.getState().setMode('advanced-trail-draw');

      // 기존 정리
      this.cleanup();

      // 스냅 하이라이트 레이어 생성
      this.createSnapHighlightLayer();
      this.map.addLayer(this.snapHighlightLayer!);

      // all-features-layer가 없으면 한 번만 생성
      const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
      if (!vectorLayer && !this.allFeaturesLayerCreated) {
        const layerData = useMapbase.getState().layerData;
        if (layerData && layerData.length > 0) {
          const coordinate = this.map.getView().getCenter();
          const zoom = this.map.getView().getZoom() || 0;
          if (coordinate) {
            try {
              await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
              this.allFeaturesLayerCreated = true;
            } catch (error) {
              console.error('AdvancedTrailDrawLine: all-features-layer 생성 실패:', error);
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

      // Draw interaction 생성 (스냅 기능 포함)
      this.drawInteraction = new Draw({
        source: drawSource,
        type: 'LineString',
        style: new Style({
          stroke: new Stroke({ color: '#ff0000', width: 3 }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        }),
        // 클릭으로 그리기 시작 (기존 trail draw line과 동일)
        freehandCondition: never,
        // 일반적인 그리기 (geometryFunction 제거)
      });

      // 그리기 이벤트 리스너
      this.drawInteraction.on('drawstart', (event: any) => {
        // 첫 번째 점을 스냅 좌표로 설정 (있는 경우)
        if (this.snapStartCoordinate) {
          const geometry = event.feature.getGeometry();
          if (geometry) {
            geometry.setCoordinates([this.snapStartCoordinate]);
          }
        }
      });

      // 그리기 완료 이벤트 처리
      this.drawInteraction.on('drawend', (event: any) => {
        // 모든 좌표를 스냅 처리 (PPT 자석 효과)
        const geometry = event.feature.getGeometry();
        if (geometry) {
          const coordinates = geometry.getCoordinates();
          const snappedCoordinates = coordinates.map((coord: number[]) => {
            if (this.map) {
              const pixel = this.map.getPixelFromCoordinate(coord);
              if (pixel) {
                const snappedCoord = this.findSnapPointSync(pixel);
                return snappedCoord || coord;
              }
            }
            return coord;
          });
          
          // 스냅된 좌표로 geometry 업데이트
          geometry.setCoordinates(snappedCoordinates);
        }
        
        // 그린 feature를 MainPage.tsx에 저장
        callbacks.setDrawnFeature(event.feature);
        
        // 그린 feature의 중심점 계산
        if (geometry) {
          const extent = geometry.getExtent();
          const centerX = (extent[0] + extent[2]) / 2;
          const centerY = (extent[1] + extent[3]) / 2;
          const centerCoord = [centerX, centerY];
          const centerPixel = this.map?.getPixelFromCoordinate(centerCoord);
          
          if (centerPixel) {
            // 라인 타입 선택기 표시
            callbacks.showLineTypeSelectorPopup(centerCoord, centerPixel);
          }
        }
        
        // 스냅 상태 초기화 (모드는 유지)
        this.currentSnapPoint = null;
        this.snapStartCoordinate = null;
        
        // drawMode는 바꾸지 않음 (계속 advanced-trail-draw 모드 유지)
      });

      // Draw interaction과 레이어 추가
      this.map.addInteraction(this.drawInteraction);
      this.map.addLayer(this.drawLayer);
    } catch (error) {
      throw error;
    }
  }

  // 정리 함수
  cleanup(): void {
    if (this.map) {
      // 마우스 이벤트 리스너 제거
      this.map.un('pointermove', this.handleMouseMove);
      this.map.un('click', this.handleClick);
      
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
      
      // drawMode는 바꾸지 않음 (다른 곳에서 필요할 때만 바꿈)
    }
  }
} 