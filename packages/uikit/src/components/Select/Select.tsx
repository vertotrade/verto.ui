import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Box, BoxProps } from "../Box";
import { ArrowDropDownIcon } from "../Svg";
import { Text } from "../Text";

const DropDownHeader = styled.div<{ hasPrimaryBorderColor: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  border: 2px solid
    ${({ theme, hasPrimaryBorderColor }) =>
      hasPrimaryBorderColor ? theme.colors.primary0f : theme.colors.inputSecondary};
  border-radius: 7.5px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`;

const DropDownListContainer = styled.div<{ hasPrimaryBorderColor: boolean }>`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`;

const DropDownContainer = styled(Box)<{ isOpen: boolean; hasPrimaryBorderColor: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 7.5px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 2px solid
          ${({ theme }) => (props.hasPrimaryBorderColor ? theme.colors.primary0f : theme.colors.inputSecondary)};
        border-radius: 7.5px 7.5px 0 0;
        border: 1px solid
          ${({ theme }) => (props.hasPrimaryBorderColor ? theme.colors.primary0f : theme.colors.inputSecondary)};
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 2px solid
          ${({ theme }) => (props.hasPrimaryBorderColor ? theme.colors.primary0f : theme.colors.inputSecondary)};
        border-top-width: 0;
        border-radius: 0 0 7.5px 7.5px;
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`;

export interface SelectProps extends BoxProps {
  options: OptionProps[];
  onOptionChange?: (option: OptionProps) => void;
  placeHolderText?: string;
  defaultOptionIndex?: number;
  color?: string;
  hasPrimaryBorderColor?: boolean;
}

export interface OptionProps {
  label: string;
  value: any;
}

const Select: React.FunctionComponent<React.PropsWithChildren<SelectProps>> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  placeHolderText,
  color = "textSubtle",
  hasPrimaryBorderColor = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(defaultOptionIndex);

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex);
    setIsOpen(false);
    setOptionSelected(true);

    if (onOptionChange) {
      onOptionChange(options[selectedIndex]);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (defaultOptionIndex) {
      setSelectedOptionIndex(defaultOptionIndex - 1);
      setOptionSelected(true);
    }
  }, [defaultOptionIndex]);

  return (
    <DropDownContainer isOpen={isOpen} {...props} hasPrimaryBorderColor={hasPrimaryBorderColor}>
      <DropDownHeader hasPrimaryBorderColor={hasPrimaryBorderColor} onClick={toggling}>
        <Text color={color}>
          {!optionSelected && placeHolderText ? placeHolderText : options[selectedOptionIndex].label}
        </Text>
      </DropDownHeader>
      <ArrowDropDownIcon color={color} onClick={toggling} />
      <DropDownListContainer hasPrimaryBorderColor={hasPrimaryBorderColor}>
        <DropDownList>
          {options.map((option, index) =>
            placeHolderText || index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text color={color}>{option.label}</Text>
              </ListItem>
            ) : null
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

export default Select;
