import { useRef, useState, useEffect } from 'react';
import { DrawMapParams } from '~/assets/OpenLayer/models/DrawMap';
import { Draw } from 'ol/interaction';
import { Polygon, Point } from 'ol/geom';
import { getArea } from 'ol/sphere';
import { Feature } from 'ol';
import { includes } from 'lodash';
import { formatArea } from '~/assets/OpenLayer/utils/common';
import { never } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import LayerGroup from 'ol/layer/Group';
import { getCircleStyle, getPolygonStyle, getLabelStyle } from '~/assets/OpenLayer/utils/stylesFeature';
import { useMapbase } from '~/store/useMapbase';
import { loadAllFeaturesToVectorLayer, getListFeaturesInPixel } from '~/assets/OpenLayer/services/getFeatures';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

export const useAdvancedTrailArea = ({ onEndDraw }: DrawMapParams) => {
  const { map, setMeasurementMode, modeState } = useMapbase();
  const trailAreaSource = useRef(new VectorSource());
  const snapHighlightLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const snapHighlightSource = useRef<VectorSource | null>(null);
  const currentSnapPoint = useRef<number[] | null>(null);
  const isActive = useRef(false);
  const mouseMoveListener = useRef<any>(null);
  const clickListener = useRef<any>(null);
  const debounceTimer = useRef<number | null>(null);
  const allFeaturesLayerCreated = useRef(false);
  const snapStartCoordinate = useRef<number[] | null>(null);

  const addLabelsToPoints = (coordinates: Coordinate[], parentId: string, area: string) => {
    coordinates.forEach((coord, index) => {
      const pointFeature = new Feature(new Point(coord));

      if (index === coordinates.length - 2) {
        pointFeature.setStyle([getCircleStyle(), getLabelStyle(area)]);
      } else {
        pointFeature.setStyle(getCircleStyle());
      }
      pointFeature.set('parentId', parentId);
      pointFeature.set('mode', 'advanced-trail-area');
      trailAreaSource.current.addFeature(pointFeature);
    });
  };

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'advanced-trail-area');
    if (layers) {
      map?.removeLayer(layers);
    }
    const layerGroup = new LayerGroup({
      layers: [
        new VectorLayer({
          source: trailAreaSource.current,
        }),
      ],
    });
    layerGroup.set('id', 'advanced-trail-area');
    map?.addLayer(layerGroup);
  };

  // 스냅 하이라이트 레이어 생성
  const createSnapHighlightLayer = () => {
    if (snapHighlightLayer.current) {
      map?.removeLayer(snapHighlightLayer.current);
    }
    
    snapHighlightSource.current = new VectorSource();
    snapHighlightLayer.current = new VectorLayer({
      source: snapHighlightSource.current,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255, 255, 0, 0.8)' }),
          stroke: new Stroke({ color: '#FFD700', width: 3 })
        })
      }),
      zIndex: 1000
    });
    
    if (map) {
      map.addLayer(snapHighlightLayer.current);
    }
  };

  const loadVectorData = async () => {
    if (!map) return;
    
    // all-features-layer가 이미 있으면 Advanced Select가 생성한 것 사용
    const vectorLayer = map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (vectorLayer) {
      allFeaturesLayerCreated.current = true;
    } else {
      // all-features-layer가 없으면 생성
      const layerData = useMapbase.getState().layerData;
      if (layerData && layerData.length > 0) {
        const coordinate = map.getView().getCenter();
        const zoom = map.getView().getZoom() || 0;
        if (coordinate) {
          try {
            await loadAllFeaturesToVectorLayer(map, layerData, coordinate, zoom);
            allFeaturesLayerCreated.current = true;
          } catch (error) {
            console.error('AdvancedTrailArea: all-features-layer 생성 실패:', error);
          }
        }
      }
    }
  };

  const findSnapPoint = async (mousePixel: number[]) => {
    if (!map) return null;

    const coordinate = map.getCoordinateFromPixel(mousePixel);
    const zoom = map.getView().getZoom() || 0;
    
    if (!coordinate) return null;

    const layerData = useMapbase.getState().layerData;
    if (!layerData || layerData.length === 0) return null;

    // all-features-layer가 이미 있으면 Advanced Select가 생성한 것 사용
    const vectorLayer = map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (vectorLayer) {
      allFeaturesLayerCreated.current = true;
    } else if (!allFeaturesLayerCreated.current) {
      // all-features-layer가 없으면 생성
      try {
        await loadAllFeaturesToVectorLayer(map, layerData, coordinate, zoom);
        allFeaturesLayerCreated.current = true;
      } catch (error) {
        console.error('AdvancedTrailArea: all-features-layer 생성 실패:', error);
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
        map
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
            // Point 피처: 정중앙에 스냅
            const featureCoord = geometry.coordinates;
            const distance = Math.sqrt(
              Math.pow(coordinate[0] - featureCoord[0], 2) +
              Math.pow(coordinate[1] - featureCoord[1], 2)
            );
            const resolution = map?.getView().getResolution() || 1;
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
              const resolution = map?.getView().getResolution() || 1;
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
                const resolution = map?.getView().getResolution() || 1;
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
                const resolution = map?.getView().getResolution() || 1;
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

        if (closestCoord) {
          return {
            coordinate: closestCoord,
            feature: closestFeature
          };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const showSnapHighlight = (feature: any) => {
    if (snapHighlightSource.current) {
      snapHighlightSource.current.clear();
      snapHighlightSource.current.addFeature(feature);
    }
  };

  const hideSnapHighlight = () => {
    if (snapHighlightSource.current) {
      snapHighlightSource.current.clear();
    }
  };

  // 클릭 이벤트 처리 (하이라이트 영역 내 클릭 감지)
  const handleClick = (event: any) => {
    if (!isActive.current || !currentSnapPoint.current) return;

    // 클릭한 위치가 하이라이트 영역 내인지 확인
    const mousePixel = event.pixel;
    const clickedCoord = map?.getCoordinateFromPixel(mousePixel);
    
    // Debug logs removed for performance
    
    if (clickedCoord && currentSnapPoint.current) {
      // 클릭한 위치와 하이라이트된 포인트 사이의 거리 계산
      const distance = Math.sqrt(
        Math.pow(clickedCoord[0] - currentSnapPoint.current[0], 2) +
        Math.pow(clickedCoord[1] - currentSnapPoint.current[1], 2)
      );
      
      const resolution = map?.getView().getResolution() || 1;
      const pixelDistance = distance / resolution;
      
      // Debug logs removed for performance
      
      // 하이라이트 영역 내에서 클릭한 경우 (15픽셀 이내 - 하이라이트와 동일한 톨러런스)
      if (pixelDistance <= 15) {
        // 하이라이트된 포인트의 정확한 중심점을 시작점으로 설정
        snapStartCoordinate.current = currentSnapPoint.current;
      }
    }
  };

  // 마우스 이동 핸들러 (advanced trail draw line과 동일한 방식)
  const handleMouseMove = async (event: any) => {
    if (!isActive.current) return;

    // 기존 타임아웃이 있으면 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 50ms 디바운싱 적용
    debounceTimer.current = setTimeout(async () => {
      const mousePixel = event.pixel;
      // Debug logs removed for performance
      
      const snapResult = await findSnapPoint(mousePixel);
      // Debug logs removed for performance

      if (snapResult && snapResult.coordinate) {
        // 스냅된 좌표가 있으면 하이라이트 표시
        const snappedCoord = snapResult.coordinate;
        
        if (!currentSnapPoint.current || 
            currentSnapPoint.current[0] !== snappedCoord[0] || 
            currentSnapPoint.current[1] !== snappedCoord[1]) {
          
          currentSnapPoint.current = snappedCoord;
          
          // 하이라이트 피처 생성
          const highlightFeature = new Feature({
            geometry: new Point(snappedCoord)
          });
          showSnapHighlight(highlightFeature);
        }
      } else if (currentSnapPoint.current) {
        // 스냅된 좌표가 없으면 하이라이트 제거
        currentSnapPoint.current = null;
        hideSnapHighlight();
        // Debug logs removed for performance
      }
    }, 50); // 50ms 디바운싱
  };

  const startDrawing = (isContinuous = false) => {
    if (!map) return;
    
    isActive.current = true;
    
    // 스토어 상태 업데이트
    setMeasurementMode?.('advanced-trail-area');
    
    // 연속 측정이 아닌 경우에만 레이어를 새로 생성
    if (!isContinuous) {
      addLayer();
      trailAreaSource.current.clear();
    }

    // 스냅 하이라이트 레이어 생성
    createSnapHighlightLayer();

    // 백터 데이터 로드
    loadVectorData();

    // 마우스 이동 이벤트 리스너 등록
    mouseMoveListener.current = handleMouseMove;
    map.on('pointermove', mouseMoveListener.current);
    
    // 클릭 이벤트 리스너 등록 (하이라이트 영역 내 클릭 감지)
    clickListener.current = handleClick;
    map.on('click', clickListener.current);

    const drawInteraction = new Draw({
      source: trailAreaSource.current,
      type: 'Polygon',
      style: getPolygonStyle(),
      freehand: false,
      freehandCondition: never,
      minPoints: 3,
    });

    drawInteraction.set('id', 'advanced-trail-area-draw');
    drawInteraction.set('name', '고급 면적 측정');

    drawInteraction.on('drawstart', (event: any) => {
      console.log('🔧 고급 면적 측정 시작');
      // Debug logs removed for performance
      
      // 스냅된 좌표가 있으면 첫 번째 점으로 설정
      if (snapStartCoordinate.current) {
        console.log('🔧 AdvancedTrailArea: 스냅 좌표로 첫 번째 점 설정', snapStartCoordinate.current);
        const geometry = event.feature.getGeometry() as Polygon;
        if (geometry) {
          geometry.setCoordinates([[snapStartCoordinate.current]]);
          console.log('🔧 AdvancedTrailArea: 첫 번째 점이 스냅 좌표로 설정됨');
        }
      } else {
        console.log('🔧 AdvancedTrailArea: snapStartCoordinate가 null이므로 기본 좌표 사용');
      }
    });

    drawInteraction.on('drawend', (event) => {
      const polygonFeature = event.feature;
      const geometry = polygonFeature?.getGeometry() as Polygon;
      let coordinates = geometry?.getCoordinates();
      
      // 모든 좌표를 스냅 처리 (PPT 자석 효과)
      if (coordinates && map) {
        const snappedCoordinates = coordinates.map((ring: number[][]) => {
          return ring.map((coord: number[]) => {
            const pixel = map.getPixelFromCoordinate(coord);
            if (pixel) {
              // 동기적으로 스냅 포인트 찾기
              const coordinate = map.getCoordinateFromPixel(pixel);
              if (!coordinate) return coord;

              const layerData = useMapbase.getState().layerData;
              if (!layerData || layerData.length === 0) return coord;

              // all-features-layer에서 피처 찾기
              const vectorLayer = map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer') as VectorLayer<VectorSource>;
              if (!vectorLayer) return coord;

              const source = vectorLayer.getSource();
              if (!source) return coord;

              const features = source.getFeatures();
              let closestCoord = null;
              let minDistance = Infinity;

              for (const feature of features) {
                const featureGeometry = feature.getGeometry();
                if (!featureGeometry) continue;

                const geometryType = featureGeometry.getType();
                
                if (geometryType === 'Point') {
                  const featureCoord = (featureGeometry as Point).getCoordinates();
                  const distance = Math.sqrt(
                    Math.pow(coordinate[0] - featureCoord[0], 2) +
                    Math.pow(coordinate[1] - featureCoord[1], 2)
                  );
                  const resolution = map.getView().getResolution() || 1;
                  const pixelDistance = distance / resolution;
                  
                  if (pixelDistance <= 15 && pixelDistance < minDistance) {
                    minDistance = pixelDistance;
                    closestCoord = featureCoord;
                  }
                }
              }
              
              return closestCoord || coord;
            }
            return coord;
          });
        });
        
        // 스냅된 좌표로 geometry 업데이트
        geometry.setCoordinates(snappedCoordinates);
        coordinates = snappedCoordinates;
        console.log('🔧 AdvancedTrailArea: 모든 좌표가 스냅 처리됨');
      }
      
      const parentId = `advanced-polygon-${(polygonFeature as any).ol_uid}`;
      
      event.feature.setId(parentId);
      event.feature.set('mode', 'advanced-trail-area');
      
      const SArea = geometry ? formatArea(geometry) : '0 m2';
      
      if (coordinates && coordinates[0]) {
        addLabelsToPoints(coordinates[0], parentId, SArea);
      }
      
      // 고급 면적 측정 완료
      
      // 스냅 상태 초기화
      snapStartCoordinate.current = null;
      currentSnapPoint.current = null;
      
      onEndDraw?.();
      
      // 연속 측정을 위해 Draw 인터랙션 유지 (제거하지 않음)
      // map?.removeInteraction(drawInteraction); // 제거
    });

    map.addInteraction(drawInteraction);
  };

  const stopDrawing = () => {
    if (!map) return;
    
    isActive.current = false;
    
    // 스토어 상태 업데이트
    setMeasurementMode?.('none');
    
    // 이벤트 리스너 제거 (더 강력한 정리)
    map.un('pointermove', handleMouseMove);
    map.un('click', handleClick);
    mouseMoveListener.current = null;
    clickListener.current = null;
    
    // 디바운스 타이머 정리
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    
    // 스냅 하이라이트 레이어 제거
    if (snapHighlightLayer.current) {
      map.removeLayer(snapHighlightLayer.current);
      snapHighlightLayer.current = null;
    }
    
    // 스냅 상태 초기화
    currentSnapPoint.current = null;
    snapStartCoordinate.current = null;
    
    // Draw 인터랙션 제거
    const interactions = map
      .getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          interaction.get('id') !== 'circle-selection' &&
          interaction.get('id') !== 'rect-selection' &&
          interaction.get('id') !== 'polygon-selection'
      );
    
    interactions.forEach(inter => map.removeInteraction(inter));
  };

  const clearMeasurements = () => {
    if (!map) return;
    
    // 측정 레이어 제거
    const layers = map
      .getLayers()
      .getArray()
      .find(item => item.get('id') === 'advanced-trail-area');
    
    if (layers) {
      map.removeLayer(layers);
    }
    
    // 소스 클리어
    trailAreaSource.current.clear();
  };

  // 스토어 상태 변화 감지
  useEffect(() => {
    if (modeState?.measurementMode === 'advanced-trail-area' && !isActive.current) {
      startDrawing();
    }
  }, [modeState?.measurementMode]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopDrawing();
    };
  }, [map]);

  return {
    startDrawing,
    stopDrawing,
    clearMeasurements,
  };
}; 