import React, { cloneElement, Children, ReactElement } from "react";
import styled from "styled-components";
import Flex from "../Box/Flex";
import { TabMenuProps } from "./types";

const Wrapper = styled(Flex)<{ fullWidth?: boolean }>`
  border-bottom: 2px solid ${({ theme }) => theme.colors.vertoBg1};
  overflow-x: scroll;
  padding: ${({ fullWidth }) => (fullWidth ? 0 : "32px 16px 0")};

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Inner = styled(Flex)<{ fullWidth?: boolean; gap?: string }>`
  justify-content: space-between;

  & > button + button {
    margin-left: ${({ gap }) => gap || "4px"};
  }

  & > button {
    flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
  }

  flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
`;

const TabMenu: React.FC<React.PropsWithChildren<TabMenuProps>> = ({
  activeIndex = 0,
  onItemClick,
  children,
  fullWidth,
  gap,
}) => {
  return (
    <Wrapper p={["0 4px", "0 16px"]} fullWidth={fullWidth}>
      <Inner fullWidth={fullWidth} gap={gap}>
        {Children.map(children, (child: ReactElement, index) => {
          const isActive = activeIndex === index;
          const color = isActive ? "secondary" : "textSubtle";
          const backgroundColor = "transparent";

          return cloneElement(child, {
            isActive,
            onClick: onItemClick ? () => onItemClick(index) : undefined,
            color,
            backgroundColor,
          });
        })}
      </Inner>
    </Wrapper>
  );
};

export default TabMenu;
