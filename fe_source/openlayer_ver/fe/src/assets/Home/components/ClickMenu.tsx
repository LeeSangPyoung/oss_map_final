import React from 'react';
import { Menu, Item } from 'react-contexify';
import { MenuItem } from '~/models/MenuItem';

interface ClickMenuProps {
  menuId: string;
  options: MenuItem[];
}

const ClickMenu: React.FC<ClickMenuProps> = props => {
  const { menuId, options } = props;
  return (
    <Menu id={menuId}>
      {options.map(item => {
        const { label, onClick } = item;
        return (
          <Item key={label} onClick={onClick}>
            {label}
          </Item>
        );
      })}
    </Menu>
  );
};

export default ClickMenu;
