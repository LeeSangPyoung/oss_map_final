// Drawing 패키지 샘플 코드들

export const trailDistanceSample = `// Trail Distance(거리 측정) 모드 활성화
import { activateTrailDistanceMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateTrailDistanceMode(map);
alert('Trail Distance(거리 측정) 모드가 활성화되었습니다.');`;

export const advancedTrailDistanceSample = `// Advanced Trail Distance(고급 거리 측정) 모드 활성화
import { activateAdvancedTrailDistanceMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateAdvancedTrailDistanceMode(map);
alert('Advanced Trail Distance(고급 거리 측정) 모드가 활성화되었습니다.');`;

export const advancedTrailAreaSample = `// Advanced Trail Area(고급 면적 측정) 모드 활성화
import { activateAdvancedTrailAreaMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateAdvancedTrailAreaMode(map);
alert('Advanced Trail Area(고급 면적 측정) 모드가 활성화되었습니다.');`;

export const trailAreaSample = `// Trail Area(면적 측정) 모드 활성화
import { activateTrailAreaMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateTrailAreaMode(map);
alert('Trail Area(면적 측정) 모드가 활성화되었습니다.');`;

export const trailSimpleSample = `// Trail Simple(간단한 선 그리기) 모드 활성화
import { activateTrailSimpleMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateTrailSimpleMode();
alert('Trail Simple(간단한 선 그리기) 모드가 활성화되었습니다.');`;

export const areaDrawRectSample = `// Area Draw Rect(사각형 영역 그리기) 모드 활성화
import { activateAreaDrawRectMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateAreaDrawRectMode({
  style: {
    color: 'red',
    fillColor: 'blue',
    weight: 4,
    fill: true,
    fillOpacity: 0.4,
  },
});
alert('Area Draw Rect(사각형 영역 그리기) 모드가 활성화되었습니다.');`;

export const areaDrawCircleSample = `// Area Draw Circle(원형 영역 그리기) 모드 활성화
import { activateAreaDrawCircleMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateAreaDrawCircleMode({
  style: {
    color: 'red',
    fillColor: 'blue',
    weight: 4,
    fill: true,
    fillOpacity: 0.4,
  },
});
alert('Area Draw Circle(원형 영역 그리기) 모드가 활성화되었습니다.');`;

export const areaDrawPolygonSample = `// Area Draw Polygon(다각형 영역 그리기) 모드 활성화
import { activateAreaDrawPolygonMode } from '~/assets/Drawing';

// map 객체가 필요합니다
activateAreaDrawPolygonMode({
  style: {
    color: 'red',
    fillColor: 'blue',
    weight: 4,
    fill: true,
    fillOpacity: 0.4,
  },
});
alert('Area Draw Polygon(다각형 영역 그리기) 모드가 활성화되었습니다.');`;

export const trailDrawPointSample = `// Trail Draw Point(점 그리기) 모드 활성화
import { activateTrailDrawPointMode } from '~/assets/Drawing';

// map 객체가 필요합니다
try {
  activateTrailDrawPointMode({
    showNodeTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 노드 타입 선택기 표시 로직
      console.log('노드 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('그린 피처 설정:', feature);
    }
  });
  alert('Trail Draw Point(점 그리기) 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Trail Draw Point 실행 중 오류:', error);
}`;

export const trailDrawLineSample = `// Trail Draw Line(선형 그리기) 모드 활성화
import { activateTrailDrawLineMode } from '~/assets/Drawing';

// map 객체가 필요합니다
try {
  activateTrailDrawLineMode({
    showLineTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 라인 타입 선택기 표시 로직
      console.log('라인 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('그린 피처 설정:', feature);
    }
  });
  alert('Trail Draw Line(선형 그리기) 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Trail Draw Line 실행 중 오류:', error);
}`;

export const advancedTrailDrawLineSample = `// Advanced Trail Draw Line(스냅 기능이 포함된 고급 선형 그리기) 모드 활성화
import { activateAdvancedTrailDrawLineMode } from '~/assets/Drawing';

// map 객체가 필요합니다
try {
  activateAdvancedTrailDrawLineMode({
    showLineTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 라인 타입 선택기 표시 로직
      console.log('Advanced 라인 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('Advanced 그린 피처 설정:', feature);
    }
  });
  alert('Advanced Trail Draw Line(스냅 기능이 포함된 고급 선형 그리기) 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Advanced Trail Draw Line 실행 중 오류:', error);
}`;

export const advancedTrailDrawPointSample = `// Advanced Trail Draw Point(스냅 기능이 포함된 고급 점 그리기) 모드 활성화
// map 객체가 필요합니다
try {
  const { activateAdvancedTrailDrawPointMode } = await import('~/assets/Drawing');
  await activateAdvancedTrailDrawPointMode({
    showNodeTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 노드 타입 선택기 표시 로직
      console.log('Advanced 노드 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('Advanced 그린 피처 설정:', feature);
    }
  });
  alert('Advanced Trail Draw Point(스냅 기능이 포함된 고급 점 그리기) 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Advanced Trail Draw Point 실행 중 오류:', error);
}`;

export const trailDrawPolygonSample = `// Trail Draw Polygon(다각형 그리기) 모드 활성화
import { activateTrailDrawPolygonMode } from '~/assets/Drawing';

// map 객체가 필요합니다
try {
  activateTrailDrawPolygonMode({
    showPolygonTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 폴리곤 타입 선택기 표시 로직
      console.log('폴리곤 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('그린 피처 설정:', feature);
    }
  });
  alert('Trail Draw Polygon(다각형 그리기) 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Trail Draw Polygon 실행 중 오류:', error);
}`;

export const advancedTrailDrawPolygonSample = `// Advanced Trail Draw Polygon(고급 다각형 그리기) 모드 활성화
// map 객체가 필요합니다
try {
  const { activateAdvancedTrailDrawPolygonMode } = await import('~/assets/Drawing/hooks/useAdvancedTrailDrawPolygon');
  await activateAdvancedTrailDrawPolygonMode({
    showPolygonTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
      // 폴리곤 타입 선택기 표시 로직
      console.log('Advanced 폴리곤 타입 선택기 표시:', coordinate, pixel);
    },
    setDrawnFeature: (feature: any) => {
      console.log('Advanced 그린 피처 설정:', feature);
    }
  });
  alert('Advanced Trail Draw Polygon 모드가 활성화되었습니다.');
} catch (error) {
  console.error('Advanced Trail Draw Polygon 실행 중 오류:', error);
  alert('실행 오류: ' + error);
}`;

export const getTrailCoordinateSample = `// Get Trail Coordinate(트레일 좌표 가져오기)
import { getTrailCoordinates } from '~/assets/Drawing';
const result = getTrailCoordinates();
if (result.success) {
  console.log('트레일 좌표들:', result.coordinates);
  alert(JSON.stringify(result.coordinates, null, 2));
} else {
  alert(result.message);
}`; 