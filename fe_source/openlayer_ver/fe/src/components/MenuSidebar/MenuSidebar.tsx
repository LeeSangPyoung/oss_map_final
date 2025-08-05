import React, { ReactNode, useEffect, useState } from 'react';
import menuIcon from '/images/efdg/menu_btn.png';
import leftMenu01 from '/images/efdg/left_menu_01.png';
import leftMenu01Active from '/images/efdg/left_menu_01_hover.png';
import leftMenu10 from '/images/efdg/left_menu_10.png';
import leftMenu10Active from '/images/efdg/left_menu_10_hover.png';
import leftMenu07 from '/images/efdg/left_menu_07.png';
import leftMenu07Active from '/images/efdg/left_menu_07_hover.png';
import leftMenu08 from '/images/efdg/left_menu_08.png';
import leftMenu08Active from '/images/efdg/left_menu_08_hover.png';
import leftMenu06 from '/images/efdg/left_menu_06.png';
import leftMenu06Active from '/images/efdg/left_menu_06_hover.png';
import cx from 'classnames';
import { useBoolean, useOnClickOutside } from 'usehooks-ts';
import { LeftOutlined } from '@ant-design/icons';
import { useFeatureInfoStore } from '~/store/useFeatureInfoStore';
import PlaceIcon from '/images/place_search_icon.png';
import SKT_image from '/images/SKT_Bundang_Building.jpg';
import PlaceInfoPanel from '../PlaceInfoPanel/PlaceInfoPanel';
interface MenuItem {
  key: string;
  label?: string | null;
  icon?: React.ReactNode;
  iconActive?: React.ReactNode;
  children?: MenuItem[];
  element?: ReactNode;
}
const items: MenuItem[] = [
  {
    key: 'menu',
    label: null,
    icon: <img src={menuIcon} className="size-[57px] object-cover" />,
    iconActive: <img src={menuIcon} className="size-[57px] object-cover" />,
    children: [
      { label: 'Menu 1', key: '1-1' },
      { label: 'Menu 2', key: '1-2' },
      { label: 'Menu 3', key: '1-3' },
      { label: 'Menu 4', key: '1-4' },
    ],
  },
  {
    key: 'layer',
    label: null,
    icon: <img src={leftMenu01} className="size-[57px] object-cover" />,
    iconActive: <img src={leftMenu01Active} className="size-[57px] object-cover" />,
  },
  {
    key: '33',
    label: null,
    icon: <img src={leftMenu10} className="size-[57px] object-cover" />,
    iconActive: <img src={leftMenu10Active} className="size-[57px] object-cover" />,
  },
  {
    key: '44',
    label: null,
    icon: <img src={leftMenu07} className="size-[57px] object-cover" />,
    iconActive: <img src={leftMenu07Active} className="size-[57px] object-cover" />,
  },
  {
    key: '55',
    label: null,
    icon: <img src={leftMenu08} className="size-[57px] object-cover" />,
    iconActive: <img src={leftMenu08Active} className="size-[57px] object-cover" />,
  },
  {
    key: '66',
    label: null,
    icon: <img src={leftMenu06} className="size-[57px] object-cover" />,
    iconActive: <img src={leftMenu06Active} className="size-[57px] object-cover" />,
  },
  {
    key: 'feature',
    label: 'Search Result',
    icon: <div className="relative mx-2 mt-1 size-10 rounded-lg bg-white"></div>,
    iconActive: (
      <div className="relative mx-1 size-12 overflow-hidden rounded-lg border-2 border-blue-500 bg-transparent p-1 text-sm text-white">
        <div className="size-full">
          <img src={SKT_image} alt="Place Image" className="size-full rounded-md" />
        </div>
      </div>
    ),
    element: <PlaceInfoPanel />,
  },
];
export default function MenuSidebar() {
  const [activeKey, setActiveKey] = useState('');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { value: opened, toggle, setTrue: openSidebar } = useBoolean(false);
  const ref = React.useRef(null);
  const { featureInfo } = useFeatureInfoStore();

  const handleOutSideClick = () => {
    setShowSubMenu(false);
  };

  useEffect(() => {
    if (!!featureInfo) {
      setActiveKey('feature');
      openSidebar();
    }
  }, [featureInfo]);

  useOnClickOutside(ref, handleOutSideClick);

  const handleSetActive = (key: string) => () => {
    setActiveKey(key);
    if (key === 'menu') {
      setShowSubMenu(key === 'menu');
    } else {
      openSidebar();
    }
  };
  return (
    <div className="flex h-screen">
      <div className="flex h-full w-[57px] flex-col gap-y-4 bg-[#1f1f2a] overflow-y-auto">
        {items.map(item => {
          return (
            <div key={item.key} onClick={handleSetActive(item.key)} className="relative cursor-pointer">
              {item.key === activeKey ? item.iconActive : item.icon}
              <div
                className={cx(
                  'absolute top-0 left-[57px] z-[10] shadow-lg bg-white rounded  transition-all duration-[5000] flex flex-col',
                  {
                    'w-[200px] opacity-1': showSubMenu,
                    'w-0 opacity-0': !showSubMenu,
                  },
                )}
                ref={ref}
              >
                {showSubMenu &&
                  item.children &&
                  item.children.map(child => (
                    <div
                      key={child.key}
                      className="flex cursor-pointer gap-x-2  p-2 transition-colors duration-300 hover:bg-slate-400"
                    >
                      {child.label}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={cx('relative z-20 h-full bg-[#dce0e4] transition-all rounded-r', {
          'w-[350px] ': opened,
          'w-[10px]': !opened,
        })}
      >
        {items.map(item => {
          if (item.key === activeKey) {
            return (
              <div key={item.key} className="size-full">
                {opened && item.element}
              </div>
            );
          }
        })}
        <button
          className="absolute right-0 top-1/2 z-[99] flex -translate-y-1/2 translate-x-full items-center justify-center rounded-r bg-gray-200 px-1 py-8 text-black"
          onClick={() => {
            toggle();
            setActiveKey('');
          }}
        >
          <LeftOutlined
            className={cx('transition-all duration-300', {
              'rotate-0': opened,
              'rotate-180': !opened,
            })}
          />
        </button>
      </div>
    </div>
  );
}
