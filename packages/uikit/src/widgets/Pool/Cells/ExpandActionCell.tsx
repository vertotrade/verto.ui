import styled from "styled-components";

import { ChevronDownIcon } from "../../../components";
import { BaseCell } from "./BaseCell";

interface ExpandActionCellProps {
  expanded: boolean;
}

const StyledCell = styled(BaseCell)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding-right: 12px;
  padding-left: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 60px;
    padding-right: 32px;
    padding-left: 8px;
  }
`;

const ArrowIcon = styled((props) => <ChevronDownIcon {...props} />)`
  transform: ${({ toggled }) => (toggled ? "rotate(180deg)" : "rotate(0)")};
  height: 24px;
  width: 24px;
`;

export const ExpandActionCell: React.FC<React.PropsWithChildren<ExpandActionCellProps>> = ({ expanded }) => {
  return (
    <StyledCell role="cell">
      <ArrowIcon color="icon" toggled={expanded} />
    </StyledCell>
  );
};
