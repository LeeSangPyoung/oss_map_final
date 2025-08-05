// Selection 패키지 - PolygonSelectionService
// 담당 기능:
// - polygonSelection (다각형 선택)

import { Map } from 'ol';

export class PolygonSelectionService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 다각형 선택 관련 메서드들 구현
} 