// Selection 패키지 메인 export

// 기존 Selection hooks
export { useCircleSelection, activateCircleSelectionMode } from "./hooks/useCircleSelection";
export { useRectangleSelection, activateRectSelectionMode } from "./hooks/useRectangleSelection";
export { usePolygonSelection, activatePolygonSelectionMode } from "./hooks/usePolygonSelection";

// Basic Select (원초적인 선택 기능 - 마우스 오버 없음)
export { useBasicSelect, activateSelectMode } from "./hooks/useBasicSelect";
export type { UseBasicSelectOptions } from "./hooks/useBasicSelect";

// Advanced Select (고급 선택 기능 - 마우스 오버 포함)
export { useAdvancedSelect, activateAdvancedSelectMode } from "./hooks/useAdvancedSelect";
export type { UseAdvancedSelectOptions } from "./hooks/useAdvancedSelect";

// Clear Select Layer (선택 레이어 초기화)
export { clearSelectLayer } from "./hooks/useSelectionClear";

// Get Selected Features (선택된 피처 가져오기)
export { useGetSelectedFeatures, getSelectedFeatures } from "./hooks/useGetSelectedFeatures";
export type { GetSelectedFeaturesResult } from "./services/getSelectedFeaturesService"; 