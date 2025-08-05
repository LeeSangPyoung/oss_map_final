// LayerManagement 패키지 샘플 코드들

export const getLayerSample = `// 레이어 정보 가져오기
import { useLayerInfo } from '~/packages/LayerManagement';

const { getLayer } = useLayerInfo();
const result = await getLayer('polygonHump');

if (result.success) {
  console.log('레이어 정보:', result.layerInfo);
  alert(result.message);
} else {
  alert('레이어 정보 조회 실패: ' + result.message);
}`;

export const getExternalLayerNameSample = `// 외부 레이어명 가져오기
import { useLayerInfo } from '~/packages/LayerManagement';

const { getExternalLayerName } = useLayerInfo();
const result = await getExternalLayerName('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('외부 레이어명 조회 실패: ' + result.message);
}`;

export const getTableNameOfLayerSample = `// 레이어 테이블명 가져오기
import { useLayerInfo } from '~/packages/LayerManagement';

const { getTableNameOfLayer } = useLayerInfo();
const result = await getTableNameOfLayer('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('테이블명 조회 실패: ' + result.message);
}`;

export const getMinDisplayZoomLevelSample = `// 레이어 최소 표시 줌 레벨 가져오기
import { useLayerZoom } from '~/packages/LayerManagement';

const { getMinDisplayZoomLevel } = useLayerZoom();
const result = await getMinDisplayZoomLevel('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('최소 줌 레벨 조회 실패: ' + result.message);
}`;

export const getMaxDisplayZoomLevelSample = `// 레이어 최대 표시 줌 레벨 가져오기
import { useLayerZoom } from '~/packages/LayerManagement';

const { getMaxDisplayZoomLevel } = useLayerZoom();
const result = await getMaxDisplayZoomLevel('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('최대 줌 레벨 조회 실패: ' + result.message);
}`;

export const getSelectableFacilitySample = `// 선택 가능한 시설 여부 가져오기
import { useLayerControl } from '~/packages/LayerManagement';

const { getSelectableFacility } = useLayerControl();
const result = await getSelectableFacility('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('선택 가능 여부 조회 실패: ' + result.message);
}`;

export const viewLayerInfoSample = `// 레이어 정보 보기
import { useLayerControl } from '~/packages/LayerManagement';

const { viewLayerInfo } = useLayerControl();
const result = await viewLayerInfo('polygonHump');

if (result.success) {
  console.log('레이어 정보:', result.layerInfo);
  alert(result.message);
} else {
  alert('레이어 정보 조회 실패: ' + result.message);
}`;

export const toggleDisplayHideSample = `// 레이어 표시/숨김 토글
import { useLayerControl } from '~/packages/LayerManagement';

const { toggleDisplayHide } = useLayerControl();
const result = await toggleDisplayHide('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 표시 상태 변경 실패: ' + result.message);
}`;

export const refreshLayerSample = `// 레이어 새로고침
import { useLayerControl } from '~/packages/LayerManagement';

const { refreshLayer } = useLayerControl();
const result = await refreshLayer('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 새로고침 실패: ' + result.message);
}`; 