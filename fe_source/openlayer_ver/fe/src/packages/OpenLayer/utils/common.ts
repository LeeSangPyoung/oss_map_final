import { LineString, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere.js';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

export const formatLength = function (line: LineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

export const formatLength2 = (total: number) => {
  let output = 'Total distance: ';
  if (total > 100) {
    output += Math.round((total / 1000) * 100) / 100 + ' km';
  } else {
    output += Math.round(total * 100) / 100 + ' m';
  }
  return output;
};

export const formatArea = function (polygon: Polygon) {
  const area = getArea(polygon);
  return `${area.toFixed(2)} m2`;
};

interface StyleOptions {
  opacity?: number;
  color?: string;
  weight?: number;
  dashArray?: string;
  fillColor?: string;
  radius?: number;
  lineColor?: string;
}

export function createStyle(type: 'LINE' | 'POINT' | 'POLYGON', options: StyleOptions): Style {
  const { color, weight, dashArray, fillColor, radius = 5, lineColor } = options;

  switch (type) {
    case 'LINE':
      return new Style({
        stroke: new Stroke({
          color: lineColor,
          width: weight,
          // lineDash: !!dashArray ? dashArray?.split(',').map(Number) : [0, 0],
        }),
        fill: new Fill({
          color: color,
        }),
      });

    case 'POINT':
      return new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: color }),
          stroke: new Stroke({ color, width: weight }),
        }),
      });

    case 'POLYGON':
      return new Style({
        stroke: new Stroke({
          color,
          width: weight,
          // lineDash: dashArray.split(',').map(Number),
        }),
        fill: new Fill({
          color: fillColor,
        }),
      });
    default:
      console.warn(`Style type ${type} không được hỗ trợ.`);
      return new Style();
  }
}

export const generateSegmentsFromPolygon = (polygon: [number, number][][]): [number, number][][] => {
  const outerRing = polygon[0]; // 외곽 링만 처리
  const segments: [number, number][][] = [];

  for (let i = 0; i < outerRing.length - 1; i++) {
    segments.push([outerRing[i], outerRing[i + 1]]);
  }
  return segments;
};

export const calculateDistanceToSegment = (point: [number, number], segment: [number, number][]): number => {
  const [x, y] = point;
  const [[x1, y1], [x2, y2]] = segment;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    // 선분의 시작점과 끝점이 동일한 경우
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
  }

  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));

  const closestPoint: [number, number] = [x1 + t * dx, y1 + t * dy];
  return Math.sqrt((x - closestPoint[0]) ** 2 + (y - closestPoint[1]) ** 2);
};

export const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
  const dx = coord2[0] - coord1[0];
  const dy = coord2[1] - coord1[1];
  return Math.sqrt(dx * dx + dy * dy);
};
