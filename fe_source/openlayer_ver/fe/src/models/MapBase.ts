import { FeatureBase, LatLng } from './Coords';
import { CustomVectorTileLayer } from '~/packages/OpenLayer/utils/customTileLayer';
import { CustomVectorLayer } from '~/packages/OpenLayer/utils/customVectorLayer';
import { MenuItem } from './MenuItem';
import { Type } from 'ol/format/Feature';
import { ModeDraw, ModeOptions, ModeSelector } from './ModeDraw';
import { LayerStyles, StylesDraw } from './Styles';
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import { LayerModel } from './Layer';

export interface MapbaseOption {
  target?: string;
  mapOptions?: {
    center: number[];
    zoom: number;
  };
}
export interface MapBase<T> extends MapBaseMethod {
  map: T | null;
  layerData?: LayerModel[];
  createMap: (target?: string, options?: MapbaseOption['mapOptions']) => void;
  isRefresh?: boolean;
  defaultOptions?: MapbaseOption;
  setMap: (map: T) => void;
  layerById?: string;
  setLayerById?: (layer: CustomVectorTileLayer) => void;
  contextMenu?: MenuItem[];
  setDefaultContextMenu?: (items: MenuItem[]) => void;
  selectedFeatures: FeatureBase[];
  hoverFeature: FeatureBase | null;
  trailCoords: {
    type?: Type;
    coordinates: LatLng[];
  }[];
  drawMode?: {
    mode: ModeDraw;
    options?: ModeOptions;
  };
  selectorMode?: ModeSelector;
  customStyleDraw: StylesDraw[];
  editFeature?: FeatureBase;
  defaultStyles: LayerStyles[];
  isDrawing?: boolean;
}

export interface MapBaseMethod {
  getCenter: () => LatLng | null;
  getZoom: (type: 'min' | 'max' | 'current') => number;
  refresh: () => void;
  panTo: (coors: number[], zoom?: number) => void;
  fitBounds: (bounds: { min: [number, number]; max: [number, number] }) => void;
  historyAction?: 'back' | 'forward';
  onHistoryAction: (action: 'back' | 'forward') => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  getLayerById: (id: string) => Promise<CustomVectorTileLayer | undefined>;
  getCustomLayerByName: (name: string) => CustomVectorLayer | undefined;
  removeCustomLayerByName: (name: string) => void;
  addCustomLayerByName: (name: string) => CustomVectorLayer | undefined;
  setSelectedFeatures: (feature: FeatureBase[]) => void;
  setHoverFeature: (feature: FeatureBase | null) => void;
  getSelectedFeatures: () => FeatureBase[];
  isSelected?: (id: string) => boolean;
  clearSelectedFeatures?: () => void;
  getTrailCoordinates: () => { type?: Type; coordinates: LatLng[] }[];
  setTrailCoordinates: (coords: { type?: Type; coordinates: LatLng[] }[]) => void;
  setRefresh: () => void;
  setMode: (mode: ModeDraw, options?: ModeOptions) => void;
  setSelectorMode: (mode: ModeSelector) => void;
  setCustomStyles: (styles: StylesDraw[]) => void;
  getMap: () => Map | null;
  resetLayerById?: () => void;
  setLayerData: (data: LayerModel[]) => void;
  setDefaultStyles: (data: LayerStyles[]) => void;
  resetMapAll: () => void;
}

export interface MyMapRef extends Map {
  markerLayer?: VectorLayer[] | null;
  highlightedLineLayer?: VectorLayer[] | null;
}
