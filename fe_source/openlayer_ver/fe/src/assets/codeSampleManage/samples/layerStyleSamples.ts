// LayerStyle 패키지 샘플 코드들

export const setLayerDisplayLevelSample = `// 레이어 표시 줌 레벨 설정
import { useLayerDisplay } from '~/assets/LayerStyle';

const { setLayerDisplayLevel } = useLayerDisplay();

const result = await setLayerDisplayLevel('polygonHump', 14, 15);

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 표시 레벨 설정 실패: ' + result.message);
}`;

export const setLayerStyleSample = `// 레이어 스타일 설정
import { useLayerStyle } from '~/assets/LayerStyle';

const { setLayerStyle } = useLayerStyle();

const result = await setLayerStyle('polygonHump', 'polygon');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 스타일 설정 실패: ' + result.message);
}`;

export const setLayerStyleDefaultSample = `// 레이어 스타일 기본값 설정
import { useLayerStyle } from '~/assets/LayerStyle';

const { setLayerStyleDefault } = useLayerStyle();

const result = await setLayerStyleDefault('polygonHump');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 스타일 기본값 설정 실패: ' + result.message);
}`;

export const setThematicsSample = `// 테마틱 스타일 설정
import { useLayerThematics } from '~/assets/LayerStyle';

const { setThematics } = useLayerThematics();
const result = await setThematics('polygonHump', { customStyleName: 'polygon-thematics' });

if (result.success) {
  alert(result.message);
} else {
  alert('테마틱 스타일 설정 실패: ' + result.message);
}`;

export const setLayerOpacitySample = `// 레이어 투명도 설정
import { useLayerOpacity } from '~/assets/LayerStyle';

const { setLayerOpacity } = useLayerOpacity();

const result = await setLayerOpacity('mvt-image', 0.5);

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 투명도 설정 실패: ' + result.message);
}`;

export const getLayerOpacitySample = `// 레이어 투명도 조회
import { useLayerOpacity } from '~/assets/LayerStyle';

const { getLayerOpacity } = useLayerOpacity();

const result = await getLayerOpacity('mvt-image');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 투명도 조회 실패: ' + result.message);
}`;

export const resetLayerOpacitySample = `// 레이어 투명도 초기화
import { useLayerOpacity } from '~/assets/LayerStyle';

const { resetLayerOpacity } = useLayerOpacity();

const result = await resetLayerOpacity('mvt-image');

if (result.success) {
  alert(result.message);
} else {
  alert('레이어 투명도 초기화 실패: ' + result.message);
}`; 