// ContextMenu 샘플 코드
// fe6_3와 동일한 기능 구현

export const defaultContextMenuSample = `// 기본 우클릭 메뉴 설정
import { DefaultContextMenuService } from '~/packages/ContextMenu';

const defaultContextMenuService = new DefaultContextMenuService(map);
const result = defaultContextMenuService.setDefaultContextMenu({
  enabled: true,
  theme: 'light'
});

if (result.success) {
  // 컨텍스트 메뉴 활성화
  if (setContextMenuEnabled) {
    setContextMenuEnabled(true);
  }
  alert('기본 우클릭 메뉴가 적용되었습니다!\\n지도에서 우클릭해보세요.');
} else {
  alert('기본 우클릭 메뉴 설정 실패: ' + result.message);
}`;

export const editContextMenuSample = `// 편집 모드 우클릭 메뉴 설정
import { EditContextMenuService } from '~/packages/ContextMenu';

const editContextMenuService = new EditContextMenuService(map);
const result = editContextMenuService.setEditContextMenu({
  enabled: true,
  theme: 'light'
});

if (result.success) {
  // 컨텍스트 메뉴 활성화
  if (setContextMenuEnabled) {
    setContextMenuEnabled(true);
  }
  alert('에디트 모드 우클릭 메뉴가 적용되었습니다!\\n지도에서 우클릭해보세요.');
} else {
  alert('편집 모드 우클릭 메뉴 설정 실패: ' + result.message);
}`; 