import React, { useRef } from 'react';
import eraseIcon from '/images/efdg/dsgmenu02_list_01.png';
import zoomInIcon from '/images/efdg/dsgmenu02_list_02.png';
import zoomOutIcon from '/images/efdg/dsgmenu02_list_03.png';
import selectIcon from '/images/efdg/dsgmenu02_list_04.png';
import selectionIcon from '/images/efdg/dsgmenu02_list_05.png';
import circleSelectionIcon from '/images/efdg/dsgmenu02_list_05_01.png';
import polygonSelectionIcon from '/images/efdg/dsgmenu02_list_05_03.png';
import showLayerIcon from '/images/efdg/dsgmenu02_list_09.png';
import hideLayerIcon from '/images/efdg/dsgmenu02_list_10.png';
import deleteIcon from '/images/efdg/delete.png';
import { useHover } from 'usehooks-ts';
import cx from 'classnames';
import { Popover } from 'antd';

const buttons = [
  {
    key: 'clear',
    icon: eraseIcon,
    hasTooltip: false,
  },
  {
    key: 'zoomIn',
    icon: zoomInIcon,
    hasTooltip: false,
  },
  {
    key: 'zoomOut',
    icon: zoomOutIcon,
    hasTooltip: false,
  },
  {
    key: 'select',
    icon: selectIcon,
    hasTooltip: false,
  },
  {
    key: 'selection',
    icon: selectionIcon,
    hasTooltip: true,
    children: [
      { key: 'circle', icon: circleSelectionIcon },
      { key: 'rectangle', icon: selectionIcon },
      { key: 'polygon', icon: polygonSelectionIcon },
    ],
  },
  {
    key: 'delete',
    icon: deleteIcon,
    hasTooltip: false,
  },
  {
    key: 'showLayer',
    icon: showLayerIcon,
    hasTooltip: false,
  },
  {
    key: 'hideLayer',
    icon: hideLayerIcon,
    hasTooltip: false,
  },
];

interface Props {
  icon: string;
  alt?: string;
  onClick?: () => void;
  hasTooltip?: boolean;
  children?: any;
}

const ToolbarItem = ({ icon, alt, onClick, hasTooltip, children }: Props) => {
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef);
  if (hasTooltip) {
    const renderContent = () => {
      return (
        <div className="flex flex-col">
          {children.map((child: any) => (
            <ToolbarItem key={child.key} icon={child.icon} hasTooltip={false} />
          ))}
        </div>
      );
    };
    return (
      <Popover
        trigger={'click'}
        arrow={false}
        content={renderContent}
        placement="bottomLeft"
        overlayInnerStyle={{
          padding: 0,
        }}
        overlayStyle={{
          top: '83px',
        }}
      >
        <button className="relative transition-all duration-300" ref={hoverRef} onClick={onClick}>
          <img src={icon} alt={alt} />
          <div
            className={cx('z-9 absolute left-0 top-0 size-full', {
              'bg-white/20': isHover,
            })}
          />
        </button>
      </Popover>
    );
  }
  return (
    <button className="relative transition-all duration-300" ref={hoverRef} onClick={onClick}>
      <img src={icon} alt={alt} />
      <div
        className={cx('z-9 absolute left-0 top-0 size-full', {
          'bg-white/20': isHover,
        })}
      />
    </button>
  );
};

export default function Toolbar() {
  return (
    <div className="flex w-full items-center justify-end  gap-x-1 bg-[#404051] pr-20">
      {buttons.map((btn, idx) => (
        <ToolbarItem
          key={btn.key}
          icon={btn.icon}
          alt={idx.toString()}
          hasTooltip={btn.hasTooltip}
          children={btn.children}
        />
      ))}
    </div>
  );
}
