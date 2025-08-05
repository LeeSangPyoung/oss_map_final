import React, { useState, useRef, useEffect } from 'react';
import { Map } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { useMapbase } from '~/store/useMapbase';

// 기존 라이브러리 재사용
import { useMapInfo, useMapPan, useMapHistory, useMapExport } from '~/packages/Navigation';
import { useLayerInfo, useLayerControl } from '~/packages/LayerManagement';
import { 
  activateTrailDrawPointMode, 
  activateTrailDrawLineMode, 
  activateTrailDrawPolygonMode,
  activateTrailDistanceMode, 
  activateTrailAreaMode,
  activateAreaDrawRectMode,
  activateAreaDrawCircleMode,
  activateAreaDrawPolygonMode,
  activateAdvancedTrailDrawPointMode,
  activateAdvancedTrailDrawLineMode,
  activateAdvancedTrailDrawPolygonMode
} from '~/packages/Drawing';
import { 
  activateSelectMode, 
  activateAdvancedSelectMode,
  activateRectSelectionMode,
  activateCircleSelectionMode,
  activatePolygonSelectionMode,
  clearSelectLayer,
  getSelectedFeatures
} from '~/packages/Selection';
import { activateTrailEditMode, activateTrailDeleteMode } from '~/packages/Editing';

const OSSMAPPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mapInfo' | 'layer' | 'drawing' | 'selection' | 'export'>('mapInfo');
  const [currentMode, setCurrentMode] = useState<string>('none');
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
  const [mapInfo, setMapInfo] = useState<any>({
    center: [127.0, 37.5],
    zoom: 10,
    bounds: null
  });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  
  // 기존 라이브러리 훅들 재사용
  const { getCenter, getZoom, getBounds } = useMapInfo(mapRef.current);
  const { panTo, resetView, rotate, fitBounds } = useMapPan(mapRef.current);
  const { prevScreen, forwardScreen } = useMapHistory(mapRef.current);
  const { exportMapImage, copyView } = useMapExport(mapRef.current);
  const { getLayer, getExternalLayerName, getTableNameOfLayer } = useLayerInfo();
  const { getSelectableFacility, viewLayerInfo, toggleDisplayHide, refreshLayer } = useLayerControl();


  // 지도 초기화
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([127.0, 37.5]),
        zoom: 10
      })
    });

    mapRef.current = map;
    
    // 전역 상태에 지도 등록
    useMapbase.getState().setMap(map);

    // 지도 이벤트 리스너
    map.on('moveend', () => updateMapInfo());
    map.on('zoomend', () => updateMapInfo());

    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, []);

  // 지도 정보 업데이트
  const updateMapInfo = () => {
    if (!mapRef.current) return;
    
    const centerResult = getCenter();
    const zoomResult = getZoom();
    const boundsResult = getBounds();
    
    if (centerResult.success && zoomResult.success) {
      setMapInfo({
        center: centerResult.data?.center || [127.0, 37.5],
        zoom: zoomResult.data?.current || 10,
        bounds: boundsResult.success ? boundsResult.data : null
      });
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  // ===== 지도 정보 탭 기능들 =====
  const handleGetCenter = () => {
    const result = getCenter();
    if (result.success) {
      alert(`현재 중심점: [${result.data?.center?.join(', ')}]\n위도: ${result.data?.lat}\n경도: ${result.data?.lng}`);
    } else {
      alert('중심점 조회 실패: ' + result.message);
    }
  };

  const handleGetZoom = () => {
    const result = getZoom();
    if (result.success) {
      alert(`현재 줌: ${result.data?.current}\n최소: ${result.data?.min}\n최대: ${result.data?.max}`);
    } else {
      alert('줌 레벨 조회 실패: ' + result.message);
    }
  };

  const handleMoveToCenter = () => {
    panTo({ center: [127.0, 37.5], zoom: 15, duration: 1000 });
  };

  const handlePrevScreen = () => {
    prevScreen(800);
  };

  const handleForwardScreen = () => {
    forwardScreen(800);
  };

  // ===== 레이어 관리 탭 기능들 =====
  const handleGetLayer = async () => {
    try {
      const result = await getLayer('polygonHump');
      if (result.success) {
        alert(`레이어 정보: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        alert('레이어 조회 실패: ' + result.message);
      }
    } catch (error) {
      alert('레이어 조회 중 오류: ' + error);
    }
  };

  const handleToggleLayer = async () => {
    try {
      const result = await toggleDisplayHide('polygonHump');
      if (result.success) {
        alert(result.message);
      } else {
        alert('레이어 토글 실패: ' + result.message);
      }
    } catch (error) {
      alert('레이어 토글 중 오류: ' + error);
    }
  };

  const handleSetLayerOpacity = async () => {
    alert('스타일 설정 기능은 추후 구현 예정입니다.');
  };

  // ===== 그리기/측정 탭 기능들 =====
  const handleTrailDrawPoint = () => {
    if (!mapRef.current) return;
    setCurrentMode('trail-draw-point');
    activateTrailDrawPointMode({
      showNodeTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
        alert(`점 그리기 완료!\n좌표: [${coordinate.join(', ')}]`);
      },
      setDrawnFeature: (feature: any) => {
        console.log('그린 피처:', feature);
      }
    });
  };

  const handleTrailDrawLine = () => {
    if (!mapRef.current) return;
    setCurrentMode('trail-draw-line');
    activateTrailDrawLineMode({
      showLineTypeSelectorPopup: (coordinate: number[], pixel: number[]) => {
        alert(`선 그리기 완료!\n좌표: [${coordinate.join(', ')}]`);
      },
      setDrawnFeature: (feature: any) => {
        console.log('그린 피처:', feature);
      }
    });
  };

  const handleTrailDistance = () => {
    if (!mapRef.current) return;
    setCurrentMode('trail-distance');
    activateTrailDistanceMode(mapRef.current);
  };

  const handleTrailArea = () => {
    if (!mapRef.current) return;
    setCurrentMode('trail-area');
    activateTrailAreaMode(mapRef.current);
  };

  const handleAreaDrawRect = () => {
    if (!mapRef.current) return;
    setCurrentMode('area-draw-rect');
    activateAreaDrawRectMode({
      style: {
        color: 'red',
        fillColor: 'blue',
        weight: 4,
        fill: true,
        fillOpacity: 0.4,
      },
    });
  };

  // ===== 선택/편집 탭 기능들 =====
  const handleSelect = () => {
    if (!mapRef.current) return;
    setCurrentMode('select');
    activateSelectMode(mapRef.current);
  };

  const handleAdvancedSelect = () => {
    if (!mapRef.current) return;
    setCurrentMode('advanced-select');
    activateAdvancedSelectMode(mapRef.current);
  };

  const handleRectSelection = () => {
    if (!mapRef.current) return;
    setCurrentMode('rect-selection');
    activateRectSelectionMode(mapRef.current);
  };

  const handleClearSelection = () => {
    clearSelectLayer();
    setSelectedFeatures([]);
    alert('선택된 피처들이 초기화되었습니다.');
  };

  const handleGetSelectedFeatures = () => {
    const result = getSelectedFeatures();
    if (result.success) {
      if (result.count > 0) {
        setSelectedFeatures(result.features || []);
        alert(`선택된 피처 ${result.count}개:\n${JSON.stringify(result.features, null, 2)}`);
      } else {
        alert('선택된 피처가 없습니다.');
      }
    } else {
      alert('오류 발생: ' + result.message);
    }
  };

  // ===== 내보내기 탭 기능들 =====
  const handleExportMapImage = () => {
    const result = exportMapImage();
    if (result.success) {
      alert('지도 이미지가 다운로드되었습니다!');
    } else {
      alert('이미지 내보내기 실패: ' + result.message);
    }
  };

  const handleCopyView = () => {
    const result = copyView();
    if (result.success) {
      alert('현재 지도 상태가 클립보드에 복사되었습니다.');
    } else {
      alert('복사 실패: ' + result.message);
    }
  };

  // 모드 취소
  const handleCancelMode = () => {
    setCurrentMode('none');
    // 모든 모드 비활성화
    clearSelectLayer();
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#f5f5f5',
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif'
    }}>
      {/* 헤더 */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#333'
          }}>
            OSSMAP - Map Control Center
          </h1>
          <span style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            운영 모드
          </span>
          {currentMode !== 'none' && (
            <span style={{
              background: '#fff3cd',
              color: '#856404',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              현재 모드: {currentMode}
            </span>
          )}
        </div>
        
        {/* 빠른 액션 버튼들 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentMode !== 'none' && (
            <button
              onClick={handleCancelMode}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              모드 취소
            </button>
          )}
          <button
            onClick={handlePrevScreen}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            이전
          </button>
          <button
            onClick={handleForwardScreen}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            다음
          </button>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { id: 'mapInfo', label: '지도 정보', icon: '🗺️' },
            { id: 'layer', label: '레이어 관리', icon: '📊' },
            { id: 'drawing', label: '그리기/측정', icon: '✏️' },
            { id: 'selection', label: '선택/편집', icon: '👆' },
            { id: 'export', label: '내보내기', icon: '📤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as typeof activeTab)}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #1976d2' : '3px solid transparent',
                color: activeTab === tab.id ? '#1976d2' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* 사이드바 */}
        <div style={{
          width: '320px',
          background: '#fff',
          borderRight: '1px solid #e0e0e0',
          overflow: 'auto'
        }}>
          <div style={{ padding: '24px' }}>
            {activeTab === 'mapInfo' && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                  지도 정보
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <strong>현재 위치:</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      [{mapInfo.center.join(', ')}]
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <strong>줌 레벨:</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      현재: {mapInfo.zoom}
                    </div>
                  </div>
                  <button
                    onClick={handleGetCenter}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    중심점 조회
                  </button>
                  <button
                    onClick={handleGetZoom}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    줌 레벨 조회
                  </button>
                  <button
                    onClick={handleMoveToCenter}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    서울로 이동
                  </button>
                  <button
                    onClick={() => resetView()}
                    style={{
                      padding: '8px 16px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    초기 위치로
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'layer' && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                  레이어 관리
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleGetLayer}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    레이어 정보 조회
                  </button>
                  <button
                    onClick={handleToggleLayer}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    레이어 표시/숨김
                  </button>
                  <button
                    onClick={handleSetLayerOpacity}
                    style={{
                      padding: '8px 16px',
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    투명도 설정 (50%)
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'drawing' && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                  그리기/측정
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleTrailDrawPoint}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    점 그리기
                  </button>
                  <button
                    onClick={handleTrailDrawLine}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    선 그리기
                  </button>
                  <button
                    onClick={handleTrailDistance}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    거리 측정
                  </button>
                  <button
                    onClick={handleTrailArea}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    면적 측정
                  </button>
                  <button
                    onClick={handleAreaDrawRect}
                    style={{
                      padding: '8px 16px',
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    사각형 그리기
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'selection' && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                  선택/편집
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleSelect}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    기본 선택
                  </button>
                  <button
                    onClick={handleAdvancedSelect}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    고급 선택
                  </button>
                  <button
                    onClick={handleRectSelection}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    영역 선택
                  </button>
                  <button
                    onClick={handleGetSelectedFeatures}
                    style={{
                      padding: '8px 16px',
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    선택된 피처 조회
                  </button>
                  <button
                    onClick={handleClearSelection}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    선택 초기화
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'export' && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                  내보내기
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleExportMapImage}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    지도 이미지 저장
                  </button>
                  <button
                    onClick={handleCopyView}
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    현재 상태 복사
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 지도 영역 */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>

      {/* 상태바 */}
      <div style={{
        background: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        padding: '8px 24px',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span>현재 좌표: [{mapInfo.center.join(', ')}]</span>
          <span style={{ marginLeft: '16px' }}>줌 레벨: {mapInfo.zoom}</span>
        </div>
        <div>
          <span>선택된 피처: {selectedFeatures.length}개</span>
          <span style={{ marginLeft: '16px' }}>현재 모드: {currentMode}</span>
        </div>
      </div>
    </div>
  );
};

export default OSSMAPPage; 