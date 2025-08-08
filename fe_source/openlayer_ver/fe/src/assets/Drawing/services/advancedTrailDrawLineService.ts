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
  private mouseMoveTimeout: NodeJS.Timeout | null = null;

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

    // all-features-layer가 이미 있으면 Advanced Select가 생성한 것 사용
    const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (vectorLayer) {
      console.log('AdvancedTrailDrawLine: 기존 all-features-layer 사용 (Advanced Select에서 생성됨)');
      this.allFeaturesLayerCreated = true;
    } else if (!this.allFeaturesLayerCreated) {
      // all-features-layer가 없으면 생성
      try {
        await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
        this.allFeaturesLayerCreated = true;
        console.log('AdvancedTrailDrawLine: all-features-layer 생성 완료');
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



  // 마우스 이동 이벤트 처리 (비동기 방식으로 변경) - 디바운싱 적용
  private handleMouseMove = async (event: any): Promise<void> => {
    if (!this.isSnapMode) return;

    // 기존 타임아웃이 있으면 취소
    if (this.mouseMoveTimeout) {
      clearTimeout(this.mouseMoveTimeout);
    }

    // 50ms 디바운싱 적용
    this.mouseMoveTimeout = setTimeout(async () => {
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
    }, 50); // 50ms 디바운싱
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

        // all-features-layer가 있는지 확인
        const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
        if (vectorLayer) {
          // 기존 레이어 제거
          this.map.removeLayer(vectorLayer);
        }

        // 새로운 all-features-layer 생성 (Advanced Select와 동일한 방식)
        console.log('AdvancedTrailDrawLine: 맵 이동 후 Vector 레이어 재생성 시작');
        await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
        console.log('AdvancedTrailDrawLine: 맵 이동 후 Vector 레이어 재생성 완료');
      } catch (error) {
        console.error('AdvancedTrailDrawLine: 맵 이동 후 all-features-layer 업데이트 실패:', error);
      }
    }, 500);
  };

  // 클릭 이벤트 처리 (하이라이트 영역 내 클릭 감지)
  private handleClick = (event: any): void => {
    console.log('🔧 AdvancedTrailDrawLine: handleClick 호출됨');
    console.log('🔧 AdvancedTrailDrawLine: isSnapMode:', this.isSnapMode);
    console.log('🔧 AdvancedTrailDrawLine: currentSnapPoint:', this.currentSnapPoint);
    
    // 이벤트 전파 중단 제거 (Draw interaction과의 충돌 방지)
    // event.stopPropagation();
    
    if (!this.isSnapMode || !this.currentSnapPoint) {
      console.log('🔧 AdvancedTrailDrawLine: 스냅 모드가 아니거나 스냅 포인트가 없음');
      return;
    }

    // 클릭한 위치가 하이라이트 영역 내인지 확인
    const mousePixel = event.pixel;
    const clickedCoord = this.map?.getCoordinateFromPixel(mousePixel);
    
    console.log('🔧 AdvancedTrailDrawLine: 클릭 픽셀:', mousePixel);
    console.log('🔧 AdvancedTrailDrawLine: 클릭 좌표:', clickedCoord);
    
    if (clickedCoord && this.currentSnapPoint) {
      // 클릭한 위치와 하이라이트된 포인트 사이의 거리 계산
      const distance = Math.sqrt(
        Math.pow(clickedCoord[0] - this.currentSnapPoint[0], 2) +
        Math.pow(clickedCoord[1] - this.currentSnapPoint[1], 2)
      );
      
      const resolution = this.map?.getView().getResolution() || 1;
      const pixelDistance = distance / resolution;
      
      console.log('🔧 AdvancedTrailDrawLine: 픽셀 거리:', pixelDistance);
      
      // 하이라이트 영역 내에서 클릭한 경우 (15픽셀 이내 - 하이라이트와 동일한 톨러런스)
      if (pixelDistance <= 15) {
        // 하이라이트된 포인트의 정확한 중심점을 시작점으로 설정
        this.snapStartCoordinate = this.currentSnapPoint;
        console.log('🔧 AdvancedTrailDrawLine: 스냅 좌표 설정됨:', this.snapStartCoordinate);
      } else {
        console.log('🔧 AdvancedTrailDrawLine: 픽셀 거리가 15를 초과하여 스냅하지 않음');
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

      console.log('🔧 AdvancedTrailDrawLine: 모드 활성화 시작');
      
      // 새로운 스토어 상태 관리 시스템 사용
      useMapbase.getState().setLineDrawMode?.('advanced');
      console.log('🔧 AdvancedTrailDrawLine: 스토어 상태 업데이트 완료');
      
      // 모드 변경 감지를 위한 상태 확인
      const currentModeState = useMapbase.getState().modeState;
      console.log('🔧 AdvancedTrailDrawLine: 현재 모드 상태:', currentModeState);
      console.log('🔧 AdvancedTrailDrawLine: lineDrawMode:', currentModeState?.lineDrawMode);
      console.log('🔧 AdvancedTrailDrawLine: isLineDrawActive:', currentModeState?.isLineDrawActive);

      // 기존 정리
      this.cleanup();

      // 스냅 하이라이트 레이어 생성
      this.createSnapHighlightLayer();
      this.map.addLayer(this.snapHighlightLayer!);

      // all-features-layer가 이미 있으면 Advanced Select가 생성한 것 사용
      const vectorLayer = this.map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
      if (vectorLayer) {
        // 레이어가 존재하더라도 실제 피처가 있는지 확인
        const source = vectorLayer.getSource();
        const features = source ? source.getFeatures() : [];
        
        if (features.length > 0) {
          console.log('AdvancedTrailDrawLine: 기존 all-features-layer 사용 (Advanced Select에서 생성됨, 피처 수:', features.length, ')');
          this.allFeaturesLayerCreated = true;
        } else {
          console.log('AdvancedTrailDrawLine: 기존 all-features-layer는 있지만 피처가 없음, 새로 생성');
          // 빈 레이어 제거
          this.map.removeLayer(vectorLayer);
          this.allFeaturesLayerCreated = false;
        }
      } else {
        // all-features-layer가 없으면 생성 (Advanced Select와 동일한 방식)
        const layerData = useMapbase.getState().layerData;
        if (layerData && layerData.length > 0) {
          const coordinate = this.map.getView().getCenter();
          const zoom = this.map.getView().getZoom() || 0;
          if (coordinate) {
            try {
              console.log('AdvancedTrailDrawLine: 초기 Vector 레이어 생성 시작');
              await loadAllFeaturesToVectorLayer(this.map, layerData, coordinate, zoom);
              this.allFeaturesLayerCreated = true;
              console.log('AdvancedTrailDrawLine: 초기 Vector 레이어 생성 완료');
            } catch (error) {
              console.error('AdvancedTrailDrawLine: 초기 Vector 레이어 생성 실패:', error);
            }
          }
        }
      }

      // 스냅 모드 활성화
      this.isSnapMode = true;
      console.log('🔧 AdvancedTrailDrawLine: 스냅 모드 활성화');

      // 마우스 이동 이벤트 리스너 등록
      this.map.on('pointermove', this.handleMouseMove);
      console.log('🔧 AdvancedTrailDrawLine: pointermove 이벤트 리스너 등록');
      
      // 클릭 이벤트 리스너 등록 제거 (Draw interaction과 충돌 방지)
      // this.map.on('click', this.handleClick);
      console.log('🔧 AdvancedTrailDrawLine: click 이벤트 리스너 등록 제거됨');
      
      // 맵 이동 이벤트 리스너 등록 (all-features-layer 업데이트용)
      this.map.on('moveend', this.handleMapMove);
      console.log('🔧 AdvancedTrailDrawLine: moveend 이벤트 리스너 등록');

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

      // Draw interaction 생성 (빨간색 스타일 추가)
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
        })
      });
      
      // Draw interaction에 ID 설정
      this.drawInteraction.set('id', 'advanced-trail-draw-line');
      this.drawInteraction.set('name', '고급 라인 그리기');
      console.log('🔧 AdvancedTrailDrawLine: Draw interaction 생성됨');

      // 그리기 이벤트 리스너
      this.drawInteraction.on('drawstart', (event: any) => {
        console.log('🔧 AdvancedTrailDrawLine: drawstart 이벤트 호출됨');
        console.log('🔧 AdvancedTrailDrawLine: snapStartCoordinate:', this.snapStartCoordinate);
        
        // 첫 번째 점을 스냅 좌표로 설정 (있는 경우)
        if (this.snapStartCoordinate) {
          const geometry = event.feature.getGeometry();
          if (geometry) {
            geometry.setCoordinates([this.snapStartCoordinate]);
            console.log('🔧 AdvancedTrailDrawLine: 첫 번째 점을 스냅 좌표로 설정됨');
          }
        } else {
          console.log('🔧 AdvancedTrailDrawLine: snapStartCoordinate가 없어서 기본 좌표 사용');
        }
      });

      // 그리기 완료 이벤트 처리
      this.drawInteraction.on('drawend', (event: any) => {
        console.log('🔧 AdvancedTrailDrawLine: drawend 이벤트 호출됨');
        
        // 모든 좌표를 스냅 처리 (PPT 자석 효과)
        const geometry = event.feature.getGeometry();
        if (geometry) {
          const coordinates = geometry.getCoordinates();
          console.log('🔧 AdvancedTrailDrawLine: 원본 좌표:', coordinates);
          
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
          
          console.log('🔧 AdvancedTrailDrawLine: 스냅된 좌표:', snappedCoordinates);
          
          // 스냅된 좌표로 geometry 업데이트
          geometry.setCoordinates(snappedCoordinates);
        }
        
        // 그린 feature를 MainPage.tsx에 저장
        callbacks.setDrawnFeature(event.feature);
        console.log('🔧 AdvancedTrailDrawLine: 그린 feature 저장됨');
        
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
            console.log('🔧 AdvancedTrailDrawLine: 라인 타입 선택기 표시됨');
          }
        }
        
        // 스냅 상태 초기화 (모드는 유지)
        this.currentSnapPoint = null;
        this.snapStartCoordinate = null;
        console.log('🔧 AdvancedTrailDrawLine: 스냅 상태 초기화됨');
        
        // drawMode는 바꾸지 않음 (계속 advanced-trail-draw 모드 유지)
      });

      // Draw interaction과 레이어 추가
      this.map.addLayer(this.drawLayer);
      console.log('🔧 AdvancedTrailDrawLine: drawLayer 추가 완료');
      
      this.map.addInteraction(this.drawInteraction);
      console.log('🔧 AdvancedTrailDrawLine: Draw interaction 추가 완료');
      
      // Draw interaction 명시적 활성화
      if (this.drawInteraction) {
        this.drawInteraction.setActive(true);
        console.log('🔧 AdvancedTrailDrawLine: Draw interaction 명시적 활성화 완료');
      }
      
      // Draw interaction이 제대로 추가되었는지 확인
      const interactions = this.map.getInteractions().getArray();
      const drawInteractions = interactions.filter((interaction: any) => 
        interaction instanceof Draw && interaction.get('id') === 'advanced-trail-draw-line'
      );
      console.log('🔧 AdvancedTrailDrawLine: 활성화된 Draw interaction 수:', drawInteractions.length);
      
      // Draw interaction 활성화 상태 확인
      if (this.drawInteraction) {
        console.log('🔧 AdvancedTrailDrawLine: Draw interaction 활성화 상태:', this.drawInteraction.getActive());
        console.log('🔧 AdvancedTrailDrawLine: Draw interaction 이벤트 리스너 등록 완료');
      }
      
      console.log('✅ AdvancedTrailDrawLine: 모드 활성화 완료');
    } catch (error) {
      console.error('🔧 AdvancedTrailDrawLine: 모드 활성화 중 오류:', error);
      throw error;
    }
  }

  // 정리 함수
  cleanup(): void {
    if (this.map) {
      console.log('🔧 AdvancedTrailDrawLine: cleanup 시작');
      
      // 마우스 이벤트 리스너 제거 (더 강력한 정리)
      this.map.un('pointermove', this.handleMouseMove);
      this.map.un('click', this.handleClick);
      this.map.un('moveend', this.handleMapMove);
      console.log('🔧 AdvancedTrailDrawLine: 이벤트 리스너 제거 완료');
      
      // 모든 Draw interaction 제거
      const interactions = this.map.getInteractions().getArray();
      interactions.forEach((interaction: any) => {
        if (interaction instanceof Draw) {
          this.map?.removeInteraction(interaction);
          console.log('🔧 AdvancedTrailDrawLine: Draw interaction 제거됨');
        }
      });
      
      // Draw interaction 제거
      if (this.drawInteraction) {
        this.map.removeInteraction(this.drawInteraction);
        this.drawInteraction = null;
        console.log('🔧 AdvancedTrailDrawLine: 메인 Draw interaction 제거됨');
      }
      
      // 레이어들 제거
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer);
        this.drawLayer = null;
        console.log('🔧 AdvancedTrailDrawLine: drawLayer 제거됨');
      }
      
      if (this.snapHighlightLayer) {
        this.map.removeLayer(this.snapHighlightLayer);
        this.snapHighlightLayer = null;
        console.log('🔧 AdvancedTrailDrawLine: snapHighlightLayer 제거됨');
      }
      
      if (this.snapHighlightSource) {
        this.snapHighlightSource.clear();
        this.snapHighlightSource = null;
        console.log('🔧 AdvancedTrailDrawLine: snapHighlightSource 정리됨');
      }
      
      // 타임아웃 정리
      if (this.mouseMoveTimeout) {
        clearTimeout(this.mouseMoveTimeout);
        this.mouseMoveTimeout = null;
        console.log('🔧 AdvancedTrailDrawLine: 타임아웃 정리됨');
      }
      
      // 상태 초기화
      this.currentSnapPoint = null;
      this.snapStartCoordinate = null;
      this.isSnapMode = false;
      this.allFeaturesLayerCreated = false;
      console.log('🔧 AdvancedTrailDrawLine: 상태 초기화 완료');
      console.log('✅ AdvancedTrailDrawLine: cleanup 완료');
    }
  }
} 