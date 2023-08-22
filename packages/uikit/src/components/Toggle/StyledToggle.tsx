import styled from "styled-components";
import { ToggleProps, HandleProps, InputProps, ScaleKeys, scales, StyleToggleProps } from "./types";

const scaleKeyValues = {
  sm: {
    handleHeight: "12px",
    handleWidth: "12px",
    handleLeft: "4px",
    handleTop: "3px",
    checkedLeft: "calc(100% - 16px)",
    toggleHeight: "20px",
    toggleWidth: "40px",
  },
  md: {
    handleHeight: "26px",
    handleWidth: "26px",
    handleLeft: "3px",
    handleTop: "1px",
    checkedLeft: "calc(100% - 30px)",
    toggleHeight: "32px",
    toggleWidth: "56px",
  },
  lg: {
    handleHeight: "32px",
    handleWidth: "32px",
    handleLeft: "4px",
    handleTop: "2px",
    checkedLeft: "calc(100% - 36px)",
    toggleHeight: "40px",
    toggleWidth: "72px",
  },
};

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.SM }: ToggleProps) => {
    return scaleKeyValues[scale][property];
  };

export const Handle = styled.div<HandleProps>`
  background-color: ${({ theme, checked }) => (checked ? theme.toggle.activeHandleBg : theme.toggle.handleBg)};
  border-radius: 50%;
  cursor: pointer;
  height: ${getScale("handleHeight")};
  left: ${getScale("handleLeft")};
  position: absolute;
  top: ${getScale("handleTop")};
  transition: left 200ms ease-in;
  width: ${getScale("handleWidth")};
  z-index: 1;
`;

export const Input = styled.input<InputProps>`
  cursor: pointer;
  opacity: 0;
  height: 100%;
  position: absolute;
  inset: 0;
  width: 100%;
  z-index: 3;
  margin: 0;

  &:checked + ${Handle} {
    left: ${getScale("checkedLeft")};
  }

  &:focus + ${Handle} {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:hover + ${Handle}:not(:disabled):not(:checked) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const StyledToggle = styled.div<StyleToggleProps>`
  align-items: center;
  background-color: ${({ theme, $checked, $checkedColor, $defaultColor }) =>
    theme.colors[$checked ? $checkedColor : $defaultColor]};
  border-radius: 10px;
  border: 1px solid ${({ $checked, theme }) => ($checked ? theme.colors.newPrimary : theme.colors.inputBorder)};
  cursor: pointer;
  display: inline-flex;
  height: ${getScale("toggleHeight")};
  position: relative;
  transition: background-color 200ms;
  width: ${getScale("toggleWidth")};

  &:hover {
    ${({ $checked, theme }) => ($checked ? "" : `border: 1px solid ${theme.colors.inputBorderHover}`)};
  }
`;

export default StyledToggle;
