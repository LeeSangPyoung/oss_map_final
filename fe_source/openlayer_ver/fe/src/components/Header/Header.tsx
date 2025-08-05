import React from 'react';

export default function Header() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        padding: '10px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        zIndex: 10,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 14,
          background: '#1a2a3a',
          marginRight: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        }}
      >
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
      </span>
      <span
        style={{
          fontWeight: 800,
          fontSize: 25,
          letterSpacing: '0.12em',
          color: '#222',
          fontFamily: 'SF Pro Display, Pretendard, Noto Sans KR, Apple SD Gothic Neo, sans-serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.04)',
          userSelect: 'none',
          marginLeft: 2,
        }}
      >
        OSSMap
      </span>
    </div>
  );
}
