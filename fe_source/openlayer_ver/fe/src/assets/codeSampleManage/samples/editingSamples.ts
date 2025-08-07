// Editing 패키지 샘플 코드들

export const trailEditSample = `// Trail Edit(선형 객체 편집) 모드 활성화
import { activateTrailEditMode } from '~/assets/Editing';

// map 객체가 필요합니다
activateTrailEditMode(map);
alert('Trail Edit(선형 객체 편집) 모드가 활성화되었습니다.');`;

export const trailDeleteSample = `// Trail Delete(선택된 피처 삭제) 모드 활성화
import { activateTrailDeleteMode } from '~/assets/Editing';

// map 객체가 필요합니다
await activateTrailDeleteMode(map);
alert('Trail Delete(선택된 피처 삭제) 모드가 활성화되었습니다.');`; 