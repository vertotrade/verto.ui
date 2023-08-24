import styled from "styled-components";
import { Flex } from "../../components/Box";

import { FlexProps } from "../../components/Box/types";

const ModalRow = styled(Flex)<
  FlexProps & {
    last?: boolean;
  }
>`
  padding-top: 16px;
  ${({ last }) => (last ? "" : "padding-bottom: 16px")};
  ${({ last, theme }) => (last ? "" : `border-bottom: 1px solid ${theme.colors.hr}`)};
`;

export default ModalRow;
