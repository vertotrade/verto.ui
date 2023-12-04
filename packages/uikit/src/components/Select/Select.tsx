import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Box, BoxProps, Flex } from "../Box";
import { ArrowDropDownIcon } from "../Svg";
import { Text } from "../Text";

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 7.5px;
  background: ${({ theme }) => theme.colors.inputBg};
  transition: border-radius 0.15s;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.inputBorderHover};
  }
`;

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.inputBg};
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

const DropDownContainer = styled(Box)<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  position: relative;
  background: ${({ theme }) => theme.colors.inputBg};
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
        border-radius: 7.5px 7.5px 0 0;
        border: 1px solid ${({ theme }) => theme.colors.newPrimary};
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.newPrimary};
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
  prefix?: React.ReactElement;
}

const Select: React.FunctionComponent<React.PropsWithChildren<SelectProps>> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  placeHolderText,
  color = "textSubtle",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(typeof defaultOptionIndex === "number");
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
      setSelectedOptionIndex(defaultOptionIndex);
      setOptionSelected(true);
    }
  }, [defaultOptionIndex]);

  return (
    <DropDownContainer isOpen={isOpen} {...props}>
      <DropDownHeader onClick={toggling}>
        <Flex alignItems="center">
          {!optionSelected ? null : options[selectedOptionIndex].prefix}
          <Text color={color} small>
            {!optionSelected && placeHolderText ? placeHolderText : options[selectedOptionIndex].label}
          </Text>
        </Flex>
      </DropDownHeader>
      <ArrowDropDownIcon color={color} onClick={toggling} width="24px" height="24px" />
      <DropDownListContainer>
        <DropDownList>
          {options.map((option, index) =>
            placeHolderText || index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Flex alignItems="center">
                  {option.prefix}
                  <Text small color={color}>
                    {option.label}
                  </Text>
                </Flex>
              </ListItem>
            ) : null
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

export default Select;
