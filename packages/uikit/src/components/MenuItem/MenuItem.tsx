import React, { useContext, useRef, useEffect } from "react";
import { MenuContext } from "../../widgets/Menu/context";
import StyledMenuItem, { StyledMenuItemContainer } from "./styles";
import { MenuItemProps } from "./types";
import { useMatchBreakpoints } from "../../contexts";

const MenuItem: React.FC<React.PropsWithChildren<MenuItemProps>> = ({
  children,
  href,
  target = "_self",
  isActive = false,
  isDisabled = false,
  isGlobalSubMenu = false,
  isSecondaryMenu = false,
  variant = "default",
  isDark,
  scrollLayerRef,
  statusColor,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints();
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { linkComponent } = useContext(MenuContext);
  const itemLinkProps: any = href
    ? {
        as: linkComponent,
        href,
        target,
      }
    : {
        as: "div",
      };
  useEffect(() => {
    if (!isMobile || !isActive || !menuItemRef.current || !scrollLayerRef?.current) return;
    const scrollLayer = scrollLayerRef.current;
    const menuNode = menuItemRef.current.parentNode as HTMLDivElement;
    if (!menuNode) return;
    if (
      scrollLayer.scrollLeft > menuNode.offsetLeft ||
      scrollLayer.scrollLeft + scrollLayer.offsetWidth < menuNode.offsetLeft + menuNode.offsetWidth
    ) {
      scrollLayer.scrollLeft = menuNode.offsetLeft;
    }
  }, [isActive, isMobile, scrollLayerRef]);

  return (
    <StyledMenuItemContainer $isActive={isActive} $variant={variant} ref={menuItemRef}>
      <StyledMenuItem
        {...itemLinkProps}
        $isActive={isActive}
        $isDisabled={isDisabled}
        $variant={variant}
        $statusColor={statusColor}
        $isDark={isDark}
        $isGlobalSubMenu={isGlobalSubMenu}
        $isSecondaryMenu={isSecondaryMenu}
        {...props}
      >
        {children}
      </StyledMenuItem>
    </StyledMenuItemContainer>
  );
};

export default MenuItem;
