import React, { useRef, useState } from 'react';
import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { never } from 'ol/events/condition';
import { useMapbase } from '~/store/useMapbase';

export interface AreaDrawOptions {
  mode: 'rect' | 'circle' | 'polygon';
  style?: {
    color: string;
    weight: number;
    fill: boolean;
    fillColor: string;
    fillOpacity: number;
  };
}

interface Props {
  onEndDraw?: () => void;
}

// hexToRgb 유틸리티 함수
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

export const useAreaDraw = ({ onEndDraw }: Props) => {
  const [_mode, setMode] = useState<string | undefined>(undefined);
  const drawInteraction = useRef<Draw | null>(null);
  const vectorSource = useRef(new VectorSource());
  const mapStore = useMapbase();

  const createStyleArea = (options: AreaDrawOptions) => {
    return new Style({
      stroke: new Stroke({
        color: options?.style?.color || '#ff0000',
        width: options?.style?.weight || 4,
        lineDash: [5, 5],
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: 'red',
        }),
      }),
      fill: options?.style?.fill
        ? new Fill({
            color: `rgba(${hexToRgb(options?.style?.fillColor || '#0000ff')}, ${options?.style.fillOpacity || 0.4})`,
          })
        : undefined,
    });
  };

  const addLayer = () => {
    const map = mapStore.map;
    if (!map) return;

    // 기존 area-draw 레이어 제거
    const existingLayers = map.getLayers().getArray();
    const existingLayer = existingLayers.find((item: any) => item.get('id') === 'area-draw');
    if (existingLayer) {
      map.removeLayer(existingLayer);
    }

    // 새 레이어 그룹 생성
    const layerGroup = new LayerGroup({
      layers: [
        new VectorLayer({
          source: vectorSource.current,
        }),
      ],
    });
    layerGroup.set('id', 'area-draw');
    map.addLayer(layerGroup);
    vectorSource.current.clear();

    // 기존 Draw 인터랙션 제거 (Selection 관련 제외)
    const interactions = map.getInteractions().getArray();
    interactions.forEach((item: any) => {
      if (
        item instanceof Draw &&
        !['circle-selection', 'rect-selection', 'polygon-selection'].includes(item.get('id'))
      ) {
        map.removeInteraction(item);
      }
    });
  };

  const startDraw = (options: AreaDrawOptions) => {
    const map = mapStore.map;
    if (!map) return;

    setMode(options.mode);
    const geometryFunction = options?.mode === 'rect' ? createBox() : undefined;
    addLayer();

    const draw = new Draw({
      type: options?.mode === 'polygon' ? 'Polygon' : 'Circle',
      source: vectorSource.current,
      geometryFunction: geometryFunction,
      style: createStyleArea(options),
      freehandCondition: never,
    });

    draw.set('id', 'interaction-area-draw');
    draw.on('drawend', event => {
      map.removeInteraction(draw);
      drawInteraction.current = null;
      event.feature.set('mode', `${options.mode}-area-draw`);
      event.feature.setStyle(createStyleArea(options));
      onEndDraw?.();
      mapStore.setMode('draw-end');
    });

    map.addInteraction(draw);
    drawInteraction.current = draw;
  };

  return {
    startDraw,
  };
}; 