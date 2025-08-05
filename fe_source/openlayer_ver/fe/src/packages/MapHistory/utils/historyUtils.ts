import { Map } from 'ol';
import { MapViewState } from '../types';

export const captureMapState = (map: Map): MapViewState => {
  const view = map.getView();
  const center = view.getCenter();
  const zoom = view.getZoom();
  const rotation = view.getRotation();
  const extent = view.calculateExtent(map.getSize());

  return {
    center: (center as [number, number]) || [0, 0],
    zoom: zoom || 0,
    rotation: rotation || 0,
    extent: extent as [number, number, number, number],
  };
};

export const restoreMapState = (map: Map, state: MapViewState, animationDuration: number = 0): void => {
  const view = map.getView();
  
  if (animationDuration > 0) {
    // 애니메이션으로 상태 복원
    const animationOptions: any = {};
    
    if (state.center) {
      animationOptions.center = state.center;
    }
    
    if (state.zoom !== undefined) {
      animationOptions.zoom = state.zoom;
    }
    
    if (state.rotation !== undefined) {
      animationOptions.rotation = state.rotation;
    }
    
    animationOptions.duration = animationDuration;
    view.animate(animationOptions);
  } else {
    // 즉시 상태 복원
    if (state.center) {
      view.setCenter(state.center);
    }
    
    if (state.zoom !== undefined) {
      view.setZoom(state.zoom);
    }
    
    if (state.rotation !== undefined) {
      view.setRotation(state.rotation);
    }
  }
};

export const isStateEqual = (state1: MapViewState, state2: MapViewState): boolean => {
  return (
    state1.center[0] === state2.center[0] &&
    state1.center[1] === state2.center[1] &&
    state1.zoom === state2.zoom &&
    state1.rotation === state2.rotation
  );
};

export const limitHistorySize = <T>(array: T[], maxSize: number): T[] => {
  if (array.length <= maxSize) {
    return array;
  }
  return array.slice(-maxSize);
}; 