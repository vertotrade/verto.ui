import React, { cloneElement, Children, ReactElement } from "react";
import styled, { DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { scales, variants } from "../Button/types";
import { ButtonMenuProps } from "./types";

interface StyledButtonMenuProps extends ButtonMenuProps {
  theme: DefaultTheme;
  noBg: boolean;
}

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  height: 40px;
  background-color: ${({ theme, noBg }) => !noBg ? theme.colors.inputBg : "transparent"};
  border-radius: 8px;
  display: ${({ fullWidth }) => (fullWidth ? "flex" : "inline-flex")};
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  padding: 4px;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.inputBorderHover};
  }

  & > button,
  & > a {
    flex: ${({ fullWidth }) => (fullWidth ? 1 : "auto")};
  }

  & > button + button,
  & > a + a {
    margin-left: 2px; // To avoid focus shadow overlap
  }

  & > button,
  & a {
    box-shadow: none;
  }

  ${({ disabled, theme }) => {
    if (disabled) {
      return `
        opacity: 0.5;

        & > button:disabled {
          background-color: transparent;
          color: ${theme.colors.textSubtle};
        }
    `;
    }
    return "";
  }}
  ${space}
`;

const ButtonMenu: React.FC<React.PropsWithChildren<ButtonMenuProps>> = ({
  activeIndex = 0,
  variant = variants.VERTO_GHOST,
  scale = scales.NEW_XS,
  onItemClick,
  disabled,
  children,
  noBg,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButtonMenu disabled={disabled} fullWidth={fullWidth} {...props} noBg={noBg ? noBg : false}>
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          variant,
          scale,
          disabled,
        });
      })}
    </StyledButtonMenu>
  );
};

export default ButtonMenu;
