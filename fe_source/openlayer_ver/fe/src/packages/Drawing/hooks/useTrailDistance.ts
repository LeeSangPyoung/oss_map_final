/* eslint-disable @typescript-eslint/no-use-before-define */
import { useRef, useState } from 'react';
import { DrawMapParams } from '~/packages/OpenLayer/models/DrawMap';
import { Draw } from 'ol/interaction';
import { LineString, Point } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { Feature } from 'ol';
import { includes } from 'lodash';
import { formatLength2 } from '~/packages/OpenLayer/utils/common';
import { never } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import LayerGroup from 'ol/layer/Group';
import { getCircleStyle, lineStringStyle, lineStringStyleActive, getLabelStyle } from '~/packages/OpenLayer/utils/stylesFeature';
import { useMapbase } from '~/store/useMapbase';

export const useTrailDistance = ({ onEndDraw }: DrawMapParams) => {
  const { map, setMode } = useMapbase();
  const [_draw, setDraw] = useState<Draw | null>(null);
  const trailDistanceSource = useRef(new VectorSource());
  const vertexCircleSource = useRef(new VectorSource());
  const vectorCircleLayerRef = useRef(
    new VectorLayer({
      source: vertexCircleSource.current,
      style: getCircleStyle(),
    }),
  );
  const isLayerAdded = useRef(false);

  const addLabelsToPoints = (coordinates: Coordinate[], parentId: string) => {
    let totalDistance = 0;

    coordinates.forEach((coord, index) => {
      if (index > 0) {
        const segment = new LineString([coordinates[index - 1], coord]);
        const segmentLength = getLength(segment);
        totalDistance += segmentLength;
      }

      const pointFeature = new Feature({
        geometry: new Point(coord),
        name: formatLength2(totalDistance),
      });
      pointFeature.setStyle([getCircleStyle(), getLabelStyle(pointFeature.get('name'))]);
      pointFeature.set('parentId', parentId);
      pointFeature.set('mode', 'trail-distance');
      vertexCircleSource.current?.addFeature(pointFeature);
    });
  };

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'trail-distance');
    if (layers) {
      map?.removeLayer(layers);
    }
    const layerGroup = new LayerGroup({
      layers: [
        new VectorLayer({
          source: trailDistanceSource.current,
        }),
        vectorCircleLayerRef.current,
      ],
    });
    layerGroup.set('id', 'trail-distance');
    map?.addLayer(layerGroup);
    isLayerAdded.current = true;
  };

  const startDrawing = (isContinuous = false) => {
    if (!map) {
      return;
    }
    
    // 연속 측정이 아닌 경우에만 레이어를 새로 생성
    if (!isContinuous) {
      addLayer();
      vertexCircleSource.current.clear();
      trailDistanceSource.current.clear();
    }
    
    const interactions = map
      ?.getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          !includes(['circle-selection', 'rect-selection', 'polygon-selection'], interaction.get('id')),
      );

    interactions?.forEach(inter => map?.removeInteraction(inter));
    
    const drawInteraction = new Draw({
      source: trailDistanceSource.current,
      type: 'LineString',
      style: lineStringStyle,
      freehandCondition: never,
    });

    map.addInteraction(drawInteraction);
    setDraw(drawInteraction);

    drawInteraction.on('drawend', event => {
      const lineFeature = event.feature;
      // @ts-ignore
      const coordinates = lineFeature?.getGeometry()?.getCoordinates();
      // @ts-ignore
      const parentId = `line-${lineFeature.ol_uid}`;
      event.feature.setId(parentId);
      event.feature.set('mode', 'trail-distance');
      event.feature.setStyle(lineStringStyleActive);
      addLabelsToPoints(coordinates, parentId);
      map?.removeInteraction(drawInteraction);
      setDraw(null);
      // setMode('draw-end'); // 연속 측정을 위해 제거
      onEndDraw?.();
    });
  };

  return {
    startDrawing,
  };
};

// Trail Distance 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailDistanceMode = (map: any) => {
  if (!map) return;
  
  useMapbase.getState().setMode('trail-distance');
}; 