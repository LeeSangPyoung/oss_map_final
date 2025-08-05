// Drawing 패키지 - TrailDrawingService
// 담당 기능:
// - trailDrawLine (트레일 선 그리기)
// - trailDrawPoint (트레일 점 그리기)
// - trailDrawPolygon (트레일 다각형 그리기)

import { Map } from 'ol';

export class TrailDrawingService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 트레일 그리기 관련 메서드들 구현
} 