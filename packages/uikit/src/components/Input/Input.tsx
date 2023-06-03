import styled, { DefaultTheme } from "styled-components";
import { InputProps, scales } from "./types";

interface StyledInputProps extends InputProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success
 */
export const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  if (isSuccess) {
    return theme.shadows.success;
  }

  return theme.shadows.inset;
};

export const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return "32px";
    case scales.MD:
      return "40px";
    case scales.LG:
    default:
      return "48px";
  }
};

const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.inputBg};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-size: 16px;
  height: ${getHeight};
  outline: 0;
  padding: 0 16px;
  width: 100%;
  border: 1px solid
    ${({ theme, isSuccess, isWarning }) => {
      if (isWarning) return theme.colors.error;
      if (isSuccess) return theme.colors.newPrimary;

      return theme.colors.inputBorder;
    }};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.inputBorderHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
    border: 1px solid ${({ theme }) => theme.colors.disabledBg};
  }

  &:focus:not(:disabled) {
    border: 1px solid
      ${({ theme, isWarning }) => {
        if (isWarning) return theme.colors.error;

        return theme.colors.newPrimary;
      }};
  }
`;

Input.defaultProps = {
  scale: scales.LG,
  isSuccess: false,
  isWarning: false,
};

export default Input;
