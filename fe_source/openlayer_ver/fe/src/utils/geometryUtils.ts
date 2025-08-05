import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

/**
 * GeoJSON을 OpenLayers Geometry로 변환
 */
export function createOLGeometry(geojson: any): Geometry | null {
  try {
    if (!geojson || !geojson.type) {
      console.error('Invalid GeoJSON:', geojson);
      return null;
    }

    switch (geojson.type) {
      case 'Point':
        return new (require('ol/geom/Point').default)(geojson.coordinates);
      case 'LineString':
        return new (require('ol/geom/LineString').default)(geojson.coordinates);
      case 'Polygon':
        return new (require('ol/geom/Polygon').default)(geojson.coordinates);
      case 'MultiPoint':
        return new (require('ol/geom/MultiPoint').default)(geojson.coordinates);
      case 'MultiLineString':
        return new (require('ol/geom/MultiLineString').default)(geojson.coordinates);
      case 'MultiPolygon':
        return new (require('ol/geom/MultiPolygon').default)(geojson.coordinates);
      default:
        console.error('Unsupported geometry type:', geojson.type);
        return null;
    }
  } catch (error) {
    console.error('Error creating OL geometry:', error);
    return null;
  }
}

/**
 * OpenLayers Geometry를 GeoJSON으로 변환
 */
export function geometryToGeoJSON(geometry: Geometry): any {
  try {
    if (!geometry) return null;

    const geojson = geometry.transform('EPSG:3857', 'EPSG:4326');
    return {
      type: geojson.getType(),
      coordinates: geojson.getCoordinates()
    };
  } catch (error) {
    console.error('Error converting geometry to GeoJSON:', error);
    return null;
  }
}

/**
 * 좌표 변환 (EPSG:3857 -> EPSG:4326)
 */
export function transformCoordinates(coordinates: number[]): number[] {
  try {
    // 간단한 좌표 변환 (실제로는 proj4js 등을 사용해야 함)
    const x = coordinates[0] / 20037508.34 * 180;
    const y = Math.atan(Math.exp(coordinates[1] * Math.PI / 20037508.34)) * 2 - Math.PI / 2;
    return [x, y * 180 / Math.PI];
  } catch (error) {
    console.error('Error transforming coordinates:', error);
    return coordinates;
  }
}

/**
 * 폴리곤 좌표 유효성 검사
 */
export function validatePolygonCoordinates(coordinates: number[][]): boolean {
  if (!coordinates || coordinates.length < 3) {
    return false;
  }

  // 첫 번째 점과 마지막 점이 같은지 확인 (폴리곤은 닫혀있어야 함)
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return false;
  }

  return true;
}

/**
 * 라인 좌표 유효성 검사
 */
export function validateLineCoordinates(coordinates: number[][]): boolean {
  if (!coordinates || coordinates.length < 2) {
    return false;
  }

  return true;
}

/**
 * 포인트 좌표 유효성 검사
 */
export function validatePointCoordinates(coordinates: number[]): boolean {
  if (!coordinates || coordinates.length !== 2) {
    return false;
  }

  const [x, y] = coordinates;
  return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
}

/**
 * 지오메트리 타입별 좌표 검증
 */
export function validateGeometryCoordinates(geometry: any): boolean {
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return false;
  }

  switch (geometry.type) {
    case 'Point':
      return validatePointCoordinates(geometry.coordinates);
    case 'LineString':
      return validateLineCoordinates(geometry.coordinates);
    case 'Polygon':
      return validatePolygonCoordinates(geometry.coordinates[0]);
    default:
      return false;
  }
}

/**
 * 좌표 배열을 문자열로 변환 (디버깅용)
 */
export function coordinatesToString(coordinates: number[] | number[][]): string {
  if (!coordinates) return 'null';
  
  if (Array.isArray(coordinates[0])) {
    return (coordinates as number[][]).map(coord => `[${coord.join(', ')}]`).join(', ');
  } else {
    return `[${(coordinates as number[]).join(', ')}]`;
  }
}

/**
 * 지오메트리 정보 로깅 (디버깅용)
 */
export function logGeometryInfo(geometry: any, label: string = 'Geometry'): void {
  console.log(`${label} Info:`, {
    type: geometry?.type,
    coordinates: geometry?.coordinates ? coordinatesToString(geometry.coordinates) : 'null',
    isValid: validateGeometryCoordinates(geometry)
  });
} 