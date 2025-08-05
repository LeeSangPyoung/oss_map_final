import React, { useState, useEffect } from 'react';
import { Checkbox, Collapse, Button, Tooltip } from 'antd';
import { FiLayers, FiEye, FiEyeOff, FiSettings } from 'react-icons/fi';
import { useGetLayerList } from '~/packages/Home/services/useGetLayers';
import { useMapbase } from '~/store/useMapbase';

const { Panel } = Collapse;

interface LayerControlProps {
  isVisible: boolean;
  onToggle: () => void;
  layerData?: any[];
  checkedLayers: string[];
  onLayerChange: (checkedValues: any) => void;
  onShowAllLayers: () => void;
  onHideAllLayers: () => void;
  position?: { x: number; y: number };
  onDragStart?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  hasMoved?: boolean;
}

interface LayerInfo {
  id: string;
  name: string;
  value: string;
  visible: boolean;
  selectable: boolean;
  alias?: string;
  tableName?: string;
  minZoom?: number;
  maxZoom?: number;
}

const LayerControl: React.FC<LayerControlProps> = ({ 
  isVisible, 
  onToggle, 
  layerData, 
  checkedLayers, 
  onLayerChange, 
  onShowAllLayers, 
  onHideAllLayers,
  position = { x: window.innerWidth - 340, y: window.innerHeight / 2 - 200 },
  onDragStart,
  isDragging = false,
  hasMoved = false
}) => {
  const [layerInfos, setLayerInfos] = useState<LayerInfo[]>([]);

  // 레이어 타입 분류 함수
  const getLayerType = (layerName: string) => {
    if (layerName.startsWith('node')) return 'point';
    if (layerName.startsWith('link')) return 'line';
    if (layerName.startsWith('polygon')) return 'polygon';
    return 'other';
  };

  useEffect(() => {
    if (layerData) {
      // 레이어 정보 설정
      const infos = layerData
        .filter(layer => layer.value && layer.label)
        .map(layer => ({
          id: String(layer.id || layer.value),
          name: String(layer.label || layer.value),
          value: String(layer.value),
          visible: layer.visible || false,
          selectable: layer.selectable || false,
          alias: layer.alias,
          tableName: layer.tableName,
          minZoom: layer.minZoom,
          maxZoom: layer.maxZoom
        }));
      setLayerInfos(infos);
    }
  }, [layerData]);

  const handleLayerCheckboxChange = (checkedValues: any) => {
    console.log('LayerControl handleLayerCheckboxChange:', checkedValues);
    onLayerChange(checkedValues);
  };

  const handleShowAllLayers = () => {
    onShowAllLayers();
  };

  const handleHideAllLayers = () => {
    console.log('LayerControl handleHideAllLayers clicked');
    onHideAllLayers();
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'point':
        return '📍';
      case 'line':
        return '➖';
      case 'polygon':
        return '⬜';
      default:
        return '📄';
    }
  };

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
        }}
      >
        <Tooltip title="레이어 컨트롤 (드래그하여 이동)" placement="left">
          <div
            onMouseDown={(e) => {
              if (onDragStart) {
                onDragStart(e);
              }
            }}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<FiLayers style={{ pointerEvents: 'none' }} />}
              onClick={(e) => {
                // 드래그하지 않았을 때만 토글 실행
                if (!hasMoved) {
                  onToggle();
                }
              }}
              style={{
                width: 48,
                height: 48,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            />
          </div>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 320), // 패널이 화면 밖으로 나가지 않도록
        top: position.y,
        width: 320,
        maxHeight: '80vh',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
    >
      {/* 헤더 - 드래그 핸들 */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={(e) => {
          if (onDragStart) {
            onDragStart(e);
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <FiLayers style={{ color: '#1890ff', pointerEvents: 'none' }} />
          <span style={{ fontWeight: 600, fontSize: '16px' }}>레이어 컨트롤</span>
          <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>드래그하여 이동</span>
        </div>
        <Button
          type="text"
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // 버튼 클릭 시 드래그 방지
            onToggle();
          }}
          style={{ padding: '4px' }}
        >
          ✕
        </Button>
      </div>

      {/* 컨트롤 버튼 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          gap: '8px',
        }}
      >
        <Button
          size="small"
          onClick={handleShowAllLayers}
          style={{ flex: 1 }}
        >
          <FiEye style={{ marginRight: '4px', pointerEvents: 'none' }} />
          모두 보기
        </Button>
        <Button
          size="small"
          onClick={handleHideAllLayers}
          style={{ flex: 1 }}
        >
          <FiEyeOff style={{ marginRight: '4px', pointerEvents: 'none' }} />
          모두 숨기기
        </Button>
      </div>

      {/* 레이어 목록 */}
      <div
        style={{
          maxHeight: 'calc(80vh - 120px)',
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        <Checkbox.Group
          value={checkedLayers}
          onChange={handleLayerCheckboxChange}
          style={{ width: '100%' }}
        >
          {(() => { console.log('LayerControl checkedLayers:', checkedLayers); return null; })()}
          <Collapse
            defaultActiveKey={['points', 'lines', 'polygons']}
            ghost
            style={{ backgroundColor: 'transparent' }}
          >
            {/* 포인트 레이어 */}
            <Panel
              header={
                <span style={{ fontWeight: 600, color: '#1890ff' }}>
                  📍 포인트 레이어
                </span>
              }
              key="points"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layerData
                  ?.filter(layer => layer.value && getLayerType(layer.value) === 'point')
                  .map(layer => (
                    <Checkbox
                      key={layer.value}
                      value={layer.value}
                      style={{ marginLeft: 0 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getLayerIcon('point')}</span>
                        <span>{layer.label || layer.value}</span>
                      </div>
                    </Checkbox>
                  ))}
              </div>
            </Panel>

            {/* 라인 레이어 */}
            <Panel
              header={
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                  ➖ 라인 레이어
                </span>
              }
              key="lines"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layerData
                  ?.filter(layer => layer.value && getLayerType(layer.value) === 'line')
                  .map(layer => (
                    <Checkbox
                      key={layer.value}
                      value={layer.value}
                      style={{ marginLeft: 0 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getLayerIcon('line')}</span>
                        <span>{layer.label || layer.value}</span>
                      </div>
                    </Checkbox>
                  ))}
              </div>
            </Panel>

            {/* 폴리곤 레이어 */}
            <Panel
              header={
                <span style={{ fontWeight: 600, color: '#fa8c16' }}>
                  ⬜ 폴리곤 레이어
                </span>
              }
              key="polygons"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layerData
                  ?.filter(layer => layer.value && getLayerType(layer.value) === 'polygon')
                  .map(layer => (
                    <Checkbox
                      key={layer.value}
                      value={layer.value}
                      style={{ marginLeft: 0 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getLayerIcon('polygon')}</span>
                        <span>{layer.label || layer.value}</span>
                      </div>
                    </Checkbox>
                  ))}
              </div>
            </Panel>
          </Collapse>
        </Checkbox.Group>
      </div>

      {/* 푸터 */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          fontSize: '12px',
          color: '#666',
        }}
      >
        선택된 레이어: {checkedLayers.length}개
      </div>
    </div>
  );
};

export default LayerControl; 