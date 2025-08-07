import { includes } from 'lodash';
/* eslint-disable react-hooks/exhaustive-deps */
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import { Collection, Feature } from 'ol';
import { Geometry, MultiPoint } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { doubleClick, never } from 'ol/events/condition';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { useMapbase } from '~/store/useMapbase';
import LayerGroup from 'ol/layer/Group';
import { getCircleStyle } from '~/assets/OpenLayer/utils/stylesFeature';

interface TrailDrawParams {
  onEndDraw?: () => void;
}

export const useTrailDraw = ({ onEndDraw }: TrailDrawParams) => {
  const vectorSource = useRef(new VectorSource());
  const { map, drawMode, setMode } = useMapbase();
  const [featureEdit, setFeatureEdit] = useState<Feature<Geometry> | null>(null);

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'trail-draw-line');
    if (layers) {
      map?.removeLayer(layers);
    }
    const trailDrawLayer = new VectorLayer({
      source: vectorSource.current,
    });
    const layerGroup = new LayerGroup({
      layers: [trailDrawLayer],
    });
    layerGroup.set('id', 'trail-draw-line');
    map?.addLayer(layerGroup);
    vectorSource.current.clear();
  };

  useEffect(() => {
    if (!!featureEdit && drawMode?.options?.geoType === 'LineString') {
      const collection = new Collection([featureEdit]);
      const modify = new Modify({
        source: vectorSource.current,
        deleteCondition: doubleClick,
        features: collection,
      });
      map?.addInteraction(modify);
      return () => {
        map?.removeInteraction(modify);
      };
    }
  }, [featureEdit, drawMode]);

  const startDraw = () => {
    const interactions = map
      ?.getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          !includes(['circle-selection', 'rect-selection', 'polygon-selection'], interaction.get('id')),
      );

    interactions?.forEach(inter => map?.removeInteraction(inter));

    addLayer();

    const drawInteraction = new Draw({
      source: vectorSource.current,
      type: 'LineString',
      style: new Style({
        stroke: new Stroke({ color: 'blue', width: 2, lineDash: [5, 5] }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
        }),
      }),
      freehandCondition: never,
    });

    drawInteraction.on('drawend', event => {
      setFeatureEdit(event.feature);
      event.feature.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2,
          }),
        }),
      ]);
      event.feature.set('mode', 'trail-draw-line');
      onEndDraw?.();
      setMode('draw-end');
    });

    drawInteraction.set('id', 'trail-draw-line');
    map?.addInteraction(drawInteraction);
  };

  return {
    startDraw,
  };
};

export const useTrailDrawPolygon = ({ onEndDraw }: TrailDrawParams) => {
  const vectorSource = useRef(new VectorSource());
  const { map, setMode } = useMapbase();

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'trail-draw-polygon');
    if (layers) {
      map?.removeLayer(layers);
    }
    const trailDrawLayer = new VectorLayer({
      source: vectorSource.current,
    });
    const layerGroup = new LayerGroup({
      layers: [trailDrawLayer],
    });
    layerGroup.set('id', 'trail-draw-polygon');
    map?.addLayer(layerGroup);
    vectorSource.current.clear();
  };

  const startDraw = () => {
    const interactions = map
      ?.getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          !includes(['circle-selection', 'rect-selection', 'polygon-selection'], interaction.get('id')),
      );

    interactions?.forEach(inter => map?.removeInteraction(inter));

    addLayer();

    const drawInteraction = new Draw({
      source: vectorSource.current,
      type: 'Polygon',
      style: new Style({
        stroke: new Stroke({ color: 'green', width: 2, lineDash: [5, 5] }),
        fill: new Fill({ color: 'rgba(0, 255, 0, 0.1)' }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
        }),
      }),
      freehandCondition: never,
    });

    drawInteraction.on('drawend', event => {
      event.feature.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        }),
        new Style({
          stroke: new Stroke({
            color: 'green',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(0, 255, 0, 0.1)',
          }),
        }),
      ]);
      event.feature.set('mode', 'trail-draw-polygon');
      onEndDraw?.();
      setMode('draw-end');
    });

    drawInteraction.set('id', 'trail-draw-polygon');
    map?.addInteraction(drawInteraction);
  };

  return {
    startDraw,
  };
};

export const useTrailDrawPoint = ({ onEndDraw }: TrailDrawParams) => {
  const vectorSource = useRef(new VectorSource());
  const { map, setMode } = useMapbase();

  const addLayer = () => {
    const layers = map
      ?.getLayers()
      .getArray()
      .find(item => item.get('id') === 'trail-draw-point');
    if (layers) {
      map?.removeLayer(layers);
    }
    const trailDrawLayer = new VectorLayer({
      source: vectorSource.current,
    });
    const layerGroup = new LayerGroup({
      layers: [trailDrawLayer],
    });
    layerGroup.set('id', 'trail-draw-point');
    map?.addLayer(layerGroup);
    vectorSource.current.clear();
  };

  const startDraw = () => {
    const interactions = map
      ?.getInteractions()
      .getArray()
      .filter(
        interaction =>
          interaction instanceof Draw &&
          !includes(['circle-selection', 'rect-selection', 'polygon-selection'], interaction.get('id')),
      );

    interactions?.forEach(inter => map?.removeInteraction(inter));

    addLayer();

    const drawInteraction = new Draw({
      source: vectorSource.current,
      type: 'Point',
      style: getCircleStyle(),
      freehandCondition: never,
    });

    drawInteraction.on('drawend', event => {
      event.feature.setStyle(getCircleStyle());
      event.feature.set('mode', 'trail-draw-point');
      onEndDraw?.();
      setMode('draw-end');
    });

    drawInteraction.set('id', 'trail-draw-point');
    map?.addInteraction(drawInteraction);
  };

  return {
    startDraw,
  };
}; 