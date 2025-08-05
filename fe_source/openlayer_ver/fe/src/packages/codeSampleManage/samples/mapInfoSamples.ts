// Map Info 패키지 샘플 코드들

export const copyViewSample = `// Copy View State (클립보드 복사)
import { useMapExport } from '~/packages/Navigation';

const { copyView } = useMapExport();
const result = copyView();

if (result.success) {
  alert('현재 지도 상태가 클립보드에 복사되었습니다.');
} else {
  console.error(result.message);
}`;

export const exportMapImageSample = `// Export Map as Image (지도 이미지 저장)
import { useMapExport } from '~/packages/Navigation';

const { exportMapImage } = useMapExport();
const result = exportMapImage();

if (result.success) {
  alert('지도 이미지가 다운로드되었습니다!');
} else {
  console.error(result.message);
}`;

export const selectableFacilitySample = `const layerId = 'polygonHump';
const layer = await useMapbase.getState().getLayerById(layerId);
let result = '=== 레이어 선택 가능 여부 ===\\n\\n';
if (layer && typeof layer.isSelectable === 'function') {
  const isSelectable = layer.isSelectable();
  result += layerId + ': ' + (isSelectable ? '✅ 선택 가능' : '❌ 선택 불가') + '\\n';
} else {
  result += layerId + ': ❓ 레이어를 찾을 수 없음\\n';
}
alert(result);`;

export const viewLayerInfoSample = `const layer = await useMapbase.getState().getLayerById('polygonHump');
if (layer) {
  const properties = layer.getProperties();
  alert(JSON.stringify(properties));
} else {
  alert('레이어를 찾을 수 없음');
}`;

export const setThematicsSample = `const layer = await useMapbase.getState().getLayerById('polygonHump');
if (layer) {
  // 테마틱 스타일 적용
  await layer.setThemematics({ customStyleName: 'polygon-thematics' });
  
  // 맵 새로고침으로 변경사항 강제 적용
  setTimeout(() => {
    map.updateSize();
    map.render();
  }, 500);
  
  alert('테마틱 스타일이 적용되었습니다!\\n레이어가 테마틱 스타일로 변경되었습니다.\\n변경사항이 보이지 않으면 줌을 조금 변경해보세요.');
} else {
  alert('레이어를 찾을 수 없습니다.');
}`;

// 지도 정보 관련 샘플 코드들

export const getScreenCenterPointSample = `// Get Screen Center Point
import { useMapInfo } from '~/packages/Navigation';

const { getCenter } = useMapInfo();
const result = getCenter();

if (result.success) {
  console.log('화면 중심점:', result.data);
  alert('화면 중심점: [' + result.data?.center?.join(', ') + ']\\n위도: ' + result.data?.lat + '\\n경도: ' + result.data?.lng);
} else {
  alert('화면 중심점 조회 실패: ' + result.message);
}`;

export const getCurrentZoomLevelSample = `// Get Current Zoom Level
import { useMapInfo } from '~/packages/Navigation';

const { getZoom } = useMapInfo();
const result = getZoom();

if (result.success) {
  console.log('줌 레벨:', result.data);
  alert('현재 줌 레벨: ' + result.data?.current + '\\n최소 줌: ' + result.data?.min + '\\n최대 줌: ' + result.data?.max);
} else {
  alert('줌 레벨 조회 실패: ' + result.message);
}`;

export const getMinZoomLevelSample = `// Get Minimum Zoom Level
import { useMapInfo } from '~/packages/Navigation';

const { getMinZoom } = useMapInfo();
const result = getMinZoom();

if (result.success) {
  alert('최소 줌 레벨: ' + result.data);
} else {
  alert('최소 줌 레벨 조회 실패: ' + result.message);
}`;

export const getMaxZoomLevelSample = `// Get Max Zoom Level
import { useMapInfo } from '~/packages/Navigation';

const { getMaxZoom } = useMapInfo();
const result = getMaxZoom();

if (result.success) {
  alert('최대 줌 레벨: ' + result.data);
} else {
  alert('최대 줌 레벨 조회 실패: ' + result.message);
}`;

// MapHistory 관련 샘플 코드들
export const prevScreenSample = `// Previous Screen - 이전 화면으로 이동
import { useMapHistory } from '~/packages/Navigation';

const { prevScreen } = useMapHistory();
const result = prevScreen();

if (result.success) {
  console.log('이전 화면으로 이동했습니다.');
} else {
  console.error(result.message);
}`;

export const forwardScreenSample = `// Forward Screen - 다음 화면으로 이동
import { useMapHistory } from '~/packages/Navigation';

const { forwardScreen } = useMapHistory();
const result = forwardScreen();

if (result.success) {
  console.log('다음 화면으로 이동했습니다.');
} else {
  console.error(result.message);
}`;

// 지도 이동 관련 샘플 코드들
export const moveCenterPointSample = `// Move Center Point
import { useMapPan } from '~/packages/Navigation';

const { panTo } = useMapPan();
const result = panTo({ center: [127.062289345605, 37.5087805938127], duration: 800 });

if (result.success) {
  console.log('지도 중심이 기본 중심점으로 이동했습니다.');
} else {
  console.error(result.message);
}`;

export const moveCenterPointAndChangeLevelSample = `// Move Center Point and Change Level
import { useMapPan } from '~/packages/Navigation';

const { panTo } = useMapPan();
const result = panTo({ center: [127.062289345605, 37.5087805938127], zoom: 10, duration: 800 });

if (result.success) {
  console.log('지도 중심이 기본 중심점으로 이동하고 줌 레벨이 10으로 설정되었습니다.');
} else {
  console.error(result.message);
}`;

// 지도 영역 이동 관련 샘플 코드들
export const moveAreaSample = `// Move Area
import { useMapPan } from '~/packages/Navigation';

const { fitBounds } = useMapPan();
const view = mapRef.getView();
const currentCenter = view.getCenter();

if (currentCenter) {
  console.log('현재 지도 중심:', currentCenter);
  
  // 현재 중심을 기준으로 영역 설정 (상대적 이동)
  const extent = [
    currentCenter[0] - 5000, currentCenter[1] - 5000, // 남서쪽
    currentCenter[0] + 5000, currentCenter[1] + 5000, // 북동쪽
  ];
  const result = fitBounds({ extent, duration: 1500 });
  
  if (result.success) {
    console.log('지도가 현재 중심 기준 영역으로 애니메이션 이동했습니다.\\n영역: [' + extent.join(', ') + ']');
  } else {
    console.error(result.message);
  }
} else {
  console.log('현재 지도 중심을 가져올 수 없습니다.');
}`;

// 지도 줌 관련 샘플 코드들
export const zoomInMapSample = `// Zoom In Map
import { useMapPan } from '~/packages/Navigation';

const { setZoom } = useMapPan();
const view = mapRef.getView();
const currentZoom = view.getZoom() || 0;
const result = setZoom({ zoom: currentZoom + 1, duration: 800 });

if (result.success) {
  console.log('줌 인 애니메이션이 실행되었습니다. (현재: ' + currentZoom + ' → ' + (currentZoom + 1) + ')');
} else {
  console.error(result.message);
}`;

export const zoomOutMapSample = `// Zoom Out Map
import { useMapPan } from '~/packages/Navigation';

const { setZoom } = useMapPan();
const view = mapRef.getView();
const currentZoom = view.getZoom() || 0;
const result = setZoom({ zoom: currentZoom - 1, duration: 800 });

if (result.success) {
  console.log('줌 아웃 애니메이션이 실행되었습니다. (현재: ' + currentZoom + ' → ' + (currentZoom - 1) + ')');
} else {
  console.error(result.message);
}`;

export const adjustScaleSample = `// Adjust Scale
import { useMapScale } from '~/packages/Navigation';

const { adjustScale } = useMapScale();
const result = adjustScale();

if (result.success) {
  console.log('스케일이 조정되었습니다.');
} else {
  console.error(result.message);
}`;

export const panBySample = `// Pan By (픽셀 단위 이동)
import { useMapPan } from '~/packages/Navigation';

const { panBy } = useMapPan();
const result = panBy({ offsetX: 100, offsetY: 0, duration: 300 });

if (result.success) {
  console.log('지도가 오른쪽으로 100px 이동했습니다.');
} else {
  console.error(result.message);
}`;

export const panToSample = `// Pan To (애니메이션 중심+줌 이동)
import { useMapPan } from '~/packages/Navigation';

const { panTo } = useMapPan();
const result = panTo({ center: [126.9779692, 37.566535], zoom: 12, duration: 800 });

if (result.success) {
  console.log('지도가 서울시청으로 애니메이션 이동했습니다.');
} else {
  console.error(result.message);
}`;

export const fitBoundsSample = `// Fit Bounds (범용 영역 맞춤)
import { useMapPan } from '~/packages/Navigation';

const { fitBounds } = useMapPan();
const result = fitBounds({ extent: [126.9723, 37.5647, 126.9778, 37.570], duration: 800 });

if (result.success) {
  console.log('지도가 지정된 영역에 맞춰졌습니다.');
} else {
  console.error(result.message);
}`;

export const getBoundsSample = `// Get Current Extent (현재 화면 extent 반환)
import { useMapInfo } from '~/packages/Navigation';

const { getBounds } = useMapInfo();
const result = getBounds();

if (result.success) {
  console.log('현재 화면 extent를 가져왔습니다.');
} else {
  console.error(result.message);
}`;

export const setZoomSample = `// Set Zoom (애니메이션)
import { useMapPan } from '~/packages/Navigation';

const { setZoom } = useMapPan();
const result = setZoom({ zoom: 15, duration: 1000 });

if (result.success) {
  console.log('줌 레벨이 15로 애니메이션 변경되었습니다.');
} else {
  console.error(result.message);
}`;

export const resetViewSample = `// Reset View (초기화)
import { useMapPan } from '~/packages/Navigation';

const { resetView } = useMapPan();
const result = resetView({ center: [127.062289345605, 37.5087805938127], zoom: 13, rotation: 0, duration: 1000 });

if (result.success) {
  console.log('지도가 기본 설정으로 리셋되었습니다.');
} else {
  console.error(result.message);
}`;

export const rotateMapSample = `// Rotate Map (지도 회전)
import { useMapPan } from '~/packages/Navigation';

const { rotate } = useMapPan();
const result = rotate({ angle: Math.PI / 4, duration: 500 });

if (result.success) {
  console.log('지도가 회전되었습니다.');
} else {
  console.error(result.message);
}`;

 