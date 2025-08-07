// 레이어 정보 관리 관련 샘플 코드들

export const getLayerSample = `// Get Layer (레이어 정보 가져오기)
// Navigation 패키지의 handleGetLayer 함수 사용
// 파라미터: 레이어ID(선택사항), 레이어타입(선택사항)
handleGetLayer('mvt-image');  // 특정 레이어 정보 조회 (alert로 결과 표시)
console.log('레이어 정보를 가져왔습니다.');

// 또는 모든 레이어 정보 조회
// handleGetLayer();  // 모든 레이어 정보 조회`;

export const externalLayerNameSample = `// External Layer Name (외부 레이어 aliasName 가져오기)
// Navigation 패키지의 handleGetExternalLayerName 함수 사용
// 파라미터: 레이어ID(선택사항)
handleGetExternalLayerName('polygonHump');  // 특정 레이어의 aliasName 조회 (alert로 결과 표시)
console.log('외부 레이어 aliasName을 가져왔습니다.');

// 또는 모든 외부 레이어 조회
// handleGetExternalLayerName();  // 모든 외부 레이어 조회 (alert로 결과 표시)`;

export const tableNameOfLayerSample = `// Table Name of Layer (레이어 테이블명 가져오기)
// Navigation 패키지의 handleGetTableNameOfLayer 함수 사용
// 파라미터: 레이어ID(선택사항)
handleGetTableNameOfLayer('polygonHump');  // 특정 레이어의 테이블명 조회 (alert로 결과 표시)
console.log('레이어 테이블명을 가져왔습니다.');

// 또는 모든 레이어 테이블명 조회
// handleGetTableNameOfLayer();  // 모든 레이어 테이블명 조회 (alert로 결과 표시)`;

export const minDisplayZoomLevelSample = `// 레이어 표시 최소 줌레벨(minZoom) 가져오기 예시
// Navigation 패키지의 handleGetMinDisplayZoomLevel 함수 사용
handleGetMinDisplayZoomLevel('polygonHump').then(result => {
  if (result.success && result.minZoom !== undefined) {
    alert(result.minZoom);
    console.log('레이어 최소 줌 레벨을 가져왔습니다.');
  } else {
    alert('레이어를 찾을 수 없습니다.');
  }
}).catch(err => {
  alert('오류: ' + err);
});

// 또는 모든 레이어 최소 줌 레벨 조회
// handleGetMinDisplayZoomLevel().then(result => {
//   if (result.success && result.minZoom !== undefined) {
//     alert(result.minZoom);
//   }
// });`;

export const maxDisplayZoomLevelSample = `// 레이어 표시 최대 줌레벨(maxZoom) 가져오기 예시
// Navigation 패키지의 handleGetMaxDisplayZoomLevel 함수 사용
handleGetMaxDisplayZoomLevel('polygonHump').then(result => {
  if (result.success && result.maxZoom !== undefined) {
    alert(result.maxZoom);
    console.log('레이어 최대 줌 레벨을 가져왔습니다.');
  } else {
    alert('레이어를 찾을 수 없습니다.');
  }
}).catch(err => {
  alert('오류: ' + err);
});

// 또는 모든 레이어 최대 줌 레벨 조회
// handleGetMaxDisplayZoomLevel().then(result => {
//   if (result.success && result.maxZoom !== undefined) {
//     alert(result.maxZoom);
//   }
// });`;

export const selectableFacilitySample = `// Selectable Facility (레이어 선택 가능 여부 확인)
// Navigation 패키지의 handleGetSelectableStatus 함수 사용
handleGetSelectableStatus('polygonHump').then(result => {
  if (result.success && result.isSelectable !== undefined) {
    let resultText = '=== 레이어 선택 가능 여부 ===\\n\\n';
    resultText += 'polygonHump: ' + (result.isSelectable ? '✅ 선택 가능' : '❌ 선택 불가') + '\\n';
    alert(resultText);
    console.log('레이어 선택 가능 여부를 가져왔습니다.');
  }
}).catch(err => {
  alert('오류: ' + err);
});

// 또는 모든 레이어 선택 가능 여부 조회
// handleGetSelectableStatus().then(result => {
//   if (result.success && result.isSelectable !== undefined) {
//     let resultText = '=== 레이어 선택 가능 여부 ===\\n\\n';
//     resultText += '모든 레이어: ' + (result.isSelectable ? '✅ 선택 가능' : '❌ 선택 불가') + '\\n';
//     alert(resultText);
//   }
// });`;

export const viewLayerInfoSample = `// View Layer Information (레이어 정보 보기)
// Navigation 패키지의 handleGetViewLayerInfo 함수 사용
handleGetViewLayerInfo('polygonHump').then(result => {
  if (result.success && result.properties) {
    alert(JSON.stringify(result.properties, null, 2));
    console.log('레이어 정보를 가져왔습니다.');
  } else {
    alert('레이어를 찾을 수 없습니다.');
  }
}).catch(err => {
  alert('오류: ' + err);
});

// 또는 모든 레이어 정보 조회
// handleGetViewLayerInfo().then(result => {
//   if (result.success && result.properties) {
//     alert(JSON.stringify(result.properties, null, 2));
//   }
// });`;

export const toggleDisplayHideSample = `// Toggle Display/Hide (레이어 표시/숨김 토글)
// Navigation 패키지의 handleToggleDisplayHide 함수 사용
handleToggleDisplayHide('polygonHump').then(result => {
  if (result.success) {
    alert(result.message);
    console.log('레이어 표시/숨김을 토글했습니다.');
  } else {
    alert('레이어를 찾을 수 없습니다.');
  }
}).catch(err => {
  alert('오류: ' + err);
});

// 또는 다른 레이어 토글
// handleToggleDisplayHide('linkDsWay').then(result => {
//   if (result.success) {
//     alert(result.message);
//   }
// });`; 