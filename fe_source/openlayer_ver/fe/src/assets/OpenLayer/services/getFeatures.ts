import { env } from '~/env';
import { FeatureDetail } from '~/models/Coords';
import { LayerModel } from '~/models/Layer';
import { resolutions } from '~/utils/common';
import { fetchApi } from '~/utils/fetchApi';
import { get } from 'lodash';
import { Extent } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import * as turf from '@turf/turf';
import proj4 from 'proj4';

// EPSG:5179 좌표계 정의 (Korea 2000 / Central Belt)
proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');

interface ResponseFeatures {
  features: FeatureDetail[];
  numberMatched: number;
  numerReturned: number;
  totalFeatures: number;
  type: string;
}

interface WFSResponse {
  type: string;
  totalInserted: number;
  totalUpdated: number;
  totalDeleted: number;
  insertResults?: any[];
  updateResults?: any[];
  deleteResults?: any[];
}

// 우선순위 계산 함수
const getPriority = (type: string): number => {
  switch (type) {
    case 'Point':
      return 1;
    case 'LineString':
    case 'MultiLineString':
      return 2;
    case 'Polygon':
      return 3;
    default:
      return 999;
  }
};

// 포인트가 폴리곤 내부에 있는지 확인하는 함수 (Ray Casting 알고리즘)
const isPointInPolygon = (point: number[], polygonCoords: number[][]): boolean => {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
    const [xi, yi] = polygonCoords[i];
    const [xj, yj] = polygonCoords[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
};

// 폴리곤의 면적 계산 함수
const calculatePolygonArea = (polygonCoords: number[][]): number => {
  try {
    let area = 0;
    const n = polygonCoords.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += polygonCoords[i][0] * polygonCoords[j][1];
      area -= polygonCoords[j][0] * polygonCoords[i][1];
    }
    
    return Math.abs(area) / 2;
  } catch (error) {
    console.error('면적 계산 오류:', error);
    return 0;
  }
};

// 피처와 좌표 간의 거리 계산 함수
const calculateFeatureDistance = (feature: any, coordinate: number[], resolution: number): number => {
  try {
    if (!feature.geometry || !feature.geometry.coordinates) {
      return Infinity;
    }

    const [x, y] = coordinate;
    
    if (feature.geometry.type === 'Point') {
      const [px, py] = feature.geometry.coordinates;
      // 포인트 거리 계산을 더 정확하게 (픽셀 단위)
      const pixelDistance = Math.sqrt((x - px) ** 2 + (y - py) ** 2) / resolution;
      return pixelDistance;
    } else if (feature.geometry.type === 'LineString') {
      const coords = feature.geometry.coordinates;
      let minDistance = Infinity;
      
      for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        
        const distance = pointToLineDistance([x, y], [x1, y1], [x2, y2]);
        minDistance = Math.min(minDistance, distance);
      }
      
      return minDistance / resolution;
    } else if (feature.geometry.type === 'MultiLineString') {
      const lines = feature.geometry.coordinates;
      let minDistance = Infinity;
      
      for (const line of lines) {
        for (let i = 0; i < line.length - 1; i++) {
          const [x1, y1] = line[i];
          const [x2, y2] = line[i + 1];
          
          const distance = pointToLineDistance([x, y], [x1, y1], [x2, y2]);
          minDistance = Math.min(minDistance, distance);
        }
      }
      
      return minDistance / resolution;
    } else if (feature.geometry.type === 'Polygon') {
      const coords = feature.geometry.coordinates[0];
      let minDistance = Infinity;
      
      for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        
        const distance = pointToLineDistance([x, y], [x1, y1], [x2, y2]);
        minDistance = Math.min(minDistance, distance);
      }
      
      return minDistance / resolution;
    }
    
    return Infinity;
  } catch (error) {
    console.error('거리 계산 오류:', error);
    return Infinity;
  }
};

// 점과 선분 간의 거리 계산 함수
const pointToLineDistance = (point: number[], lineStart: number[], lineEnd: number[]): number => {
  const [px, py] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B);
  }
  
  let param = dot / lenSq;
  
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = px - xx;
  const dy = py - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
};

// 모든 피처를 Vector 레이어에 저장하는 함수
export const loadAllFeaturesToVectorLayer = async (map: any, layerData: LayerModel[], coordinate: number[], zoom: number) => {
  try {
          console.log('🔧 Vector 레이어 생성 시작');
    
    // Vector 레이어 생성 시에는 더 큰 bbox 사용 (전체 영역)
    const zoomIndex = Math.round(zoom);
    const resolution = resolutions[zoomIndex];
    const pixelRadius = 2000; // 더 큰 반경으로 설정 (경계 문제 해결)
    const halfWidth = (resolution * pixelRadius);
    const halfHeight = (resolution * pixelRadius);
    
    const largeBbox = [
      coordinate[0] - halfWidth,
      coordinate[1] - halfHeight,
      coordinate[0] + halfWidth,
      coordinate[1] + halfHeight,
    ].join(',');
    
    const allFeatures: any[] = [];

    // 모든 레이어에서 WFS로 피처 가져오기
    for (const layer of layerData) {
      if (!layer.visible) continue;

      const wfsUrl = `${env.geoServer}/geoserver/ne/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ne:${layer.value}&bbox=${largeBbox},EPSG:5179&srsName=EPSG:5179&outputFormat=application/json`;
      
      const response = await fetchApi.request<ResponseFeatures>({
        url: wfsUrl,
        method: 'get',
      });
      
      if (response && response.data && response.data.features) {
        allFeatures.push(...response.data.features);
      }
    }

    // Vector 레이어 생성 및 피처 추가
    if (allFeatures.length > 0) {
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: allFeatures.map(feature => {
            const olFeature = new Feature({
              geometry: new GeoJSON().readGeometry(feature.geometry),
              ...feature.properties
            });
            olFeature.setId(feature.id);
            return olFeature;
          })
        }),
        style: () => {
          // hit detection을 위한 최소한의 투명도 유지
          return new Style({
            fill: new Fill({
              color: 'rgba(0, 0, 0, 0.01)' // 거의 투명하지만 hit detection 가능
            }),
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.01)', // 거의 투명하지만 hit detection 가능
              width: 1
            }),
            image: new CircleStyle({
              radius: 1, // 최소 크기로 hit detection 가능
              fill: new Fill({
                color: 'rgba(0, 0, 0, 0.01)'
              })
            })
          });
        }
      });
      
      // 레이어에 이름 설정
      vectorLayer.set('name', 'all-features-layer');

      // 기존 레이어 제거 후 새 레이어 추가
      const existingLayer = map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
      if (existingLayer) {
        map.removeLayer(existingLayer);
      }
      map.addLayer(vectorLayer);
      
      console.log('✅ Vector 레이어 생성 완료:', allFeatures.length, '개 피처');
    }
  } catch (error) {
    console.error('❌ Vector 레이어 생성 오류:', error);
  }
};

// 브라우저 내 피처 검색 함수 (WFS API 호출 없음)
const getFeaturesFromBrowser = (map: any, pixel: number[]) => {
  try {
    if (!map || !pixel) {
      return [];
    }

    // 브라우저 내에서 피처 검색
    const features = map.getFeaturesAtPixel(pixel, {
      hitTolerance: 15 // 15픽셀 반경으로 검색 (경계 문제 해결)
    });

    if (!features || features.length === 0) {
      return [];
    }

    // OpenLayers Feature를 GeoJSON 형태로 변환
    const convertedFeatures = features.map((feature: any) => {
      const geometry = feature.getGeometry();
      if (!geometry) return null;

      const geoJSON = new GeoJSON().writeFeatureObject(feature);
      
      // ID가 없으면 feature.getId()로 가져오기
      if (!geoJSON.id && feature.getId) {
        geoJSON.id = feature.getId();
      }
      
      // 여전히 ID가 없으면 properties에서 추출 시도
      if (!geoJSON.id && geoJSON.properties) {
        if (geoJSON.properties.id) {
          geoJSON.id = geoJSON.properties.id;
        } else if (geoJSON.properties.fid) {
          geoJSON.id = geoJSON.properties.fid;
        }
      }
      
      return geoJSON;
    }).filter(Boolean);
    
    // ID가 있는 피처만 필터링
    const validFeatures = convertedFeatures.filter(feature => {
      return feature.id && feature.id !== 'undefined' && feature.id !== undefined;
    });
    
    return validFeatures;
  } catch (error) {
    console.error('❌ 브라우저 검색 오류:', error);
    return [];
  }
};

// bbox 계산 함수 (fe_origin에서 가져옴) - 더 작은 검색 영역으로 수정
const calculateBbox = (coordinate: number[], zoom: number, resolutions: number[]) => {
  // 입력값 유효성 검사
  if (!coordinate || !Array.isArray(coordinate) || coordinate.length < 2 ||
      typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number' ||
      isNaN(coordinate[0]) || isNaN(coordinate[1])) {
    console.warn('Invalid coordinate in calculateBbox:', coordinate);
    return '0,0,0,0';
  }

  if (typeof zoom !== 'number' || isNaN(zoom) || zoom < 0) {
    console.warn('Invalid zoom level in calculateBbox:', zoom);
    return '0,0,0,0';
  }

  // 소수점 줌 레벨을 정수로 반올림하여 resolutions 배열에서 가져오기
  const zoomIndex = Math.round(zoom);
  if (zoomIndex < 0 || zoomIndex >= resolutions.length) {
    console.warn('Zoom index out of range in calculateBbox:', zoomIndex, 'for zoom:', zoom);
    return '0,0,0,0';
  }

  const resolution = resolutions[zoomIndex];
  if (typeof resolution !== 'number' || isNaN(resolution) || resolution <= 0) {
    console.warn('Invalid resolution in calculateBbox:', resolution, 'for zoom:', zoom, 'zoomIndex:', zoomIndex);
    return '0,0,0,0';
  }

  // 픽셀 반경을 10으로 늘려서 경계 문제 해결
  const pixelRadius = 10;
  const halfWidth = (resolution * pixelRadius);
  const halfHeight = (resolution * pixelRadius);
  
  const bbox = [
    coordinate[0] - halfWidth,
    coordinate[1] - halfHeight,
    coordinate[0] + halfWidth,
    coordinate[1] + halfHeight,
  ];

  // bbox 값들의 유효성 검사
  if (bbox.some(val => isNaN(val) || !isFinite(val))) {
    console.warn('Invalid bbox calculated:', bbox, 'from coordinate:', coordinate, 'zoom:', zoom, 'resolution:', resolution);
    return '0,0,0,0';
  }

  return bbox.join(',');
};

export const getListFeaturesInPixel = async (
  layerData: LayerModel[],
  zoom: number,
  coordinate: number[],
  bboxParams?: string,
  clickPixel?: number[], // 클릭한 픽셀 좌표 추가
  useBrowserSearch: boolean = false, // 브라우저 검색 사용 여부
  map?: any, // 맵 객체 (브라우저 검색용)
) => {
  // 입력값 유효성 검사
  if (!layerData || !Array.isArray(layerData) || layerData.length === 0) {
    console.warn('Invalid layerData in getListFeaturesInPixel:', layerData);
    return [];
  }

  if (typeof zoom !== 'number' || isNaN(zoom)) {
    console.warn('Invalid zoom in getListFeaturesInPixel:', zoom);
    return [];
  }

  if (!coordinate || !Array.isArray(coordinate) || coordinate.length < 2 ||
      typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number' ||
      isNaN(coordinate[0]) || isNaN(coordinate[1])) {
    console.warn('Invalid coordinate in getListFeaturesInPixel:', coordinate);
    return [];
  }

  // 브라우저 내 검색 사용 시 (마우스 오버)
  if (useBrowserSearch && map && clickPixel) {
    // Vector 레이어가 없으면 생성
    const vectorLayer = map.getLayers().getArray().find((layer: any) => layer.get('name') === 'all-features-layer');
    if (!vectorLayer) {
      await loadAllFeaturesToVectorLayer(map, layerData, coordinate, zoom);
    }
    
    const browserFeatures = getFeaturesFromBrowser(map, clickPixel);
    
    if (browserFeatures.length > 0) {
      
      // 브라우저 검색 결과에도 선택 로직 적용
      const validFeatures = browserFeatures.filter(feature => 
        feature && 
        feature.geometry && 
        feature.geometry.coordinates && 
        feature.geometry.coordinates.length > 0
      );

      if (validFeatures.length === 0) {
        return [];
      }

      // 폴리곤 내부 여부 확인
      let isInsideAnyPolygon = false;
      const polygonFeatures = validFeatures.filter(f => f.geometry.type === 'Polygon');
      
      for (const polygonFeature of polygonFeatures) {
        const polygonCoords = polygonFeature.geometry.coordinates[0];
        if (isPointInPolygon(coordinate, polygonCoords)) {
          isInsideAnyPolygon = true;
          break;
        }
      }

      // 선택 로직 적용
      const clickableFeatures = validFeatures.map(feature => {
        try {
          const zoomLevel = Math.floor(zoom);
          const pixelDistance = calculateFeatureDistance(feature, coordinate, resolutions[zoomLevel]);
          
          let finalPixelDistance = pixelDistance;
          if (feature.geometry.type === 'Polygon' && isInsideAnyPolygon) {
            finalPixelDistance = 0;
          }
          
          let threshold;
          if (feature.geometry.type === 'Polygon') {
            threshold = 100;
          } else if (feature.geometry.type === 'Point') {
            threshold = 50;
          } else {
            threshold = 100;
          }
          
          let isClickable;
          if (isInsideAnyPolygon && (feature.geometry.type === 'Point' || feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
            let strictThreshold;
            if (feature.geometry.type === 'Point') {
              strictThreshold = useBrowserSearch ? 3 : 5; // Hover는 3픽셀, 클릭은 5픽셀 (조금 완화)
            } else if (feature.geometry.type === 'LineString') {
              strictThreshold = 20;
            } else if (feature.geometry.type === 'MultiLineString') {
              strictThreshold = 20;
            } else {
              strictThreshold = 30;
            }
            isClickable = finalPixelDistance <= strictThreshold;
          } else if (feature.geometry.type === 'Polygon' && isInsideAnyPolygon) {
            isClickable = finalPixelDistance <= threshold;
          } else {
            isClickable = finalPixelDistance <= threshold;
          }
          

          
          // 폴리곤 면적 계산 (폴리곤인 경우)
          let area = 0;
          if (feature.geometry.type === 'Polygon') {
            area = calculatePolygonArea(feature.geometry.coordinates[0]);
          }
          
          return {
            feature,
            pixelDistance: finalPixelDistance,
            isClickable,
            isInsidePolygon: isInsideAnyPolygon,
            priority: getPriority(feature.geometry.type || ''),
            area: area
          };
        } catch (error) {
          console.log('피처 분석 오류:', feature.id, error);
          return {
            feature,
            pixelDistance: Infinity,
            isClickable: false,
            isInsidePolygon: false,
            priority: 999
          };
        }
      }).filter(item => item.isClickable);


      if (clickableFeatures.length > 0) {
        // 우선순위에 따라 정렬 (낮은 숫자가 높은 우선순위)
        clickableFeatures.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          
          // 우선순위가 같으면 (폴리곤끼리 비교)
          if (a.priority === 3 && b.priority === 3) {
            // 크기가 비슷한 폴리곤들 (면적 차이가 10% 이내) → 거리 기반 선택
            const areaRatio = Math.min(a.area, b.area) / Math.max(a.area, b.area);
            if (areaRatio > 0.9) {
              return a.pixelDistance - b.pixelDistance;
            } else {
              // 크기가 크게 다른 폴리곤들 → 작은 폴리곤 우선
      
              return a.area - b.area;
            }
          }
          
          // 우선순위가 같으면 거리로 정렬
          return a.pixelDistance - b.pixelDistance;
        });
        
        const selected = clickableFeatures[0];

        

        
        return [selected.feature];
      }
      
      return [];
    } else {
      return [];
    }
  }

  // WFS API 검색 (클릭 시에만 사용)

  // WFS API 검색 (클릭 시 또는 브라우저 검색 실패 시)
  const bbox = bboxParams ? bboxParams : calculateBbox(coordinate, zoom, resolutions);
  
  // bbox 유효성 검사
  if (!bbox || bbox === '0,0,0,0' || bbox.includes('NaN')) {
    console.warn('Invalid bbox calculated:', bbox);
    return [];
  }



  const promises = layerData?.map(async layer => {
    const url = `${env.geoServer}/geoserver/ne/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ne:${layer.value}&bbox=${bbox},EPSG:5179&srsName=EPSG:5179&outputFormat=application/json`;

    return fetchApi.request<ResponseFeatures>({
      url,
      method: 'get',
    }).then(response => {

      
      // 좌표계 변환은 나중에 처리하도록 주석 처리
      // if (response?.data?.features) {
      //   response.data.features.forEach(feature => {
      //     if (feature.geometry && feature.geometry.coordinates) {
      //       // proj4 좌표계 변환
      //       const transformCoordinates = (coords: any): any => {
      //         if (Array.isArray(coords)) {
      //           if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      //             // 단일 좌표 [x, y]
      //             return proj4('EPSG:5179', 'EPSG:4326', coords);
      //           } else {
      //             // 중첩 배열 [[x,y], [x,y], ...]
      //             return coords.map(coord => transformCoordinates(coord));
      //           }
      //         }
      //         return coords;
      //       };
      //       
      //       feature.geometry.coordinates = transformCoordinates(feature.geometry.coordinates);
      //       
      //       // polygonHump 좌표 변환 로그
      //       if (feature.id && feature.id.toString().includes('polygonHump')) {
      //         console.log('polygonHump 좌표계 변환 완료:', {
      //           featureId: feature.id,
      //           originalCoords: feature.geometry.coordinates,
      //           transformedCoords: feature.geometry.coordinates
      //         });
      //       }
      //     }
      //   });
      // }
      
      return response;
    }).catch(error => {
      console.error(`WFS 오류 - ${layer.value}:`, error);
      return null;
    });
  });

  const results = await Promise.all(promises);
  const allFeatures = results.flatMap(result => (result ? result.data.features : []));

  // 항상 가장 가까운 feature만 반환하도록 수정
  if (allFeatures.length > 0) {
    // 좌표 유효성 검사
    if (!coordinate || coordinate.length < 2 || typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number') {
      console.warn('Invalid coordinate:', coordinate);
      return allFeatures;
    }
    
    let closestFeature = allFeatures[0];
    let minPixelDistance = Infinity;
    

    
    // 유효한 feature만 필터링
    const validFeatures = allFeatures.filter(feature => {
      const isValid = feature && feature.geometry && feature.geometry.coordinates;
      if (!isValid) {
        console.warn('Invalid feature found:', {
          feature: feature,
          hasFeature: !!feature,
          hasGeometry: !!(feature && feature.geometry),
          hasCoordinates: !!(feature && feature.geometry && feature.geometry.coordinates)
        });
      } else {
        // polygonHump features 상세 로그
        if (feature.id && feature.id.toString().includes('polygonHump')) {
          console.log('polygonHump feature 상세:', {
            id: feature.id,
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates,
            properties: feature.properties
          });
        }
      }
      return isValid;
    });
    
    if (validFeatures.length === 0) {
      console.warn('No valid features found with geometry');
      console.warn('Total features received:', allFeatures.length);
      return [];
    }
    
    validFeatures.forEach(feature => {
      try {
        // 좌표 형식 검사 및 정규화
        let featureCoords = feature.geometry.coordinates;
        
        // Point 타입인 경우 좌표가 [x, y] 형태여야 함
        if (feature.geometry.type === 'Point') {
          if (Array.isArray(featureCoords) && featureCoords.length >= 2) {
            featureCoords = [featureCoords[0], featureCoords[1]];
          } else {
            console.warn('Invalid Point coordinates:', featureCoords);
            return;
          }
        }
        // LineString이나 Polygon의 경우 첫 번째 좌표 사용
        else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
          if (Array.isArray(featureCoords) && featureCoords.length > 0 && Array.isArray(featureCoords[0]) && featureCoords[0].length >= 2) {
            // Polygon의 경우 첫 번째 ring의 첫 번째 좌표 사용
            // 3중 중첩 배열 구조 처리: [[[[x,y],...]]] -> [x,y]
            if (Array.isArray(featureCoords[0][0])) {
              featureCoords = [featureCoords[0][0][0], featureCoords[0][0][1]];
            } else {
              featureCoords = [featureCoords[0][0], featureCoords[0][1]];
            }
          } else {
            console.warn('Invalid LineString/Polygon coordinates:', featureCoords);
            return;
          }
        }
        // MultiLineString의 경우 첫 번째 LineString의 첫 번째 좌표 사용
        else if (feature.geometry.type === 'MultiLineString') {
          if (Array.isArray(featureCoords) && featureCoords.length > 0 && 
              Array.isArray(featureCoords[0]) && featureCoords[0].length > 0 && 
              Array.isArray(featureCoords[0][0]) && featureCoords[0][0].length >= 2) {
            featureCoords = [featureCoords[0][0][0], featureCoords[0][0][1]];
          } else {
            console.warn('Invalid MultiLineString coordinates:', featureCoords);
            return;
          }
        }
        
        // polygonHump 좌표 변환 디버깅
        if (feature.id && feature.id.toString().includes('polygonHump')) {
          console.log('polygonHump 좌표 변환:', {
            featureId: feature.id,
            geometryType: feature.geometry.type,
            originalCoords: feature.geometry.coordinates,
            originalCoords0: feature.geometry.coordinates[0],
            originalCoords0_0: Array.isArray(feature.geometry.coordinates[0]) ? feature.geometry.coordinates[0][0] : null,
            originalCoords0_1: Array.isArray(feature.geometry.coordinates[0]) ? feature.geometry.coordinates[0][1] : null,
            transformedCoords: featureCoords,
            transformedCoordsValues: featureCoords ? [featureCoords[0], featureCoords[1]] : null,
            isArray: Array.isArray(featureCoords),
            hasValidCoords: featureCoords && featureCoords.length >= 2 && typeof featureCoords[0] === 'number' && typeof featureCoords[1] === 'number',
            coord0Type: typeof featureCoords?.[0],
            coord1Type: typeof featureCoords?.[1]
          });
        }
        
        // 픽셀 기반 거리 계산 (fe_origin 방식)
        const zoomLevel = Math.floor(zoom); // 소수점 제거하여 정수로 변환
        const resolution = resolutions[zoomLevel];
        
        // polygonHump 거리 계산 디버깅
        if (feature.id && feature.id.toString().includes('polygonHump')) {
          console.log('polygonHump 거리 계산:', {
            featureId: feature.id,
            featureCoords: featureCoords,
            clickCoordinate: coordinate,
            originalZoom: zoom,
            zoomLevel: zoomLevel,
            resolution: resolution,
            originalCoords: feature.geometry.coordinates,
            originalCoordsType: typeof feature.geometry.coordinates[0],
            originalCoordsLength: Array.isArray(feature.geometry.coordinates[0]) ? feature.geometry.coordinates[0].length : 'not array'
          });
        }
        let pixelDistance = Infinity;
        
        // Polygon의 경우 외곽선에서의 최단 거리 계산
        if (feature.geometry.type === 'Polygon') {
          const polygonCoords = feature.geometry.coordinates[0] as unknown as number[][];
          let minDistance = Infinity;
          
          // 외곽선의 각 세그먼트에서 최단 거리 계산
          for (let i = 0; i < polygonCoords.length - 1; i++) {
            const segStart = polygonCoords[i];
            const segEnd = polygonCoords[i + 1];
            
            // 선분에서 점까지의 최단 거리 계산
            const dx = segEnd[0] - segStart[0];
            const dy = segEnd[1] - segStart[1];
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            if (segLength === 0) {
              // 선분이 점인 경우
              const pointDistance = Math.sqrt(
                Math.pow(coordinate[0] - segStart[0], 2) + 
                Math.pow(coordinate[1] - segStart[1], 2)
              );
              minDistance = Math.min(minDistance, pointDistance);
            } else {
              // 선분에서 점까지의 최단 거리 계산
              const t = Math.max(0, Math.min(1, 
                ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
              ));
              
              const closestPoint = [
                segStart[0] + t * dx,
                segStart[1] + t * dy
              ];
              
              const segDistance = Math.sqrt(
                Math.pow(coordinate[0] - closestPoint[0], 2) + 
                Math.pow(coordinate[1] - closestPoint[1], 2)
              );
              minDistance = Math.min(minDistance, segDistance);
            }
          }
          
          pixelDistance = minDistance / resolution;
        } else if (feature.geometry.type === 'LineString') {
          // LineString의 경우 선분에서 점까지의 최단 거리 계산
          const lineCoords = feature.geometry.coordinates as unknown as number[][];
          let minDistance = Infinity;
          
          // 각 선분에서 최단 거리 계산
          for (let i = 0; i < lineCoords.length - 1; i++) {
            const segStart = lineCoords[i];
            const segEnd = lineCoords[i + 1];
            
            // 선분에서 점까지의 최단 거리 계산
            const dx = segEnd[0] - segStart[0];
            const dy = segEnd[1] - segStart[1];
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            if (segLength === 0) {
              // 선분이 점인 경우
              const pointDistance = Math.sqrt(
                Math.pow(coordinate[0] - segStart[0], 2) + 
                Math.pow(coordinate[1] - segStart[1], 2)
              );
              minDistance = Math.min(minDistance, pointDistance);
            } else {
              // 선분에서 점까지의 최단 거리 계산
              const t = Math.max(0, Math.min(1, 
                ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
              ));
              
              const closestPoint = [
                segStart[0] + t * dx,
                segStart[1] + t * dy
              ];
              
              const segDistance = Math.sqrt(
                Math.pow(coordinate[0] - closestPoint[0], 2) + 
                Math.pow(coordinate[1] - closestPoint[1], 2)
              );
              minDistance = Math.min(minDistance, segDistance);
            }
          }
          
          pixelDistance = minDistance / resolution;
        } else if (feature.geometry.type === 'MultiLineString') {
          // MultiLineString의 경우 모든 LineString에서 최단 거리 계산
          const multiLineCoords = feature.geometry.coordinates as unknown as number[][][];
          let minDistance = Infinity;
          
          // 각 LineString에 대해 거리 계산
          for (const lineString of multiLineCoords) {
            // 각 선분에서 최단 거리 계산
            for (let i = 0; i < lineString.length - 1; i++) {
              const segStart = lineString[i];
              const segEnd = lineString[i + 1];
              
              // 선분에서 점까지의 최단 거리 계산
              const dx = segEnd[0] - segStart[0];
              const dy = segEnd[1] - segStart[1];
              const segLength = Math.sqrt(dx * dx + dy * dy);
              
              if (segLength === 0) {
                // 선분이 점인 경우
                const pointDistance = Math.sqrt(
                  Math.pow(coordinate[0] - segStart[0], 2) + 
                  Math.pow(coordinate[1] - segStart[1], 2)
                );
                minDistance = Math.min(minDistance, pointDistance);
              } else {
                // 선분에서 점까지의 최단 거리 계산
                const t = Math.max(0, Math.min(1, 
                  ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
                ));
                
                const closestPoint = [
                  segStart[0] + t * dx,
                  segStart[1] + t * dy
                ];
                
                const segDistance = Math.sqrt(
                  Math.pow(coordinate[0] - closestPoint[0], 2) + 
                  Math.pow(coordinate[1] - closestPoint[1], 2)
                );
                minDistance = Math.min(minDistance, segDistance);
              }
            }
          }
          
          pixelDistance = minDistance / resolution;
        } else {
          // Point는 기존 방식 사용
          const featurePixelX = (featureCoords[0] - coordinate[0]) / resolution;
          const featurePixelY = (featureCoords[1] - coordinate[1]) / resolution;
          pixelDistance = Math.sqrt(featurePixelX * featurePixelX + featurePixelY * featurePixelY);
        }
        
        // polygonHump 거리 계산 전 좌표 확인
        if (feature.id && feature.id.toString().includes('polygonHump')) {
          console.log('polygonHump 거리 계산 전 좌표:', {
            featureId: feature.id,
            featureCoords: featureCoords,
            featureCoords0: featureCoords[0],
            featureCoords1: featureCoords[1],
            clickCoordinate: coordinate,
            clickCoordinate0: coordinate[0],
            clickCoordinate1: coordinate[1],
            resolution: resolution,
            subtractionX: featureCoords[0] - coordinate[0],
            subtractionY: featureCoords[1] - coordinate[1],
            pixelDistance: pixelDistance
          });
        }
        
        // polygonHump 거리 계산 상세 디버깅
        if (feature.id && feature.id.toString().includes('polygonHump')) {
          console.log('polygonHump 거리 계산 상세:', {
            featureId: feature.id,
            pixelDistance: pixelDistance,
            isNaN: isNaN(pixelDistance),
            isFinite: isFinite(pixelDistance)
          });
        }
        
        // 피처에 거리 정보 추가
        (feature as any)._pixelDistance = pixelDistance;
        
        if (pixelDistance < minPixelDistance) {
          minPixelDistance = pixelDistance;
          closestFeature = feature;
        }
      } catch (error) {
        console.warn('Error calculating distance for feature:', feature.id, error);
      }
    });
    
    console.log('가장 가까운 feature 선택됨:', closestFeature.id, '거리:', minPixelDistance);
    
    // 우선순위 기반 선택 로직
    const getPriority = (type: string): number => {
      switch (type) {
        case 'Point': return 1;        // 최우선
        case 'LineString': return 2;   // 2순위
        case 'MultiLineString': return 2; // 2순위
        case 'Polygon': return 3;      // 3순위
        default: return 999;
      }
    };

    // 점이 Polygon 내부에 있는지 확인하는 함수
    const isPointInPolygon = (point: number[], polygonCoords: number[][]): boolean => {
      let inside = false;
      for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
        const xi = polygonCoords[i][0], yi = polygonCoords[i][1];
        const xj = polygonCoords[j][0], yj = polygonCoords[j][1];
        
        if (((yi > point[1]) !== (yj > point[1])) && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      return inside;
    };

    // 피처 거리 계산 함수
    const calculateFeatureDistance = (feature: any, coordinate: number[], resolution: number): number => {
      try {
        if (feature.geometry.type === 'Point') {
          const pointCoords = feature.geometry.coordinates as number[];
          const distance = Math.sqrt(
            Math.pow(coordinate[0] - pointCoords[0], 2) + 
            Math.pow(coordinate[1] - pointCoords[1], 2)
          );
          return distance / resolution;
        } else if (feature.geometry.type === 'LineString') {
          const lineCoords = feature.geometry.coordinates as unknown as number[][];
          let minDistance = Infinity;
          
          for (let i = 0; i < lineCoords.length - 1; i++) {
            const segStart = lineCoords[i];
            const segEnd = lineCoords[i + 1];
            
            const dx = segEnd[0] - segStart[0];
            const dy = segEnd[1] - segStart[1];
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            if (segLength === 0) {
              const pointDistance = Math.sqrt(
                Math.pow(coordinate[0] - segStart[0], 2) + 
                Math.pow(coordinate[1] - segStart[1], 2)
              );
              minDistance = Math.min(minDistance, pointDistance);
            } else {
              const t = Math.max(0, Math.min(1, 
                ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
              ));
              
              const closestPoint = [
                segStart[0] + t * dx,
                segStart[1] + t * dy
              ];
              
              const segDistance = Math.sqrt(
                Math.pow(coordinate[0] - closestPoint[0], 2) + 
                Math.pow(coordinate[1] - closestPoint[1], 2)
              );
              minDistance = Math.min(minDistance, segDistance);
            }
          }
          
          return minDistance / resolution;
        } else if (feature.geometry.type === 'MultiLineString') {
          const multiLineCoords = feature.geometry.coordinates as unknown as number[][][];
          let minDistance = Infinity;
          
          for (const lineString of multiLineCoords) {
            for (let i = 0; i < lineString.length - 1; i++) {
              const segStart = lineString[i];
              const segEnd = lineString[i + 1];
              
              const dx = segEnd[0] - segStart[0];
              const dy = segEnd[1] - segStart[1];
              const segLength = Math.sqrt(dx * dx + dy * dy);
              
              if (segLength === 0) {
                const pointDistance = Math.sqrt(
                  Math.pow(coordinate[0] - segStart[0], 2) + 
                  Math.pow(coordinate[1] - segStart[1], 2)
                );
                minDistance = Math.min(minDistance, pointDistance);
              } else {
                const t = Math.max(0, Math.min(1, 
                  ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
                ));
                
                const closestPoint = [
                  segStart[0] + t * dx,
                  segStart[1] + t * dy
                ];
                
                const segDistance = Math.sqrt(
                  Math.pow(coordinate[0] - closestPoint[0], 2) + 
                  Math.pow(coordinate[1] - closestPoint[1], 2)
                );
                minDistance = Math.min(minDistance, segDistance);
              }
            }
          }
          
          return minDistance / resolution;
        } else if (feature.geometry.type === 'Polygon') {
          const polygonCoords = feature.geometry.coordinates[0] as unknown as number[][];
          let minDistance = Infinity;
          
          for (let i = 0; i < polygonCoords.length - 1; i++) {
            const segStart = polygonCoords[i];
            const segEnd = polygonCoords[i + 1];
            
            const dx = segEnd[0] - segStart[0];
            const dy = segEnd[1] - segStart[1];
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            if (segLength === 0) {
              const pointDistance = Math.sqrt(
                Math.pow(coordinate[0] - segStart[0], 2) + 
                Math.pow(coordinate[1] - segStart[1], 2)
              );
              minDistance = Math.min(minDistance, pointDistance);
            } else {
              const t = Math.max(0, Math.min(1, 
                ((coordinate[0] - segStart[0]) * dx + (coordinate[1] - segStart[1]) * dy) / (segLength * segLength)
              ));
              
              const closestPoint = [
                segStart[0] + t * dx,
                segStart[1] + t * dy
              ];
              
              const segDistance = Math.sqrt(
                Math.pow(coordinate[0] - closestPoint[0], 2) + 
                Math.pow(coordinate[1] - closestPoint[1], 2)
              );
              minDistance = Math.min(minDistance, segDistance);
            }
          }
          
          return minDistance / resolution;
        }
        
        return Infinity;
      } catch (error) {
        return Infinity;
      }
    };

    // 클릭 가능한 피처들을 우선순위로 정렬
    // 먼저 폴리곤 내부 여부를 전역적으로 확인
    let isInsideAnyPolygon = false;
    const polygonFeatures = validFeatures.filter(f => f.geometry.type === 'Polygon');
    
    for (const polygonFeature of polygonFeatures) {
      const polygonCoords = polygonFeature.geometry.coordinates[0] as unknown as number[][];
              if (isPointInPolygon(coordinate, polygonCoords)) {
          isInsideAnyPolygon = true;
          break;
        }
    }
    
    const clickableFeatures = validFeatures.map(feature => {
      try {
                    const zoomLevel = Math.floor(zoom);
            const pixelDistance = calculateFeatureDistance(feature, coordinate, resolutions[zoomLevel]);
        
        // 폴리곤 내부에 있으면 거리를 0으로 설정
        let finalPixelDistance = pixelDistance;
        if (feature.geometry.type === 'Polygon' && isInsideAnyPolygon) {
          finalPixelDistance = 0;
        }
        
        // 클릭 가능한지 확인 (임계값 조정)
        let threshold;
        if (feature.geometry.type === 'Polygon') {
          threshold = 100; // Polygon은 관대하게
        } else if (feature.geometry.type === 'Point') {
          threshold = 50; // Point는 더 관대하게 (마우스 오버 편의성)
        } else {
          threshold = 100; // Line을 매우 관대하게 (폴리곤과 동일하게)
        }
        
        // 폴리곤 내부에서 점/선/멀티선의 임계값을 더 엄격하게 설정
        let isClickable;
        if (isInsideAnyPolygon && (feature.geometry.type === 'Point' || feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
          // 폴리곤 내부에서 각 타입별 엄격한 임계값 적용 (13인치 모니터 최적화)
          let strictThreshold;
          if (feature.geometry.type === 'Point') {
            strictThreshold = 5; // Point 임계치를 매우 엄격하게 (8 → 5)
          } else if (feature.geometry.type === 'LineString') {
            strictThreshold = 20; // LineString은 한 단계 느슨하게
          } else if (feature.geometry.type === 'MultiLineString') {
            strictThreshold = 20; // MultiLineString도 한 단계 느슨하게
          } else {
            strictThreshold = 30; // 기본값도 한 단계 느슨하게
          }
          isClickable = finalPixelDistance <= strictThreshold;
        } else if (feature.geometry.type === 'Polygon' && isInsideAnyPolygon) {
          // 폴리곤 내부에 있을 때는 폴리곤도 일반적인 임계값 적용
          isClickable = finalPixelDistance <= threshold;
        } else {
          // 일반적인 경우
          isClickable = finalPixelDistance <= threshold;
        }
        
        // 폴리곤 내부 피처 선택 디버깅
        if (isInsideAnyPolygon && (feature.geometry.type === 'Point' || feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
          let debugThreshold;
          if (feature.geometry.type === 'Point') {
            debugThreshold = 5; // 포인트 임계치를 매우 엄격하게 (8 → 5)
          } else if (feature.geometry.type === 'LineString') {
            debugThreshold = 20;
          } else if (feature.geometry.type === 'MultiLineString') {
            debugThreshold = 20;
          } else {
            debugThreshold = 30;
          }
          console.log('🎯 폴리곤 내부 피처:', {
            id: feature.id,
            type: feature.geometry.type,
            distance: finalPixelDistance,
            threshold: debugThreshold,
            clickable: isClickable
          });
        }
        
        return {
          feature,
          pixelDistance: finalPixelDistance,
          isClickable,
          isInsidePolygon: isInsideAnyPolygon,
          priority: getPriority(feature.geometry.type || '')
        };
      } catch (error) {
        console.log('피처 분석 오류:', feature.id, error);
        return {
          feature,
          pixelDistance: Infinity,
          isClickable: false,
          isInsidePolygon: false,
          priority: 999
        };
      }
    }).filter(item => item.isClickable);
    
    
    if (clickableFeatures.length > 0) {
      const selected = clickableFeatures[0];
      
      
      // 선택된 피처를 GeoJSON 형식으로 반환
      return [{
        id: selected.feature.id,
        type: 'Feature',
        geometry: selected.feature.geometry,
        properties: selected.feature.properties || {}
      }];
    }
    
    // 클릭 가능한 피처가 없으면 빈 배열 반환
    return [];
  }
};

// WFS Transaction을 위한 feature 업데이트 함수
export const updateFeatureViaWFS = async (
  layerName: string,
  featureId: string,
  newGeometry: any,
  properties?: any
): Promise<WFSResponse> => {
  const geoJsonFormat = new GeoJSON();
  
  // 좌표 유효성 검증 추가
  console.log('updateFeatureViaWFS - 입력 geometry:', newGeometry);
  console.log('updateFeatureViaWFS - geometry type:', newGeometry?.type);
  console.log('updateFeatureViaWFS - coordinates:', newGeometry?.coordinates);
  
  // 좌표 유효성 검사
  if (!newGeometry || !newGeometry.type || !newGeometry.coordinates) {
    console.error('Invalid geometry data:', newGeometry);
    throw new Error('Invalid geometry data');
  }
  
  // 좌표 배열 유효성 검사
  if (!Array.isArray(newGeometry.coordinates)) {
    console.error('Coordinates is not an array:', newGeometry.coordinates);
    throw new Error('Coordinates must be an array');
  }
  
  // Polygon의 경우 좌표 구조 검사
  if (newGeometry.type === 'Polygon') {
    if (!Array.isArray(newGeometry.coordinates[0])) {
      console.error('Polygon coordinates[0] is not an array:', newGeometry.coordinates[0]);
      throw new Error('Polygon coordinates[0] must be an array');
    }
    
    if (newGeometry.coordinates[0].length < 3) {
      console.error('Polygon must have at least 3 points:', newGeometry.coordinates[0].length);
      throw new Error('Polygon must have at least 3 points');
    }
    
    // 각 좌표가 유효한지 검사
    newGeometry.coordinates[0].forEach((coord: any, index: number) => {
      if (!Array.isArray(coord) || coord.length < 2) {
        console.error(`Invalid coordinate at index ${index}:`, coord);
        throw new Error(`Invalid coordinate at index ${index}`);
      }
      if (typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
        console.error(`Coordinate values at index ${index} are not numbers:`, coord);
        throw new Error(`Coordinate values at index ${index} must be numbers`);
      }
    });
    
    console.log('Polygon coordinates validation passed:', {
      type: newGeometry.type,
      coordinatesLength: newGeometry.coordinates.length,
      firstRingLength: newGeometry.coordinates[0].length,
      firstCoordinate: newGeometry.coordinates[0][0],
      lastCoordinate: newGeometry.coordinates[0][newGeometry.coordinates[0].length - 1]
    });
  }
  
  // WKT 형식으로 geometry 생성 (polygonHump만)
  let wktGeometry = '';
  
  if (newGeometry.type === 'Polygon' && layerName === 'polygonHump') {
    // polygonHump의 경우 EPSG:5179 좌표계를 그대로 사용 (변환 없음)
    const transformedCoords = newGeometry.coordinates[0].map((coord: number[]) => {
      console.log('polygonHump 좌표 (EPSG:5179 그대로):', { 
        x: coord[0],
        y: coord[1],
        isValid: !isNaN(coord[0]) && !isNaN(coord[1])
      });
      return coord; // 변환하지 않고 그대로 사용
    });
    
    const coordString = transformedCoords.map((coord: number[]) => {
      // 좌표 정밀도를 6자리로 제한하여 오차 최소화
      const x = Math.round(coord[0] * 1000000) / 1000000;
      const y = Math.round(coord[1] * 1000000) / 1000000;
      return `${x} ${y}`;
    }).join(',');
    wktGeometry = `POLYGON((${coordString}))`;
    console.log('WKT Geometry:', wktGeometry);
    console.log('=== 좌표 변환 상세 ===');
    console.log('원본 좌표 개수:', newGeometry.coordinates[0].length);
    console.log('변환된 좌표 개수:', transformedCoords.length);
    console.log('첫 번째 좌표 비교:', {
      original: newGeometry.coordinates[0][0],
      converted: transformedCoords[0],
      rounded: [Math.round(transformedCoords[0][0] * 1000000) / 1000000, Math.round(transformedCoords[0][1] * 1000000) / 1000000]
    });
  }

  // 새로운 feature 생성
  const updatedFeature = {
    type: 'Feature',
    id: featureId,
    geometry: newGeometry,
    properties: properties || {}
  };
  
  // WFS Transaction XML 생성 (WFS 1.1.0 사용) - fe5와 동일한 코드
  const transactionXml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:Transaction service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:ne="http://ne">
  <wfs:Update typeName="ne:${layerName}">
    <wfs:Property>
      <wfs:Name>geom</wfs:Name>
      <wfs:Value>
        ${layerName === 'polygonHump' ? wktGeometry :
          newGeometry.type === 'Point' ? 
            `<gml:Point srsName="EPSG:5179">
              <gml:coordinates>${newGeometry.coordinates.join(',')}</gml:coordinates>
            </gml:Point>` :
            newGeometry.type === 'LineString' ?
            `<gml:LineString srsName="EPSG:5179">
              <gml:coordinates>${newGeometry.coordinates.map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
            </gml:LineString>` :
            newGeometry.type === 'MultiLineString' ?
            `<gml:MultiLineString srsName="EPSG:5179">
              ${newGeometry.coordinates.map((lineString: number[][]) => `
              <gml:lineStringMember>
                <gml:LineString>
                  <gml:coordinates>${lineString.map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
                </gml:LineString>
              </gml:lineStringMember>
              `).join('')}
            </gml:MultiLineString>` :
            newGeometry.type === 'Polygon' ?
            `<gml:Polygon srsName="EPSG:4326">
              <gml:outerBoundaryIs>
                <gml:LinearRing>
                  <gml:posList>${newGeometry.coordinates[0].map((coord: number[]) => coord.join(' ')).join(' ')}</gml:posList>
                </gml:LinearRing>
              </gml:outerBoundaryIs>
            </gml:Polygon>` :
            newGeometry.type === 'MultiPolygon' ?
            `<gml:MultiPolygon srsName="EPSG:5179">
              ${newGeometry.coordinates.map((polygon: number[][][]) => `
              <gml:polygonMember>
                <gml:Polygon>
                  <gml:outerBoundaryIs>
                    <gml:LinearRing>
                      <gml:coordinates>${polygon[0].map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
                    </gml:LinearRing>
                  </gml:outerBoundaryIs>
                </gml:Polygon>
              </gml:polygonMember>
              `).join('')}
            </gml:MultiPolygon>` :
            `<gml:Point srsName="EPSG:5179">
              <gml:coordinates>${newGeometry.coordinates.join(',')}</gml:coordinates>
            </gml:Point>`
        }
      </wfs:Value>
    </wfs:Property>
    ${properties ? Object.entries(properties).map(([key, value]) => `
    <wfs:Property>
      <wfs:Name>${key}</wfs:Name>
      <wfs:Value>${value}</wfs:Value>
    </wfs:Property>
    `).join('') : ''}
    <ogc:Filter>
      <ogc:FeatureId fid="${featureId}"/>
    </ogc:Filter>
  </wfs:Update>
</wfs:Transaction>`;

  const url = `${env.geoServer}/geoserver/ne/wfs`;
  
  try {
    console.log('=== WFS Update Debug ===');
    console.log('Layer Name:', layerName);
    console.log('Feature ID:', featureId);
    console.log('Geometry Type:', newGeometry.type);
    console.log('Coordinates:', newGeometry.coordinates);
    console.log('WFS Transaction XML:', transactionXml);
    console.log('WFS URL:', url);
    
    // polygonHump인 경우 상세 로그 추가
    if (layerName === 'polygonHump') {
      console.log('=== polygonHump 상세 로그 ===');
      console.log('1. 입력된 geometry:', JSON.stringify(newGeometry, null, 2));
      console.log('2. 좌표 개수:', newGeometry.coordinates[0].length);
      console.log('3. 첫 번째 좌표:', newGeometry.coordinates[0][0]);
      console.log('4. 마지막 좌표:', newGeometry.coordinates[0][newGeometry.coordinates[0].length - 1]);
      console.log('5. WKT Geometry:', wktGeometry);
      console.log('6. WKT 좌표 개수:', wktGeometry.split(',').length);
      console.log('7. WKT 첫 번째 좌표:', wktGeometry.split('(')[2].split(',')[0]);
      console.log('8. WKT 마지막 좌표:', wktGeometry.split(')')[0].split(',').slice(-1)[0]);
      console.log('9. XML 길이:', transactionXml.length);
      console.log('10. XML에서 geom 값:', transactionXml.match(/<wfs:Value>\s*(.*?)\s*<\/wfs:Value>/s)?.[1] || '찾을 수 없음');
    }
    
    // polygonHump인 경우 XML에서 좌표 값 확인
    if (layerName === 'polygonHump') {
      const coordinatesMatch = transactionXml.match(/<gml:coordinates>(.*?)<\/gml:coordinates>/s);
      if (coordinatesMatch) {
        console.log('=== WFS XML 좌표 확인 ===');
        console.log('XML 좌표 문자열:', coordinatesMatch[1]);
        console.log('좌표 개수:', coordinatesMatch[1].split(' ').length);
        console.log('첫 번째 좌표:', coordinatesMatch[1].split(' ')[0]);
        console.log('마지막 좌표:', coordinatesMatch[1].split(' ').slice(-1)[0]);
      }
    }
    console.log('=== Sending WFS Request ===');
    console.log('Request URL:', url);
    console.log('Request Method:', 'POST');
    console.log('Request Data Length:', transactionXml.length);
    
    const response = await fetchApi.request<WFSResponse>({
      url,
      method: 'post',
      data: transactionXml,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    
    console.log('=== WFS Response Received ===');
    console.log('WFS 응답 상태:', response.status);
    console.log('WFS 응답 헤더:', response.headers);
    console.log('WFS 응답 타입:', typeof response.data);
    console.log('WFS 응답 전체:', response);
    console.log('WFS Transaction 성공:', response.data);
    
    // polygonHump인 경우 응답 상세 로그 추가
    if (layerName === 'polygonHump') {
      console.log('=== polygonHump 응답 상세 로그 ===');
      console.log('1. 응답 상태 코드:', response.status);
      console.log('2. 응답 헤더 Content-Type:', response.headers['content-type']);
      console.log('3. 응답 데이터 타입:', typeof response.data);
      console.log('4. 응답 데이터 길이:', typeof response.data === 'string' ? (response.data as string).length : '객체');
      console.log('5. 응답 데이터 내용:', response.data);
      
      // XML 응답 파싱 시도
      if (typeof response.data === 'string') {
        const responseStr = response.data as string;
        console.log('6. totalUpdated 포함 여부:', responseStr.includes('totalUpdated'));
        console.log('7. totalUpdated 값:', responseStr.match(/totalUpdated="(\d+)"/)?.[1] || '찾을 수 없음');
        console.log('8. totalUpdated 태그 값:', responseStr.match(/<wfs:totalUpdated>(\d+)<\/wfs:totalUpdated>/)?.[1] || '찾을 수 없음');
        console.log('9. 오류 메시지 포함 여부:', responseStr.includes('Exception'));
        if (responseStr.includes('Exception')) {
          console.log('10. 오류 메시지:', responseStr.match(/<ows:ExceptionText>(.*?)<\/ows:ExceptionText>/)?.[1] || '찾을 수 없음');
        }
      }
    }
    
    // 응답이 문자열인 경우 XML 파싱 시도
    if (typeof response.data === 'string') {
      console.log('WFS 응답이 문자열입니다. XML 내용:', response.data);
      // XML에서 totalUpdated 확인
      const responseStr = response.data as string;
      if (responseStr.includes('totalUpdated="0"')) {
        console.warn('WFS 응답에서 totalUpdated가 0입니다.');
        throw new Error('업데이트된 레코드가 없습니다.');
      } else if (responseStr.includes('totalUpdated="1"')) {
        console.log('WFS 응답에서 totalUpdated가 1입니다. 성공!');
      } else if (responseStr.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
        console.log('WFS 응답에서 totalUpdated가 1입니다. 성공!');
      } else if (responseStr.includes('<wfs:totalUpdated>0</wfs:totalUpdated>')) {
        console.warn('WFS 응답에서 totalUpdated가 0입니다.');
        throw new Error('업데이트된 레코드가 없습니다.');
      } else {
        console.log('WFS 응답에서 totalUpdated 정보를 찾을 수 없습니다.');
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('=== WFS Update Error ===');
    console.error('WFS Transaction 실패:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: url,
      layerName: layerName,
      featureId: featureId
    });
    
    // Check for specific error types
    if (error.response?.data && typeof error.response.data === 'string') {
      if (error.response.data.includes('read-only')) {
        throw new Error(`레이어 '${layerName}'이(가) 읽기 전용으로 설정되어 있습니다. GeoServer에서 레이어 권한을 확인해주세요.`);
      } else if (error.response.data.includes('No such property')) {
        throw new Error(`레이어 '${layerName}'에서 속성을 찾을 수 없습니다. 데이터베이스 스키마를 확인해주세요.`);
      }
    }
    
    throw error;
  }
};

// WFS Transaction을 위한 feature 삭제 함수
export const deleteFeatureViaWFS = async (
  layerName: string,
  featureId: string
): Promise<WFSResponse> => {
  console.log('🗑️ deleteFeatureViaWFS 시작:', { layerName, featureId });
  
  const transactionXml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:Transaction service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:ne="http://ne">
  <wfs:Delete typeName="ne:${layerName}">
    <ogc:Filter>
      <ogc:FeatureId fid="${featureId}"/>
    </ogc:Filter>
  </wfs:Delete>
</wfs:Transaction>`;

  const url = `${env.geoServer}/geoserver/ne/wfs`;
  
  console.log('🗑️ WFS Delete 요청 URL:', url);
  console.log('🗑️ WFS Delete 요청 XML:', transactionXml);
  
  try {
    console.log('🗑️ fetchApi.request 호출 시작');
    const response = await fetchApi.request<WFSResponse>({
      url,
      method: 'post',
      data: transactionXml,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    
    console.log('✅ WFS Delete Transaction 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ WFS Delete Transaction 실패:', error);
    throw error;
  }
};

// WFS Transaction을 위한 feature 삽입 함수
export const insertFeatureViaWFS = async (
  layerName: string,
  geometry: any,
  properties?: any
): Promise<WFSResponse> => {
  // geometry 유효성 검사
  if (!geometry || !geometry.type || !geometry.coordinates) {
    throw new Error('Invalid geometry data');
  }

  console.log('Inserting geometry:', geometry);
  console.log('Properties:', properties);

  let geometryXml = '';
  
  if (geometry.type === 'Point') {
    geometryXml = `<gml:Point srsName="EPSG:4326">
      <gml:coordinates>${geometry.coordinates.join(',')}</gml:coordinates>
    </gml:Point>`;
  } else if (geometry.type === 'LineString') {
    geometryXml = `<gml:MultiLineString srsName="EPSG:5179">
      <gml:lineStringMember>
        <gml:LineString>
          <gml:coordinates>${geometry.coordinates.map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
        </gml:LineString>
      </gml:lineStringMember>
    </gml:MultiLineString>`;
  } else if (geometry.type === 'MultiLineString') {
    geometryXml = `<gml:MultiLineString srsName="EPSG:5179">
      ${geometry.coordinates.map((lineString: number[][]) => `
      <gml:lineStringMember>
        <gml:LineString>
          <gml:coordinates>${lineString.map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
        </gml:LineString>
      </gml:lineStringMember>
      `).join('')}
    </gml:MultiLineString>`;
  } else if (geometry.type === 'Polygon') {
    geometryXml = `<gml:Polygon srsName="EPSG:4326">
      <gml:outerBoundaryIs>
        <gml:LinearRing>
          <gml:coordinates>${geometry.coordinates[0].map((coord: number[]) => coord.join(',')).join(' ')}</gml:coordinates>
        </gml:LinearRing>
      </gml:outerBoundaryIs>
    </gml:Polygon>`;
  } else {
    throw new Error(`Unsupported geometry type: ${geometry.type}`);
  }

  const propertiesXml = properties ? Object.entries(properties).map(([key, value]) => 
    `<ne:${key}>${value}</ne:${key}>`
  ).join('') : '';

  const transactionXml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:Transaction service="WFS" version="1.0.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:ne="https://www.naturalearthdata.com">
  <wfs:Insert>
    <ne:${layerName}>
      <ne:geom>
        ${geometryXml}
      </ne:geom>
      ${propertiesXml}
    </ne:${layerName}>
  </wfs:Insert>
</wfs:Transaction>`;

  console.log('WFS Insert XML:', transactionXml);
  
  const url = `${env.geoServer}/geoserver/ne/wfs`;
  
  try {
    const response = await fetchApi.request<WFSResponse>({
      url,
      method: 'post',
      data: transactionXml,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    
      console.log('WFS Insert Transaction 성공:', response.data);
  return response.data;
} catch (error) {
  console.error('WFS Insert Transaction 실패:', error);
  throw error;
}
};

export async function getFeatureById(layerName: string, cqlFilter: any) {
  const url = `${env.geoServer}/geoserver/ne/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ne:${layerName}&CQL_FILTER=${encodeURIComponent(cqlFilter)}&srsName=EPSG:5179&outputFormat=application/json`;
  try {
    const response = await fetchApi.request<ResponseFeatures>({ url, method: 'get' });
    return get(response.data, 'features[0]', null);
  } catch (error) {
    console.error('Fetch error for full feature:', error);
    return null;
  }
}

export const getFeaturesFromWFS = async (extent: Extent, layerNames: string[]) => {
  const geoJsonFormat = new GeoJSON();

  const promises = layerNames.map(async layerName => {
    const wfsUrl = `${env.geoServer}/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=ne:${layerName}&outputFormat=application/json&bbox=${extent.join(',')},EPSG:5179`;
    const response = await fetchApi.request({ url: wfsUrl, method: 'get' });
    const data = response.data;

    return data.features.map((feature: any) =>
      geoJsonFormat.readFeature(feature, {
        featureProjection: 'EPSG:5179',
      }),
    );
  });

  const features = (await Promise.all(promises)).flat();
  return features;
};
