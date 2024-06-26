import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled, { DefaultTheme } from "styled-components";
import { FlexProps } from "styled-system";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

interface ThemedUserMenuProps extends FlexProps {
  $isOpen?: boolean;
  theme: DefaultTheme;
}

export const StyledUserMenu = styled(Flex)<ThemedUserMenuProps>`
  align-items: center;
  background: ${({ theme }) => theme.colors.gradientGreenOrange};
  border-radius: 16px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  height: 32px;
  padding-left: 32px;
  padding-right: 8px;
  position: relative;
  margin: 8px 12px;
  border-radius: 5px;
`;

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: none;
  font-weight: 500;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  padding-left: 8px;
  padding-right: 8px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  avatarClassName,
  variant = variants.DEFAULT,
  children,
  disabled,
  placement = "bottom-end",
  recalculatePopover,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  const { styles, attributes, update } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement,
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  // recalculate the popover position
  useEffect(() => {
    if (recalculatePopover && isOpen && update) update();
  }, [isOpen, update, recalculatePopover]);

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        $isOpen={isOpen}
        onTouchStart={() => {
          setIsOpen((s) => !s);
        }}
      >
        <MenuIcon className={avatarClassName} avatarSrc={avatarSrc} variant={variant} />
        <LabelText title={typeof text === "string" ? text || account : account}>{text || accountEllipsis}</LabelText>
        {!disabled && <ChevronDownIcon color="white" width="24px" />}
      </StyledUserMenu>
      {!disabled && (
        <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
          <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
        </Menu>
      )}
    </Flex>
  );
};

export default UserMenu;
