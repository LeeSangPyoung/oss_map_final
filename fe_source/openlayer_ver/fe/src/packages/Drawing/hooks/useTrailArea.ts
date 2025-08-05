/* eslint-disable @typescript-eslint/no-use-before-define */
import { useRef } from 'react';
import { DrawMapParams } from '~/packages/OpenLayer/models/DrawMap';
import { Draw } from 'ol/interaction';
import { Point, Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { formatArea } from '~/packages/OpenLayer/utils/common';
import { never } from 'ol/events/condition';
import VectorSource from 'ol/source/Vector';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { getCircleStyle, getLabelStyle, getPolygonStyle } from '~/packages/OpenLayer/utils/stylesFeature';
import { includes } from 'lodash';
import { useMapbase } from '~/store/useMapbase';

export const useTrailArea = ({ onEndDraw }: DrawMapParams) => {
  const trailAreaSource = useRef(new VectorSource());
  const { map, setMode } = useMapbase();

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'trail-area');
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
    layerGroup.set('id', 'trail-area');
    map?.addLayer(layerGroup);
    trailAreaSource.current.clear();
  };

  const startDrawing = (isContinuous = false) => {
    const interactions = map
      ?.getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          !includes(['circle-selection', 'rect-selection', 'polygon-selection'], interaction.get('id')),
      );
    interactions?.forEach(inter => map?.removeInteraction(inter));
    
    // 연속 측정이 아닌 경우에만 레이어를 새로 생성
    if (!isContinuous) {
      addLayer();
    }

    const drawInteraction = new Draw({
      source: trailAreaSource.current,
      type: 'Polygon',
      style: getPolygonStyle(),
      freehand: false,
      freehandCondition: never,
      minPoints: 4,
    });
    map?.addInteraction(drawInteraction);
    drawInteraction.on('drawend', event => {
      const newFeature = event.feature;
      // @ts-ignore
      const parentId = `polygon-${newFeature.ol_uid}`;
      newFeature.setId(parentId);
      newFeature.set('mode', 'trail-area');
      const geometry = newFeature.getGeometry() as Polygon;
      const SArea = geometry ? formatArea(geometry) : '0 m2';
      const coordinates = geometry.getCoordinates()[0];
      coordinates.forEach((coord, index) => {
        const pointFeature = new Feature(new Point(coord));

        if (index === coordinates.length - 2) {
          pointFeature.setStyle([getCircleStyle(), getLabelStyle(SArea)]);
        } else {
          pointFeature.setStyle(getCircleStyle());
        }
        pointFeature.set('parentId', parentId);
        pointFeature.set('mode', 'trail-area');
        trailAreaSource.current.addFeature(pointFeature);
        onEndDraw?.();
      });
      // setMode('draw-end'); // 연속 측정을 위해 제거

      map?.removeInteraction(drawInteraction);
    });
  };

  return {
    startDrawing,
  };
};

// Trail Area 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailAreaMode = (map: any) => {
  if (!map) return;
  
  useMapbase.getState().setMode('trail-area');
}; 