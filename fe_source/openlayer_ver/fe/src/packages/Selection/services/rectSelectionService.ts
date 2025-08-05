// Selection 패키지 - RectSelectionService
// 담당 기능:
// - rectSelection (사각형 선택)

import { Map } from 'ol';

export class RectSelectionService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 사각형 선택 관련 메서드들 구현
} 