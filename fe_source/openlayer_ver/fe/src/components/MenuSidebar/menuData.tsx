// 메뉴 관련 상수 분리

import React from 'react';
import { FiMap, FiLayers, FiEdit3 } from 'react-icons/fi';

export function getMenuIcon(type: string) {
  switch (type) {
    case 'map':
      return <FiMap size={18} color="#888" style={{ marginRight: 8, verticalAlign: 'middle', opacity: 0.85 }} />;
    case 'layers':
      return <FiLayers size={18} color="#888" style={{ marginRight: 8, verticalAlign: 'middle', opacity: 0.85 }} />;
    case 'edit':
      return <FiEdit3 size={18} color="#888" style={{ marginRight: 8, verticalAlign: 'middle', opacity: 0.85 }} />;
    default:
      return null;
  }
}

export const menuItems = [
  { label: '개발자가이드', href: '/guide' },
  { label: 'OSSMAP', href: '/ossmap' },
];

export const treeData = [
  {
    group: '지도 정보/이동',
    iconType: 'map',
    children: [
      'Get Screen Center Point',
      'Get Current Zoom Level',
      'Get Minimum Zoom Level',
      'Get Max Zoom Level',
      'Move center point',
      'Move Center Point and Change Level',
      'Move area',
      'Previous Screen',
      'Forward Screen',
      'Zoom In Map',
      'Zoom out Map',
      'Adjust Scale',
      'Pan By (픽셀 단위 이동)',
      'Pan To (애니메이션 중심+줌 이동)',
      'Fit Bounds (범용 영역 맞춤)',
      'Get Current Extent (현재 화면 extent 반환)',
      'Set Zoom (애니메이션)',
    ],
  },
  {
    group: '레이어 정보/관리',
    iconType: 'layers',
    children: [
      'Get Layer',
      'External Layer Name',
      'Table Name of Layer',
      'Minimum Display Zoom Level',
      'Maximum Display Zoom Level',
      'Selectable Facility',
      'View Layer Information',
      'Toggle Display/Hide',
      'Refresh Layer',
      'Add User Layer Feature',
      'Initialize User Layer',
      'Delete User Layer',
      'Entire Area of User Layer', // 바로 아래에 위치
      'Default Right-Click Menu Configuration',
      'Edit Mode Right-Click Menu Configuration',
      'Set Layer Display Level',
      'Set Layer Style',
      'Set Layer Style Default',
      'Set Thematics',
      'Set Layer Opacity (레이어 투명도 설정)',
      'Get Layer Opacity (레이어 투명도 조회)',
      'Reset Layer Opacity (레이어 투명도 초기화)',
    ],
  },
  {
    group: '드로잉/측정/선택',
    iconType: 'edit',
    children: [
      'Select',
      'Advanced Select',
      'Rect Selection',
      'Circle Selection',
      'Polygon Selection',
      'Clear select layer',
      'Trail Distance',
      'Advanced Trail Distance',
      'Trail Area',
      'Advanced Trail Area',
      'Trail Edit',
      'Trail Delete',
      'Trail Simple',
      'Area Draw Rect',
      'Area Draw Circle',
      'Area Draw Polygon',
                'Trail Draw Point',
          'Advanced Trail Draw Point',
          'Trail Draw Line',
          'Advanced Trail Draw Line',
          'Trail Draw Polygon',
          'Advanced Trail Draw Polygon',
      'Get Selected Features',
      'Get Trail coordinate',
    ],
  },
];

export const highlightMoveMenu = [
  'Pan By (픽셀 단위 이동)',
  'Pan To (애니메이션 중심+줌 이동)',
  'Fit Bounds (범용 영역 맞춤)',
  'Get Current Extent (현재 화면 extent 반환)',
  'Set Zoom (애니메이션)',
  'Reset View (초기화)',
  'Copy View State (클립보드 복사)',
  'Rotate Map (지도 회전)',
];

export const blueMoveMenu = [
  'Export Map as Image (지도 이미지 저장)'
];

export const moveMenu = [
  'Get Screen Center Point',
  'Get Current Zoom Level',
  'Get Minimum Zoom Level',
  'Get Max Zoom Level',
  'Move center point',
  'Move Center Point and Change Level',
  'Move area',
  'Previous Screen',
  'Forward Screen',
  'Zoom In Map',
  'Zoom out Map',
  'Adjust Scale',
  'Pan By (픽셀 단위 이동)',
  'Pan To (애니메이션 중심+줌 이동)',
  'Fit Bounds (범용 영역 맞춤)',
  'Get Current Extent (현재 화면 extent 반환)',
  'Set Zoom (애니메이션)',
  'Reset View (초기화)',
  'Copy View State (클립보드 복사)',
  'Rotate Map (지도 회전)',
  'Export Map as Image (지도 이미지 저장)',
]; 