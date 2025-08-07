// Selection 패키지 - CircleSelectionService
// 담당 기능:
// - circleSelection (원형 선택)

import { Map } from 'ol';

export class CircleSelectionService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 원형 선택 관련 메서드들 구현
} 