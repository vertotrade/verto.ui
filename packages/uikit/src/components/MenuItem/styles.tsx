import styled from "styled-components";
import { StyledMenuItemProps } from "./types";

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  align-items: center;
  display: flex;
  height: 100%;
  position: relative;
`;

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  align-items: center;
  border-radius: 10px;
  display: flex;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 8px 12px;
  height: 100%;
  align-items: center;
  ${({ theme, $isGlobalSubMenu }) =>
    !$isGlobalSubMenu
      ? `background: ${theme.isDark ? theme.colors.textSubtle : theme.colors.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;`
      : ""}

  opacity: 1;
  margin-bottom: -1px;

  ${({ theme, $isActive }) =>
    $isActive
      ? `
    border-radius: 0px;
    border-bottom: 5px solid;
    border-image-slice: 1;
    border-width: 5px;
    top: 0px;
    opacity: 1;
    padding-top: 13px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border-image-source: ${theme.colors.gradientGreenOrange};
    color: ${theme.colors.text};
  `
      : ""};

  :hover,
  :focus {
    color: ${({ theme }) => theme.colors.gradientGreenOrange};
    opacity: 1;

    background: ${({ theme }) => theme.colors.gradientGreenOrange};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ theme, $isGlobalSubMenu }) =>
    $isGlobalSubMenu
      ? `
    border-radius: 0px;
    border-bottom: none;
    border-width: 0px;
    top: 0px;
    opacity: 1;
    padding: 14px 18px;
    border-image-source: none;
    color: ${theme.colors.text};
  `
      : ""};

  ${({ theme, $isGlobalSubMenu, $isActive }) =>
    $isGlobalSubMenu && $isActive
      ? `
      background: ${theme.colors.vertoBg1};
      border-radius: 46px;
      -webkit-background-clip: unset;
      -webkit-text-fill-color: unset;

      :hover,
      :focus {
        background: ${theme.colors.vertoBg1};
        -webkit-background-clip: unset;
        -webkit-text-fill-color: unset;
      }
    `
      : ""};

  ${({ theme, $isGlobalSubMenu, $isActive }) =>
    $isGlobalSubMenu && !$isActive
      ? `
        border-radius: 46px;
        transition: 0.2s background-color;
  
        :hover,
        :focus {
          background: ${theme.colors.headerMenuHover};
          -webkit-background-clip: unset;
          -webkit-text-fill-color: unset;
        }
      `
      : ""};
`;

export default StyledMenuItem;
