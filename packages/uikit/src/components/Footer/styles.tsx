import styled from "styled-components";
import { darkColors } from "../../theme/colors";
import { Box, Flex } from "../Box";
import LangSelector from "../LangSelector/LangSelector";

export const StyledFooter = styled(Flex)`
  background: ${({ theme }) => theme.colors.footerBg};
`;

// remove this display none when translations are ready
export const HiddenLangSelector = styled(LangSelector)`
  display: none;
`;

export const StyledList = styled.ul`
  list-style: none;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
  }
`;

export const StyledListItem = styled.li`
  font-size: 16px;
  margin-bottom: 8px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.text};

  &:first-child {
    color: ${darkColors.naturalGray};
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const StyledIconMobileContainer = styled(Box)`
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 24px;
  }
`;

export const StyledToolsContainer = styled(Flex)`
  padding-top: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 0;
    margin-bottom: 0;
  }
`;

export const StyledText = styled.span`
  color: ${darkColors.text};
`;
