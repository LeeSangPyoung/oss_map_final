import { useCallback } from 'react';
import { Map } from 'ol';
import { useMapbase } from '~/store/useMapbase';
import { useUserLayer } from '~/assets/UserLayer';
import { useLayerDisplay } from '~/assets/LayerStyle/hooks/useLayerDisplay';
import { useLayerStyle } from '~/assets/LayerStyle/hooks/useLayerStyle';
import { useLayerOpacity } from '~/assets/LayerStyle/hooks/useLayerOpacity';
import { useLayerThematics } from '~/assets/LayerStyle/hooks/useLayerThematics';
import { useLayerInfo, useLayerZoom, useLayerControl } from '~/assets/LayerManagement';
import { useMapInfo, useMapPan, useMapScale, useMapHistory, useMapExport } from '~/assets/Navigation';
import { activateSelectMode, activateAdvancedSelectMode, activateRectSelectionMode, activateCircleSelectionMode, activatePolygonSelectionMode, clearSelectLayer, getSelectedFeatures } from '~/assets/Selection';
import { getTrailCoordinates } from '~/assets/Drawing';
import { activateTrailSimpleMode } from '~/assets/Drawing';
import {
  activateTrailDistanceMode,
  activateAdvancedTrailDistanceMode,
  activateAdvancedTrailAreaMode,
  activateTrailAreaMode,
  activateAreaDrawRectMode,
  activateAreaDrawCircleMode,
  activateAreaDrawPolygonMode,
  activateTrailDrawPointMode,
  activateTrailDrawLineMode,
  activateAdvancedTrailDrawLineMode,
  activateTrailDrawPolygonMode,
} from '~/assets/Drawing';
import { activateTrailEditMode, activateTrailDeleteMode } from '~/assets/Editing';

interface UseCodeExecutionProps {
  map: Map | null;
  setCodeBlockType: (type: string | null) => void;
  setShowCodeBlock: (show: boolean) => void;
  setContextMenuEnabled: (enabled: boolean) => void;
  showNodeTypeSelectorPopup?: (coordinate: number[], pixel: number[]) => void;
  showLineTypeSelectorPopup?: (coordinate: number[], pixel: number[]) => void;
  showPolygonTypeSelectorPopup?: (coordinate: number[], pixel: number[]) => void;
  setDrawnFeature?: (feature: any) => void;
}

export const useCodeExecution = ({ 
  map, 
  setCodeBlockType, 
  setShowCodeBlock,
  setContextMenuEnabled,
  showNodeTypeSelectorPopup,
  showLineTypeSelectorPopup,
  showPolygonTypeSelectorPopup,
  setDrawnFeature
}: UseCodeExecutionProps) => {
  
  // 신규 라이브러리 훅 사용
  const { addUserLayer, initUserLayer, deleteUserLayer, entireAreaUserLayer } = useUserLayer();
  const { setLayerDisplayLevel } = useLayerDisplay();
  const { setLayerStyle, setLayerStyleDefault } = useLayerStyle();
  const { setLayerOpacity, getLayerOpacity, resetLayerOpacity } = useLayerOpacity();
  const { setThematics } = useLayerThematics();
  const { getLayer, getExternalLayerName, getTableNameOfLayer } = useLayerInfo();
  const { getMinDisplayZoomLevel, getMaxDisplayZoomLevel } = useLayerZoom();
  const { getSelectableFacility, viewLayerInfo, toggleDisplayHide, refreshLayer } = useLayerControl();
  
  // Navigation 훅들
  const { getCenter, getZoom, getMinZoom, getMaxZoom, getBounds } = useMapInfo(map);
  const { panBy, panTo, fitBounds, setZoom, resetView, rotate } = useMapPan(map);
  const { adjustScale } = useMapScale(map);
  const { prevScreen, forwardScreen } = useMapHistory(map);
  const { exportMapImage, copyView } = useMapExport(map);


  const handleRunDefaultContextMenuCode = useCallback(async () => {
    if (!map) return;
    console.log('Running default context menu code');
    
    try {
      // 신규 라이브러리 사용
      const { DefaultContextMenuService } = await import('~/assets/ContextMenu');
      const defaultContextMenuService = new DefaultContextMenuService(map);
      
      const result = defaultContextMenuService.setDefaultContextMenu({
        enabled: true,
        theme: 'light'
      });

      if (result.success) {
        // 컨텍스트 메뉴 활성화 (fe6_3와 동일)
        if (setContextMenuEnabled) {
          setContextMenuEnabled(true);
        }
        alert('기본 우클릭 메뉴가 적용되었습니다!\n지도에서 우클릭해보세요.');
      } else {
        alert('기본 우클릭 메뉴 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Default Right-Click Menu Configuration 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setContextMenuEnabled]);

  const handleRunEditContextMenuCode = useCallback(async () => {
    if (!map) return;
    console.log('Running edit context menu code');
    
    try {
      // 신규 라이브러리 사용
      const { EditContextMenuService } = await import('~/assets/ContextMenu');
      const editContextMenuService = new EditContextMenuService(map);
      
      const result = editContextMenuService.setEditContextMenu({
        enabled: true,
        theme: 'light'
      });

      if (result.success) {
        // 컨텍스트 메뉴 활성화 (fe6_3와 동일)
        if (setContextMenuEnabled) {
          setContextMenuEnabled(true);
        }
        alert('에디트 모드 우클릭 메뉴가 적용되었습니다!\n지도에서 우클릭해보세요.');
      } else {
        alert('편집 모드 우클릭 메뉴 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Edit Mode Right-Click Menu Configuration 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setContextMenuEnabled]);

  const handleRunSelectableFacilityCode = useCallback(async () => {
    if (!map) return;
    console.log('Running selectable facility code');
    
    try {
      const result = await getSelectableFacility('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('선택 가능 여부 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Selectable Facility 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getSelectableFacility]);

  const handleRunViewLayerInfoCode = useCallback(async () => {
    if (!map) return;
    console.log('Running view layer info code');
    
    try {
      const result = await viewLayerInfo('polygonHump');
      
      if (result.success) {
        console.log('레이어 정보:', result.layerInfo);
        alert(result.message);
      } else {
        alert('레이어 정보 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('View Layer Info 실행 중 오류:', error);
      alert('레이어 정보를 가져오는 중 오류가 발생했습니다.');
    }
  }, [map, viewLayerInfo]);

  const handleRunToggleDisplayHideCode = useCallback(async () => {
    if (!map) return;
    console.log('Running toggle display/hide code');
    
    try {
      const result = await toggleDisplayHide('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 표시 상태 변경 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Toggle Display/Hide 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, toggleDisplayHide]);

  const handleRunRefreshLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running refresh layer code');
    
    try {
      const result = await refreshLayer('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 새로고침 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Refresh Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, refreshLayer]);

  // Navigation 핸들러들
  const handleRunGetCenterCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get center code');
    
    try {
      const result = getCenter();
      
      if (result.success) {
        console.log('화면 중심점:', result.data);
        alert(`화면 중심점: [${result.data?.center?.join(', ')}]\n위도: ${result.data?.lat}\n경도: ${result.data?.lng}`);
      } else {
        alert('화면 중심점 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Center 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getCenter]);

  const handleRunGetZoomCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get zoom code');
    
    try {
      const result = getZoom();
      
      if (result.success) {
        console.log('줌 레벨:', result.data);
        alert(`현재 줌 레벨: ${result.data?.current}\n최소 줌: ${result.data?.min}\n최대 줌: ${result.data?.max}`);
      } else {
        alert('줌 레벨 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Zoom 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getZoom]);

  const handleRunGetMinZoomCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get min zoom code');
    
    try {
      const result = getMinZoom();
      
      if (result.success) {
        alert(`최소 줌 레벨: ${result.data}`);
      } else {
        alert('최소 줌 레벨 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Min Zoom 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getMinZoom]);

  const handleRunGetMaxZoomCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get max zoom code');
    
    try {
      const result = getMaxZoom();
      
      if (result.success) {
        alert(`최대 줌 레벨: ${result.data}`);
      } else {
        alert('최대 줌 레벨 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Max Zoom 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getMaxZoom]);

  const handleRunMoveCenterCode = useCallback(async () => {
    if (!map) return;
    console.log('Running move center code');
    
    try {
      const result = panTo({ center: [127.0, 37.5], zoom: 10, duration: 800 });
      
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Move Center 실행 중 오류:', error);
    }
  }, [map, panTo]);

  const handleRunMoveCenterZoomCode = useCallback(async () => {
    if (!map) return;
    console.log('Running move center zoom code');
    
    try {
      const result = panTo({ center: [127.0, 37.5], zoom: 15, duration: 800 });
      
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Move Center Zoom 실행 중 오류:', error);
    }
  }, [map, panTo]);

  const handleRunMoveAreaCode = useCallback(async () => {
    if (!map) return;
    console.log('Running move area code');
    
    try {
      // fe5와 동일하게 현재 중심 기준 상대적 이동
      const view = map.getView();
      const currentCenter = view.getCenter();
      
      if (currentCenter) {
        console.log('현재 지도 중심:', currentCenter);
        
        // 현재 중심을 기준으로 영역 설정 (상대적 이동)
        const extent = [
          currentCenter[0] - 5000, currentCenter[1] - 5000, // 남서쪽
          currentCenter[0] + 5000, currentCenter[1] + 5000, // 북동쪽
        ];
        view.fit(extent, { duration: 1500 });
        console.log('지도가 현재 중심 기준 영역으로 애니메이션 이동했습니다.\n영역: [' + extent.join(', ') + ']');
      } else {
        console.log('현재 지도 중심을 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('Move Area 실행 중 오류:', error);
    }
  }, [map]);

  const handleRunPrevScreenCode = useCallback(async () => {
    if (!map) return;
    console.log('Running prev screen code');
    
    try {
      const result = prevScreen({ duration: 800 });
      if (result.success) {
        console.log('이전 화면으로 이동했습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Prev Screen 실행 중 오류:', error);
    }
  }, [map, prevScreen]);

  const handleRunForwardScreenCode = useCallback(async () => {
    if (!map) return;
    console.log('Running forward screen code');
    
    try {
      const result = forwardScreen({ duration: 800 });
      if (result.success) {
        console.log('다음 화면으로 이동했습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Forward Screen 실행 중 오류:', error);
    }
  }, [map, forwardScreen]);

  const handleRunZoomInCode = useCallback(async () => {
    if (!map) return;
    console.log('Running zoom in code');
    
    try {
      // 신규 라이브러리 호출
      const view = map.getView();
      const currentZoom = view.getZoom() || 0;
      const result = setZoom({ zoom: currentZoom + 1, duration: 800 });
      
      if (result.success) {
        console.log('줌 인 애니메이션이 실행되었습니다. (현재: ' + currentZoom + ' → ' + (currentZoom + 1) + ')');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Zoom In 실행 중 오류:', error);
    }
  }, [map, setZoom]);

  const handleRunZoomOutCode = useCallback(async () => {
    if (!map) return;
    console.log('Running zoom out code');
    
    try {
      // 신규 라이브러리 호출
      const view = map.getView();
      const currentZoom = view.getZoom() || 0;
      const result = setZoom({ zoom: currentZoom - 1, duration: 800 });
      
      if (result.success) {
        console.log('줌 아웃 애니메이션이 실행되었습니다. (현재: ' + currentZoom + ' → ' + (currentZoom - 1) + ')');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Zoom Out 실행 중 오류:', error);
    }
  }, [map, setZoom]);

  const handleRunAdjustScaleCode = useCallback(async () => {
    if (!map) return;
    console.log('Running adjust scale code');
    
    try {
      const result = adjustScale();
      if (result.success) {
        console.log('스케일 조정이 완료되었습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Adjust Scale 실행 중 오류:', error);
    }
  }, [map, adjustScale]);

  const handleRunPanByCode = useCallback(async () => {
    if (!map) return;
    console.log('Running pan by code');
    
    try {
      const result = panBy({ offsetX: 100, offsetY: 0, duration: 300 });
      if (result.success) {
        console.log('지도가 이동되었습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Pan By 실행 중 오류:', error);
    }
  }, [map, panBy]);

  const handleRunPanToCode = useCallback(async () => {
    if (!map) return;
    console.log('Running pan to code');
    
    try {
      const result = panTo({ center: [127.062289345605, 37.5087805938127], duration: 800 });
      if (result.success) {
        console.log('지도가 지정된 위치로 이동했습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Pan To 실행 중 오류:', error);
    }
  }, [map, panTo]);

  const handleRunFitBoundsCode = useCallback(async () => {
    if (!map) return;
    console.log('Running fit bounds code');
    
    try {
      const result = fitBounds({ extent: [127.0, 37.4, 127.1, 37.6], duration: 800 });
      if (result.success) {
        console.log('지도가 지정된 영역에 맞춰졌습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Fit Bounds 실행 중 오류:', error);
    }
  }, [map, fitBounds]);

  const handleRunGetBoundsCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get bounds code');
    
    try {
      const result = getBounds();
      if (result.success) {
        console.log('현재 화면 extent를 가져왔습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Get Bounds 실행 중 오류:', error);
    }
  }, [map, getBounds]);

  const handleRunSetZoomCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set zoom code');
    
    try {
      const result = setZoom({ zoom: 15, duration: 800 });
      if (result.success) {
        console.log('줌 레벨이 설정되었습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Set Zoom 실행 중 오류:', error);
    }
  }, [map, setZoom]);

  const handleRunResetViewCode = useCallback(async () => {
    if (!map) return;
    console.log('Running reset view code');
    
    try {
      const result = resetView({ center: [127.062289345605, 37.5087805938127], zoom: 13, rotation: 0, duration: 1000 });
      if (result.success) {
        console.log('지도 뷰가 초기화되었습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Reset View 실행 중 오류:', error);
    }
  }, [map, resetView]);

  const handleRunCopyViewCode = useCallback(async () => {
    if (!map) return;
    console.log('Running copy view code');
    
    try {
      const result = copyView();
      
      if (result.success) {
        alert('현재 지도 상태가 클립보드에 복사되었습니다.');
      } else {
        alert('뷰 복사 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Copy View 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, copyView]);

  const handleRunRotateMapCode = useCallback(async () => {
    if (!map) return;
    console.log('Running rotate map code');
    
    try {
      const result = rotate({ angle: Math.PI / 4, duration: 500 });
      
      if (result.success) {
        console.log('지도가 회전되었습니다.');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Rotate Map 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, rotate]);

  const handleRunExportMapImageCode = useCallback(async () => {
    if (!map) return;
    console.log('Running export map image code');
    
    try {
      const result = exportMapImage();
      
      if (result.success) {
        alert('지도 이미지가 다운로드되었습니다.');
      } else {
        alert('이미지 내보내기 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Export Map Image 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, exportMapImage]);

    const handleRunAddUserLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running add user layer code');

    try {
      const result = await addUserLayer({
        layerName: 'TEST_USER_LAYER',
        features: [
          {
            geometry: {
              type: 'Point' as const,
              coordinates: [127.062289345605, 37.5087805938127],
            },
            style: { id: 'nodeBusinessPlan' },
          },
          {
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [127.062289345605, 37.5087805938127],
                [127.045617, 37.495418],
              ],
            },
            style: { id: 'linkSafeWayHome' },
          },
        ]
      });

      if (result.success) {
        alert('TEST_USER_LAYER에 피처가 추가되었습니다.\n- Point: nodeBusinessPlan 스타일\n- LineString: linkSafeWayHome 스타일');
      } else {
        alert('사용자 레이어를 생성할 수 없습니다.');
      }
    } catch (error) {
      console.error('Add User Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, addUserLayer]);

  const handleRunGetLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get layer code');
    
    try {
      const result = await getLayer('polygonHump');
      
      if (result.success) {
        console.log('레이어 정보:', result.layerInfo);
        alert(result.message);
      } else {
        alert('레이어 정보 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getLayer]);

  const handleRunGetExternalLayerNameCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get external layer name code');
    
    try {
      const result = await getExternalLayerName('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('외부 레이어명 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get External Layer Name 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getExternalLayerName]);

  const handleRunGetTableNameOfLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get table name of layer code');
    
    try {
      const result = await getTableNameOfLayer('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('테이블명 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Table Name of Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getTableNameOfLayer]);

  const handleRunGetMinDisplayZoomLevelCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get min display zoom level code');
    
    try {
      const result = await getMinDisplayZoomLevel('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('최소 줌 레벨 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Min Display Zoom Level 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getMinDisplayZoomLevel]);

  const handleRunGetMaxDisplayZoomLevelCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get max display zoom level code');
    
    try {
      const result = await getMaxDisplayZoomLevel('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('최대 줌 레벨 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Max Display Zoom Level 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getMaxDisplayZoomLevel]);

  const handleRunInitUserLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running init user layer code');

    try {
      const result = await initUserLayer({
        layerName: 'TEST_USER_LAYER'
      });

      if (result.success) {
        alert('TEST_USER_LAYER가 초기화되었습니다.\n모든 피처가 제거되었습니다.');
      } else {
        alert('TEST_USER_LAYER가 존재하지 않습니다.');
      }
    } catch (error) {
      console.error('Initialize User Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, initUserLayer]);

    const handleRunDeleteUserLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running delete user layer code');

    try {
      const result = await deleteUserLayer({
        layerName: 'TEST_USER_LAYER'
      });

      if (result.success) {
        alert('TEST_USER_LAYER가 삭제되었습니다.');
      } else {
        alert('TEST_USER_LAYER가 존재하지 않습니다.');
      }
    } catch (error) {
      console.error('Delete User Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, deleteUserLayer]);

    const handleRunEntireAreaUserLayerCode = useCallback(async () => {
    if (!map) return;
    console.log('Running entire area user layer code');
    
    try {
      const layer = useMapbase.getState().getCustomLayerByName('TEST_USER_LAYER');
      if (!layer) {
        alert('TEST_USER_LAYER가 존재하지 않습니다.');
        return;
      }

      const bounds = layer.getBounds();
      if (bounds && bounds.length === 4) {
        // fe6_ref와 동일한 방식: useMapbase.getState().fitBounds 사용
        useMapbase.getState().fitBounds({
          min: [bounds[0], bounds[1]],
          max: [bounds[2], bounds[3]],
        });
        
        setTimeout(() => {
          alert('TEST_USER_LAYER의 전체 영역으로 이동했습니다.');
        }, 1000);
      } else {
        alert('TEST_USER_LAYER의 영역을 계산할 수 없습니다.');
      }
    } catch (error) {
      console.error('Entire Area of User Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunSelectCode = useCallback(() => {
    if (!map) return;
    console.log('Running select code');
    
    try {
      // 신규 라이브러리 사용
      activateSelectMode(map, useMapbase.getState().layerData);
      alert('Select 모드가 활성화되었습니다.\n지도에서 피처를 클릭하여 선택할 수 있습니다.');
    } catch (error) {
      console.error('Select 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAdvancedSelectCode = useCallback(() => {
    if (!map) return;
    console.log('Running advanced select code');
    
    try {
      // 신규 라이브러리 사용
      activateAdvancedSelectMode(map, useMapbase.getState().layerData);
      alert('Advanced Select 모드가 활성화되었습니다.\n지도에서 피처를 클릭하여 선택할 수 있습니다.');
    } catch (error) {
      console.error('Advanced Select 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunRectSelectionCode = useCallback(() => {
    if (!map) return;
    console.log('Running rect selection code');
    
    try {
      // 신규 라이브러리 사용
      activateRectSelectionMode(map, useMapbase.getState().layerData);
      alert('Rect Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 영역을 선택하세요.');
    } catch (error) {
      console.error('Rect Selection 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunCircleSelectionCode = useCallback(() => {
    if (!map) return;
    console.log('Running circle selection code');
    
    try {
      // 신규 라이브러리 사용
      activateCircleSelectionMode(map, useMapbase.getState().layerData);
      alert('Circle Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스로 드래그하여 원을 그리세요.');
    } catch (error) {
      console.error('Circle Selection 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunPolygonSelectionCode = useCallback(() => {
    if (!map) return;
    console.log('Running polygon selection code');
    
    try {
      // 신규 라이브러리 사용
      activatePolygonSelectionMode(map, useMapbase.getState().layerData);
      alert('Polygon Selection 모드가 활성화되었습니다.\nShift 키를 누른 상태에서 마우스 클릭으로 다각형을 그리세요.\n더블클릭으로 그리기를 완료하세요.');
    } catch (error) {
      console.error('Polygon Selection 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailDistanceCode = useCallback(() => {
    if (!map) return;
    console.log('Running trail distance code');
    
    try {
      // 신규 라이브러리 사용
      activateTrailDistanceMode(map);
      alert('Trail Distance(거리 측정) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Trail Distance 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAdvancedTrailDistanceCode = useCallback(() => {
    if (!map) return;
    console.log('Running advanced trail distance code');
    
    try {
      console.log('activateAdvancedTrailDistanceMode 호출 전');
      // 신규 라이브러리 사용
      activateAdvancedTrailDistanceMode(map);
      console.log('activateAdvancedTrailDistanceMode 호출 후');
      alert('Advanced Trail Distance(고급 거리 측정) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Trail Distance 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAdvancedTrailAreaCode = useCallback(() => {
    if (!map) return;
    console.log('Running advanced trail area code');
    
    try {
      // 신규 라이브러리 사용
      activateAdvancedTrailAreaMode(map);
      alert('Advanced Trail Area(고급 면적 측정) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Trail Area 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailSimpleCode = useCallback(() => {
    if (!map) return;
    console.log('Running trail simple code');
    
    try {
      // 신규 라이브러리 사용
      activateTrailSimpleMode();
      alert('Trail Simple(간단한 선 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Trail Simple 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAreaDrawRectCode = useCallback(() => {
    if (!map) return;
    console.log('Running area draw rect code');
    
    try {
      // 신규 라이브러리 사용
      activateAreaDrawRectMode({
        style: {
          color: 'red',
          fillColor: 'blue',
          weight: 4,
          fill: true,
          fillOpacity: 0.4,
        },
      });
      alert('Area Draw Rect(사각형 영역 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Area Draw Rect 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAreaDrawCircleCode = useCallback(() => {
    if (!map) return;
    console.log('Running area draw circle code');
    
    try {
      // 신규 라이브러리 사용
      activateAreaDrawCircleMode({
        style: {
          color: 'red',
          fillColor: 'blue',
          weight: 4,
          fill: true,
          fillOpacity: 0.4,
        },
      });
      alert('Area Draw Circle(원형 영역 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Area Draw Circle 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunAreaDrawPolygonCode = useCallback(() => {
    if (!map) return;
    console.log('Running area draw polygon code');
    
    try {
      // 신규 라이브러리 사용
      activateAreaDrawPolygonMode({
        style: {
          color: 'red',
          fillColor: 'blue',
          weight: 4,
          fill: true,
          fillOpacity: 0.4,
        },
      });
      alert('Area Draw Polygon(다각형 영역 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Area Draw Polygon 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailAreaCode = useCallback(() => {
    if (!map) return;
    console.log('Running trail area code');
    
    try {
      // 신규 라이브러리 사용
      activateTrailAreaMode(map);
      alert('Trail Area(면적 측정) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Trail Area 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailEditCode = useCallback(() => {
    if (!map) return;
    console.log('Running trail edit code');
    try {
      activateTrailEditMode(map);
    } catch (error) {
      console.error('Trail Edit 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailDeleteCode = useCallback(async () => {
    if (!map) return;
    console.log('Running trail delete code');
    try {
      await activateTrailDeleteMode(map);
    } catch (error) {
      console.error('Trail Delete 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunGetSelectedFeaturesCode = useCallback(() => {
    if (!map) return;
    console.log('Running get selected features code');
    
    try {
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
      }
    } catch (error) {
      console.error('Get Selected Features 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunGetTrailCoordinateCode = useCallback(() => {
    if (!map) return;
    console.log('Running get trail coordinate code');
    
    try {
      const result = getTrailCoordinates();
      if (result.success) {
        console.log('트레일 좌표들:', result.coordinates);
        alert(JSON.stringify(result.coordinates, null, 2));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Get Trail Coordinate 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunTrailDrawPointCode = useCallback(() => {
    try {
      activateTrailDrawPointMode({
        showNodeTypeSelectorPopup: showNodeTypeSelectorPopup || ((coordinate: number[], pixel: number[]) => {
          console.log('노드 타입 선택기 표시:', coordinate, pixel);
        }),
        setDrawnFeature: setDrawnFeature || ((feature: any) => {
          console.log('그린 피처 설정:', feature);
        })
      });
      alert('Trail Draw Point(점 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Trail Draw Point 실행 중 오류:', error);
    }
  }, [showNodeTypeSelectorPopup, setDrawnFeature]);

  const handleRunTrailDrawLineCode = useCallback(() => {
    try {
      activateTrailDrawLineMode({
        showLineTypeSelectorPopup: showLineTypeSelectorPopup || ((coordinate: number[], pixel: number[]) => {
          console.log('라인 타입 선택기 표시:', coordinate, pixel);
        }),
        setDrawnFeature: setDrawnFeature || ((feature: any) => {
          console.log('그린 피처 설정:', feature);
        })
      });
    } catch (error) {
      console.error('Trail Draw Line 실행 중 오류:', error);
    }
  }, [showLineTypeSelectorPopup, setDrawnFeature]);

  const handleRunAdvancedTrailDrawLineCode = useCallback(() => {
    try {
      activateAdvancedTrailDrawLineMode({
        showLineTypeSelectorPopup: showLineTypeSelectorPopup || ((coordinate: number[], pixel: number[]) => {
          console.log('Advanced 라인 타입 선택기 표시:', coordinate, pixel);
        }),
        setDrawnFeature: setDrawnFeature || ((feature: any) => {
          console.log('Advanced 그린 피처 설정:', feature);
        })
      });
      alert('Advanced Trail Draw Line(스냅 기능이 포함된 고급 선형 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Trail Draw Line 실행 중 오류:', error);
    }
  }, [showLineTypeSelectorPopup, setDrawnFeature]);

  const handleRunAdvancedTrailDrawPointCode = useCallback(async () => {
    try {
      // useMapbase 상태 확인
      const mapbaseState = useMapbase.getState();
      console.log('🔍 MainPage Advanced Trail Draw Point 실행 시 useMapbase 상태:', {
        map: mapbaseState.map,
        layerData: mapbaseState.layerData,
        layerDataLength: mapbaseState.layerData?.length
      });
      
      const { activateAdvancedTrailDrawPointMode } = await import('~/assets/Drawing');
      await activateAdvancedTrailDrawPointMode({
        showNodeTypeSelectorPopup: showNodeTypeSelectorPopup || ((coordinate: number[], pixel: number[]) => {
          console.log('Advanced 노드 타입 선택기 표시:', coordinate, pixel);
        }),
        setDrawnFeature: setDrawnFeature || ((feature: any) => {
          console.log('Advanced 그린 피처 설정:', feature);
        })
      });
      alert('Advanced Trail Draw Point(스냅 기능이 포함된 고급 점 그리기) 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Trail Draw Point 실행 중 오류:', error);
    }
  }, [showNodeTypeSelectorPopup, setDrawnFeature]);

  const handleRunTrailDrawPolygonCode = useCallback(() => {
    try {
      activateTrailDrawPolygonMode({
        showPolygonTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
          console.log('폴리곤 타입 선택기 표시:', coordinate, pixel);
        },
        setDrawnFeature: (feature: any) => {
          console.log('그린 피처 설정:', feature);
        }
      });
    } catch (error) {
      console.error('Trail Draw Polygon 실행 중 오류:', error);
    }
  }, []);

  const handleRunAdvancedTrailDrawPolygonCode = useCallback(async () => {
    try {
      const { activateAdvancedTrailDrawPolygonMode } = await import('~/assets/Drawing/hooks/useAdvancedTrailDrawPolygon');
      await activateAdvancedTrailDrawPolygonMode({
        showPolygonTypeSelectorPopup: showPolygonTypeSelectorPopup || ((coordinate: number[], pixel: number[]) => {
          console.log('Advanced 폴리곤 타입 선택기 표시:', coordinate, pixel);
        }),
        setDrawnFeature: setDrawnFeature || ((feature: any) => {
          console.log('Advanced 그린 피처 설정:', feature);
        })
      });
      alert('Advanced Trail Draw Polygon 모드가 활성화되었습니다.');
    } catch (error) {
      console.error('Advanced Trail Draw Polygon 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [showPolygonTypeSelectorPopup, setDrawnFeature]);

  const handleRunSetThemematicsCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set thematics code');
    
    try {
      const result = await setThematics('polygonHump', { customStyleName: 'polygon-thematics' });
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('테마틱 스타일 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Set Thematics 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setThematics]);

  const handleRunClearSelectLayerCode = useCallback(() => {
    if (!map) return;
    console.log('Running clear select layer code');
    
    try {
      // 신규 라이브러리 사용
      clearSelectLayer();
      alert('선택된 피처들이 초기화되었습니다.');
    } catch (error) {
      console.error('Clear Select Layer 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map]);

  const handleRunSetLayerDisplayLevelCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set layer display level code');
    
    try {
      const result = await setLayerDisplayLevel('polygonHump', 14, 15);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 표시 레벨 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Set Layer Display Level 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setLayerDisplayLevel]);

  const handleRunSetLayerStyleCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set layer style code');
    
    try {
      const result = await setLayerStyle('polygonHump', 'polygon');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 스타일 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Set Layer Style 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setLayerStyle]);

  const handleRunSetLayerStyleDefaultCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set layer style default code');
    
    try {
      const result = await setLayerStyleDefault('polygonHump');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 스타일 기본값 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Set Layer Style Default 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setLayerStyleDefault]);

  const handleRunSetLayerOpacityCode = useCallback(async () => {
    if (!map) return;
    console.log('Running set layer opacity code');
    
    try {
      const result = await setLayerOpacity('mvt-image', 0.5);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 투명도 설정 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Set Layer Opacity 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, setLayerOpacity]);

  const handleRunGetLayerOpacityCode = useCallback(async () => {
    if (!map) return;
    console.log('Running get layer opacity code');
    
    try {
      const result = await getLayerOpacity('mvt-image');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 투명도 조회 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Get Layer Opacity 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, getLayerOpacity]);

  const handleRunResetLayerOpacityCode = useCallback(async () => {
    if (!map) return;
    console.log('Running reset layer opacity code');
    
    try {
      const result = await resetLayerOpacity('mvt-image');
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 투명도 초기화 실패: ' + result.message);
      }
    } catch (error) {
      console.error('Reset Layer Opacity 실행 중 오류:', error);
      alert('실행 오류: ' + error);
    }
  }, [map, resetLayerOpacity]);

  const openCodeBlock = useCallback((type: string) => {
    console.log('openCodeBlock called with type:', type);
    
    // 전역 변수 초기화 및 현재 타입 저장
    (window as any).currentCodeSample = null;
    (window as any).currentCodeBlockType = type;
    
    // 컨텍스트 메뉴 관련 타입인 경우 활성화
    if (type === 'defaultContextMenu' || type === 'editContextMenu') {
      setContextMenuEnabled(true);
    }
    
    // 이미 열려있는 경우 애니메이션을 위해 잠시 비활성화
    if (true) { // 항상 애니메이션 효과 적용
      window.dispatchEvent(new CustomEvent('deactivateCodeBlock'));
      
      setTimeout(() => {
        setShowCodeBlock(true);
        setCodeBlockType(type); // 샘플 코드 표시를 위해 설정
        
        // 애니메이션 활성화 (더 긴 지연시간으로 부드럽게)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('activateCodeBlock'));
        }, 100);
      }, 300);
    } else {
      setShowCodeBlock(true);
      setCodeBlockType(type); // 샘플 코드 표시를 위해 설정
      
      // 애니메이션 활성화
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('activateCodeBlock'));
      }, 10);
    }
    
    console.log('Code block opened for type:', type);
  }, [setCodeBlockType, setShowCodeBlock, setContextMenuEnabled]);

  const closeCodeBlockAfterRun = useCallback(() => {
    setShowCodeBlock(false);
    setCodeBlockType(null);
  }, [setShowCodeBlock, setCodeBlockType]);

  return {
    handleRunDefaultContextMenuCode,
    handleRunEditContextMenuCode,
    handleRunGetLayerCode,
    handleRunGetExternalLayerNameCode,
    handleRunGetTableNameOfLayerCode,
    handleRunGetMinDisplayZoomLevelCode,
    handleRunGetMaxDisplayZoomLevelCode,
    handleRunSelectableFacilityCode,
    handleRunViewLayerInfoCode,
    handleRunToggleDisplayHideCode,
    handleRunRefreshLayerCode,
    handleRunAddUserLayerCode,
    handleRunInitUserLayerCode,
    handleRunDeleteUserLayerCode,
    handleRunEntireAreaUserLayerCode,
    
    // Navigation 핸들러들
    handleRunGetCenterCode,
    handleRunGetZoomCode,
    handleRunGetMinZoomCode,
    handleRunGetMaxZoomCode,
    handleRunMoveCenterCode,
    handleRunMoveCenterZoomCode,
    handleRunMoveAreaCode,
    handleRunPrevScreenCode,
    handleRunForwardScreenCode,
    handleRunZoomInCode,
    handleRunZoomOutCode,
    handleRunAdjustScaleCode,
    handleRunPanByCode,
    handleRunPanToCode,
    handleRunFitBoundsCode,
    handleRunGetBoundsCode,
    handleRunSetZoomCode,
    handleRunResetViewCode,
    handleRunCopyViewCode,
    handleRunRotateMapCode,
    handleRunExportMapImageCode,
    handleRunSetLayerDisplayLevelCode,
    handleRunSetLayerStyleCode,
    handleRunSetLayerStyleDefaultCode,
    handleRunSetLayerOpacityCode,
    handleRunGetLayerOpacityCode,
    handleRunResetLayerOpacityCode,
    handleRunSetThemematicsCode,
    handleRunClearSelectLayerCode,
    handleRunSelectCode,
    handleRunAdvancedSelectCode,
    handleRunRectSelectionCode,
    handleRunCircleSelectionCode,
    handleRunPolygonSelectionCode,
    handleRunTrailDistanceCode,
    handleRunAdvancedTrailDistanceCode,
    handleRunAdvancedTrailAreaCode,
    handleRunTrailSimpleCode,
    handleRunAreaDrawRectCode,
    handleRunAreaDrawCircleCode,
    handleRunAreaDrawPolygonCode,
    handleRunTrailAreaCode,
    handleRunTrailEditCode,
    handleRunTrailDeleteCode,
    handleRunGetSelectedFeaturesCode,
    handleRunGetTrailCoordinateCode,
    handleRunTrailDrawLineCode,
    handleRunAdvancedTrailDrawLineCode,
    handleRunTrailDrawPointCode,
    handleRunAdvancedTrailDrawPointCode,
    handleRunTrailDrawPolygonCode,
    handleRunAdvancedTrailDrawPolygonCode,
    openCodeBlock,
    closeCodeBlockAfterRun,
  };
}; 