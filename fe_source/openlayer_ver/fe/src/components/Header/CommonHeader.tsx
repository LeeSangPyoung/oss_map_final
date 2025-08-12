import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapSelector } from '~/components/MapSelector/MapSelector';

interface CommonHeaderProps {
  title?: string;
  showNavigation?: boolean;
  currentPage?: 'main' | 'ossmap';
  showMapSelector?: boolean;
  onMapChange?: (mapType: string, tileUrl: string, customTileFunction?: any) => void;
  currentMapType?: string;
}

export default function CommonHeader({ 
  title = "OSSMAP", 
  showNavigation = true,
  currentPage = 'main',
  showMapSelector = false,
  onMapChange,
  currentMapType
}: CommonHeaderProps) {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    if (page === 'main') {
      navigate('/');
    } else if (page === 'ossmap') {
      navigate('/ossmap');
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      padding: '6px 18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #e5e5e7',
      zIndex: 1000,
      minHeight: '40px'
    }}>
      {/* 왼쪽: 로고 및 제목 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 14,
          background: '#1a2a3a',
          marginRight: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        }}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            <rect width="30" height="30" rx="10" fill="#1a2a3a" />
            <circle cx="15" cy="15" r="11" fill="#1a2a3a" stroke="#fff" strokeWidth="1.7" />
            <path
              d="M13.5 10.5c.5-1.5 2.5-2.5 4-1.5 1.5 1 1 2.5 0 3.5-.5.5-1.5.5-2 .5-.5 0-1.5.5-1.5 1.5s1 1.5 2 1.5c1 0 2 .5 2 1.5s-1 2-2 2c-1.5 0-2.5-1-2.5-2.5 0-1.5.5-2.5 1-3.5z"
              fill="#fff"
              fillOpacity="0.95"
            />
            <path d="M15 6a9 9 0 1 1 0 18" stroke="#bfc4cc" strokeWidth="1" fill="none" />
            <path d="M8 15a7 7 0 0 1 14 0" stroke="#bfc4cc" strokeWidth="0.9" fill="none" />
          </svg>
        </div>
        
        <h1 style={{
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: '0.12em',
          color: '#222',
          fontFamily: 'SF Pro Display, Pretendard, Noto Sans KR, Apple SD Gothic Neo, sans-serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.04)',
          userSelect: 'none',
          margin: 0
        }}>
          {title}
        </h1>
      </div>

      {/* 오른쪽: 네비게이션 및 추가 기능 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* 맵 선택기 */}
        {showMapSelector && onMapChange && currentMapType && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e5e5e7'
          }}>

            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#666'
            }}>
              베이스 맵:
            </span>
            <div style={{ width: '180px' }}>
              <MapSelector 
                onMapChange={onMapChange}
                currentMapType={currentMapType}
              />
            </div>
          </div>
        )}
        
        {/* 네비게이션 메뉴 */}
        {showNavigation && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid #e5e5e7'
          }}>
            <button
              onClick={() => handleNavigation('main')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                background: currentPage === 'main' ? '#007bff' : 'transparent',
                color: currentPage === 'main' ? '#ffffff' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              title="개발자가이드로 이동"
            >
              개발자가이드
            </button>
            <button
              onClick={() => handleNavigation('ossmap')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                background: currentPage === 'ossmap' ? '#007bff' : 'transparent',
                color: currentPage === 'ossmap' ? '#ffffff' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              title="OSSMAP 페이지로 이동"
            >
              OSSMAP
            </button>
          </nav>
        )}
      </div>
    </header>
  );
} 