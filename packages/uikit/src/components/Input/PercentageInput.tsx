import styled from "styled-components";
import { useState } from "react";
import type { HTMLAttributes, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { Text } from "../Text";
import Input from "./Input";
import { Flex, FlexProps } from "../Box";
import { InputProps } from "./types";

type ContainerProps = FlexProps &
  InputProps & {
    isFocused: boolean;
    isDisabled: boolean;
  };

const Container = styled(Flex)<ContainerProps>`
  background-color: ${({ theme }) => theme.colors.inputBg};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  max-width: 94px;
  outline: 0;
  padding: 12px 12px 12px 16px;
  height: 48px;
  border: 1px solid
    ${({ theme, isFocused, isDisabled, isWarning, isSuccess }) => {
      if (isDisabled) return theme.colors.disabledBg;
      if (isWarning) return theme.colors.error;
      if (isSuccess || isFocused) return theme.colors.newPrimary;

      return theme.colors.inputBorder;
    }};

  ${({ theme, isDisabled }) =>
    isDisabled
      ? `
          background-color: ${theme.colors.backgroundDisabled};
          color: ${theme.colors.textDisabled};
          cursor: not-allowed;
        `
      : ``}
  };

  &:hover {
    border: 1px solid ${({ theme, isFocused, isSuccess, isWarning }) => {
      if (isWarning) return theme.colors.error;
      if (isSuccess || isFocused) return theme.colors.newPrimary;

      return theme.colors.inputBorderHover;
    }};
  }
`;

type PercentageInputProps = InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const UnstyledInput = styled(Input)<InputProps>`
  border: none !important;
  border-radius: 0;
  background: transparent;
  padding: 0;
  height: unset;
  width: 100%;
`;

export const PercentageInput = (props: PercentageInputProps) => {
  const { isSuccess, isWarning, disabled, inputMode, pattern, placeholder, value, onBlur, onChange } = props;
  const [focused, setFocused] = useState(false);

  return (
    <Container
      alignItems="center"
      flexDirection="row"
      ml="4px"
      isSuccess={isSuccess}
      isWarning={isWarning}
      isFocused={focused}
      isDisabled={disabled}
    >
      <UnstyledInput
        inputMode={inputMode}
        pattern={pattern}
        placeholder={placeholder}
        value={value}
        onBlur={(event) => {
          setFocused(false);
          if (onBlur) onBlur(event);
        }}
        onChange={(event) => {
          if (onChange) onChange(event);
        }}
        isWarning={isWarning}
        isSuccess={isSuccess}
        onFocus={() => {
          setFocused(true);
        }}
      />
      <Text bold color="placeholder" ml="8px">
        %
      </Text>
    </Container>
  );
};
