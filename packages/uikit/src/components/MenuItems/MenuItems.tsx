/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, memo } from "react";
import { Flex } from "../Box";
import isTouchDevice from "../../util/isTouchDevice";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import MenuItem from "../MenuItem/MenuItem";
import { MenuItemsProps } from "./types";

const MenuItems: React.FC<React.PropsWithChildren<MenuItemsProps>> = ({
  items = [],
  activeItem,
  activeSubItem,
  isDark,
  isSecondaryMenu,
  ...props
}) => {
  return (
    <Flex height="100%" {...props}>
      {items.map(({ label, items: menuItems = [], href, icon, disabled, target }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color;
        const isActive = activeItem === href;
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href };
        const Icon = icon;
        return (
          <DropdownMenu key={`${label}#${href}`} items={menuItems} activeItem={activeSubItem} isDisabled={disabled}>
            <MenuItem
              {...linkProps}
              isDark={isDark}
              isActive={isActive}
              statusColor={statusColor}
              isDisabled={disabled}
              target={target}
              isSecondaryMenu={isSecondaryMenu}
            >
              {label || (icon && createElement(Icon as any, { color: isActive ? "secondary" : "textSubtle" }))}
            </MenuItem>
          </DropdownMenu>
        );
      })}
    </Flex>
  );
};

export default memo(MenuItems);
