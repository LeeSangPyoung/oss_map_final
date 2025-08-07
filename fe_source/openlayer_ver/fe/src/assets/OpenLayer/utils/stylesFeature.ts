import { Feature } from 'ol';
import { MultiPoint, Point } from 'ol/geom';
import { Fill, RegularShape, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

export const updateFeatureStyle = (feature: Feature, snappedNodes: Set<string>) => {
  const geometry = feature.getGeometry();
  const coordinates = geometry?.getType() !== 'Point' ? geometry?.getCoordinates()[0] : geometry.getCoordinates();

  const styles = coordinates.map((coordinate: [number, number]) => {
    const isSnapped = snappedNodes.has(coordinate.toString());
    return new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: isSnapped ? 'blue' : 'red' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
      geometry: new Point(coordinate),
    });
  });

  // 경계선 스타일 추가
  styles.push(
    new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
    }),
  );

  feature.setStyle(styles);
  feature.changed();
  // mapRef.current?.render(); // 강제 렌더링
};

export const nodeStylesTrailEdit = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({ color: 'red' }), // 노드의 빨간 점
    stroke: new Stroke({ color: '#fff', width: 2 }),
  }),
  geometry: function (feature) {
    const coordinates = feature?.getGeometry()?.getCoordinates();
    if (!coordinates) {
      return null;
    }
    return new MultiPoint(Array.isArray(coordinates[0]) ? coordinates[0] : coordinates);
  },
});

export const boundaryStyle = new Style({
  stroke: new Stroke({
    color: 'blue', // 경계선의 파란색
    width: 3,
  }),
});

export const getCircleStyle = () =>
  new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: 'red' }),
      stroke: new Stroke({ color: 'white', width: 2 }),
    }),
  });

export const lineStringStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
  stroke: new Stroke({
    color: 'blue',
    width: 5,
    lineDash: [5, 10, 5, 10], // Nét đứt khi kéo
  }),
});

export const lineStringStyleActive = new Style({
  stroke: new Stroke({
    color: 'blue', // Màu nét liền sau khi vẽ
    width: 5,
    lineDash: [5, 10, 5, 10], // Nét liền
  }),
});
export const getLabelStyle = (label: string) =>
  new Style({
    text: new Text({
      font: '14px Calibri,sans-serif',
      text: label,
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [3, 3, 3, 3],
      textBaseline: 'bottom',
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
    }),
  });

export const getPolygonStyle = () => {
  return new Style({
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.4)',
      }),
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 2,
      lineDash: [10, 10], // Nét đứt khi kéo
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.1)',
    }),
  });
};

export const drawStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 2,
    lineDash: [5, 5], // Nét đứt
  }),
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)', // Nền trắng trong suốt
  }),
});
