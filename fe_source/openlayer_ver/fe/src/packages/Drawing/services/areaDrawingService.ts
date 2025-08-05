// Drawing 패키지 - AreaDrawingService
// 담당 기능:
// - areaDrawRect (영역 사각형 그리기)
// - areaDrawCircle (영역 원 그리기)
// - areaDrawPolygon (영역 다각형 그리기)

import { Map } from 'ol';

export class AreaDrawingService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 영역 그리기 관련 메서드들 구현
} 