// UserLayer 패키지 샘플 코드들

export const addUserLayerSample = `// 사용자 레이어에 피처 추가
import { useUserLayer } from '~/packages/UserLayer';

const { addUserLayer } = useUserLayer();

const result = await addUserLayer({
  layerName: 'TEST_USER_LAYER',
  features: [
    {
      geometry: { type: 'Point', coordinates: [127.062289345605, 37.5087805938127] },
      style: { id: 'nodeBusinessPlan' },
    },
    {
      geometry: { type: 'LineString', coordinates: [[127.062289345605, 37.5087805938127], [127.045617, 37.495418]] },
      style: { id: 'linkSafeWayHome' },
    },
  ]
});

if (result.success) {
  alert('TEST_USER_LAYER에 피처가 추가되었습니다.\\n- Point: nodeBusinessPlan 스타일\\n- LineString: linkSafeWayHome 스타일');
} else {
  alert('사용자 레이어를 생성할 수 없습니다.');
}`;

export const initUserLayerSample = `// 사용자 레이어 초기화 (모든 피처 제거)
import { useUserLayer } from '~/packages/UserLayer';

const { initUserLayer } = useUserLayer();

const result = await initUserLayer({
  layerName: 'TEST_USER_LAYER'
});

if (result.success) {
  alert('TEST_USER_LAYER가 초기화되었습니다.\\n모든 피처가 제거되었습니다.');
} else {
  alert('TEST_USER_LAYER가 존재하지 않습니다.');
}`;

export const deleteUserLayerSample = `// 사용자 레이어 삭제
import { useUserLayer } from '~/packages/UserLayer';

const { deleteUserLayer } = useUserLayer();

const result = await deleteUserLayer({
  layerName: 'TEST_USER_LAYER'
});

if (result.success) {
  alert('TEST_USER_LAYER가 삭제되었습니다.');
} else {
  alert('TEST_USER_LAYER가 존재하지 않습니다.');
}`;

export const entireAreaUserLayerSample = `// 사용자 레이어 전체 영역으로 이동
import { useMapbase } from '~/store/useMapbase';

const layer = useMapbase.getState().getCustomLayerByName('TEST_USER_LAYER');
if (!layer) {
  alert('TEST_USER_LAYER가 존재하지 않습니다.');
  return;
}

const bounds = layer.getBounds();
if (bounds && bounds.length === 4) {
  useMapbase.getState().fitBounds({
    min: [bounds[0], bounds[1]],
    max: [bounds[2], bounds[3]],
  });
  
  setTimeout(() => {
    alert('TEST_USER_LAYER의 전체 영역으로 이동했습니다.');
  }, 1000);
} else {
  alert('TEST_USER_LAYER의 영역을 계산할 수 없습니다.');
}`; 