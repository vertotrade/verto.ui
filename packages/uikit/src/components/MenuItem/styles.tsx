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
  background: ${({ theme }) => theme.colors.textSubtle};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
    background: linear-gradient(92.9deg, #30e8bf -20.75%, #ff8235 99.44%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border-image-source: linear-gradient(to right, #30e8bf, #ff8235);
    color: ${theme.colors.text};
  `
      : ""};

  :hover,
  :focus {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;

    background: linear-gradient(92.9deg, #30e8bf -20.75%, #ff8235 99.44%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border-image-source: linear-gradient(to right, #30e8bf, #ff8235);
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default StyledMenuItem;
