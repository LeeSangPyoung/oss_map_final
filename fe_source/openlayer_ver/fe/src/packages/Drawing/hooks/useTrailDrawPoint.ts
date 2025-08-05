// Drawing 패키지 - useTrailDrawPoint Hook
// 담당 기능: 점 그리기

import { useCallback, useRef, useEffect } from 'react';
import { TrailDrawPointService, TrailDrawPointCallbacks } from '../services/trailDrawPointService';
import { useMapbase } from "../../../store/useMapbase";

export const useTrailDrawPoint = () => {
  const { map } = useMapbase();
  const serviceRef = useRef<TrailDrawPointService | null>(null);

  // 서비스 초기화
  useEffect(() => {
    if (!map) {
      return;
    }

    serviceRef.current = new TrailDrawPointService(map);

    return () => {
      if (serviceRef.current) {
        serviceRef.current.cleanup();
        serviceRef.current = null;
      }
    };
  }, [map]);

  const activateTrailDrawPointMode = useCallback((callbacks: TrailDrawPointCallbacks) => {
    if (serviceRef.current) {
      return serviceRef.current.activateTrailDrawPointMode(callbacks);
    }
    return false;
  }, []);

  return {
    activateTrailDrawPointMode
  };
};

// Trail Draw Point 모드 활성화 함수 (MainPage에서 사용)
export const activateTrailDrawPointMode = (callbacks: TrailDrawPointCallbacks) => {
  const { map } = useMapbase.getState();
  if (!map) {
    console.error('Map is not available');
    return false;
  }
  
  // 기존 서비스 인스턴스 정리
  TrailDrawPointService.cleanupAll();
  
  const trailDrawPointService = new TrailDrawPointService(map);
  return trailDrawPointService.activateTrailDrawPointMode(callbacks);
}; 