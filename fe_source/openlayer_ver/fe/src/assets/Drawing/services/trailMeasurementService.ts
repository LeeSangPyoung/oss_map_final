// Drawing 패키지 - TrailMeasurementService
// 담당 기능:
// - trailDistance (트레일 거리 측정)
// - trailArea (트레일 면적 측정)
// - trailSimple (트레일 간단 측정)

import { Map } from 'ol';

export class TrailMeasurementService {
  private map: Map | null;

  constructor(map: Map | null) {
    this.map = map;
  }

  // TODO: 트레일 측정 관련 메서드들 구현
} 