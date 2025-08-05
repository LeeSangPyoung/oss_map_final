import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeExamplePanelProps {
  codeBlockType: string | null;
  codeContent?: string;
  onRun?: () => void;
  onClose?: () => void;
  isActive?: boolean;
}

const getLayerCode = `// 레이어 정보 가져오기 예시\nconst layer = map.getLayers().getArray().find(l => l.get('id') === 'mvt-image');\nconsole.log(layer);\n// 또는 WMS 레이어의 source 파라미터 확인\nconsole.log(layer.getSource().getParams());`;

const centerCode = `import proj4 from 'proj4';

const handleGetCenter = () => {
  if (mapRef.current) {
    const coordinate = mapRef.current.getView().getCenter();
    if (coordinate) {
      const latLng = proj4('EPSG:3857', 'EPSG:4326', coordinate);
      alert('Center: [' + latLng[1] + ', ' + latLng[0] + ']');
    }
  }
};`;

const CodeExamplePanel: React.FC<CodeExamplePanelProps> = ({ codeBlockType, codeContent, onRun, onClose, isActive }) => {
  if (!codeBlockType) return null;
  
  // codeContent가 있으면 그것을 사용, 없으면 기본 코드 사용
  let codeSample = codeContent || '';
  if (!codeContent) {
    if (codeBlockType === 'getLayer') codeSample = getLayerCode;
    if (codeBlockType === 'center') codeSample = centerCode;
  }
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        background: '#1e1e1e',
        padding: 0,
        borderRadius: 12,
        maxWidth: 800,
        minWidth: 340,
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.98)',
        transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)',
        pointerEvents: isActive ? 'auto' : 'none',
        animation: isActive ? 'slideInCodeBlock 0.5s cubic-bezier(.4,0,.2,1)' : undefined,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#222',
          padding: '14px 32px 10px 32px',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 600,
            fontSize: 17,
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {codeBlockType === 'getLayer' ? 'Get Layer 코드 예시' : 
           codeBlockType === 'center' ? 'Get Screen Center Point 코드 예시' : 
           codeBlockType === 'setThematics' ? 'Set Thematics 코드 예시' :
           codeBlockType ? `${codeBlockType} 코드 예시` : ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onRun}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginRight: 8,
              marginLeft: 18,
              transition: 'background 0.18s, color 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              outline: 'none',
              padding: 0,
              fontSize: 18,
            }}
            aria-label="실행"
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.32)';
              e.currentTarget.style.color = '#0071e3';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.color = '#fff';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="5,3 13,8 5,13" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: 0,
              transition: 'background 0.18s, color 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              outline: 'none',
              padding: 0,
            }}
            aria-label="코드 닫기"
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.32)';
              e.currentTarget.style.color = '#222';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.color = '#fff';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div style={{ padding: 22, paddingTop: 0 }}>
        <SyntaxHighlighter
          language="tsx"
          style={vscDarkPlus}
          customStyle={{ borderRadius: 8, fontSize: 15, background: '#1e1e1e', margin: 0 }}
        >
          {codeSample}
        </SyntaxHighlighter>
      </div>
      <style>{`
        @keyframes slideInCodeBlock {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CodeExamplePanel; 