// Drawing 패키지 - AreaDrawRectService
// 담당 기능: 사각형 영역 그리기

import { Map } from 'ol';
import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { never } from 'ol/events/condition';
import { useMapbase } from '../../../store/useMapbase';

export interface AreaDrawRectOptions {
  style?: {
    color: string;
    weight: number;
    fill: boolean;
    fillColor: string;
    fillOpacity: number;
  };
}

// hexToRgb 유틸리티 함수
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

export class AreaDrawRectService {
  private map: Map | null;
  private drawInteraction: Draw | null = null;
  private vectorSource: VectorSource;

  constructor(map: Map | null) {
    this.map = map;
    this.vectorSource = new VectorSource();
  }

  // 사각형 영역 그리기 모드 활성화
  activateAreaDrawRectMode(options?: AreaDrawRectOptions): void {
    try {
      if (!this.map) {
        console.error('Map is not available');
        return;
      }

      this.addLayer();
      this.startDraw(options);
    } catch (error) {
      console.error('Area Draw Rect 모드 활성화 중 오류:', error);
      throw error;
    }
  }

  private createStyleArea(options?: AreaDrawRectOptions) {
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
  }

  private addLayer() {
    if (!this.map) return;

    // 기존 area-draw 레이어 제거
    const existingLayers = this.map.getLayers().getArray();
    const existingLayer = existingLayers.find((item: any) => item.get('id') === 'area-draw');
    if (existingLayer) {
      this.map.removeLayer(existingLayer);
    }

    // 새 레이어 그룹 생성
    const layerGroup = new LayerGroup({
      layers: [
        new VectorLayer({
          source: this.vectorSource,
        }),
      ],
    });
    layerGroup.set('id', 'area-draw');
    this.map.addLayer(layerGroup);
    this.vectorSource.clear();

    // 기존 Draw 인터랙션 제거 (Selection 관련 제외)
    const interactions = this.map.getInteractions().getArray();
    interactions.forEach((item: any) => {
      if (
        item instanceof Draw &&
        !['circle-selection', 'rect-selection', 'polygon-selection'].includes(item.get('id'))
      ) {
        this.map?.removeInteraction(item);
      }
    });
  }

  private startDraw(options?: AreaDrawRectOptions) {
    if (!this.map) return;

    const draw = new Draw({
      type: 'Circle', // createBox()를 사용하므로 Circle으로 설정
      source: this.vectorSource,
      geometryFunction: createBox(),
      style: this.createStyleArea(options),
      freehandCondition: never,
    });

    draw.set('id', 'interaction-area-draw');
    draw.on('drawend', event => {
      this.map?.removeInteraction(draw);
      this.drawInteraction = null;
      event.feature.set('mode', 'rect-area-draw');
      event.feature.setStyle(this.createStyleArea(options));
      useMapbase.getState().setMode('draw-end');
    });

    this.map.addInteraction(draw);
    this.drawInteraction = draw;
  }
} 