// Selection 패키지 샘플 코드들

export const selectSample = `// Select 모드 활성화
import { activateSelectMode } from '~/packages/Selection';

// map 객체가 필요합니다
activateSelectMode(map);
alert('Select 모드가 활성화되었습니다.\\n지도에서 피처를 클릭하여 선택할 수 있습니다.');`;

export const advancedSelectSample = `// Advanced Select 모드 활성화
import { activateAdvancedSelectMode } from '~/packages/Selection';

// map 객체가 필요합니다
activateAdvancedSelectMode(map);
alert('Advanced Select 모드가 활성화되었습니다.\\n지도에서 피처를 클릭하여 선택할 수 있습니다.');`;

export const rectSelectionSample = `// Rect Selection 모드 활성화
import { activateRectSelectionMode } from '~/packages/Selection';

// map 객체가 필요합니다
activateRectSelectionMode(map);
alert('Rect Selection 모드가 활성화되었습니다.\\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');`;

export const circleSelectionSample = `// Circle Selection 모드 활성화
import { activateCircleSelectionMode } from '~/packages/Selection';

// map 객체가 필요합니다
activateCircleSelectionMode(map);
alert('Circle Selection 모드가 활성화되었습니다.\\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');`;

export const polygonSelectionSample = `// Polygon Selection 모드 활성화
import { activatePolygonSelectionMode } from '~/packages/Selection';

// map 객체가 필요합니다
activatePolygonSelectionMode(map);
alert('Polygon Selection 모드가 활성화되었습니다.\\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\\n더블클릭으로 그리기를 완료하세요.');`;

export const clearSelectLayerSample = `// 선택된 피처들 초기화
import { clearSelectLayer } from '~/packages/Selection';
clearSelectLayer();
alert('선택된 피처들이 초기화되었습니다.');`;

export const getSelectedFeaturesSample = `// 선택된 피처들 가져오기
import { getSelectedFeatures } from '~/packages/Selection';
const result = getSelectedFeatures();
if (result.success) {
  if (result.count > 0) {
    console.log('선택된 피처들:', result.features);
    alert(JSON.stringify(result.features, null, 2));
  } else {
    alert('선택된 피처가 없습니다.');
  }
} else {
  alert('오류 발생: ' + result.message);
}`; 