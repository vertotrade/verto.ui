import { useRef } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  scroll-margin-top: 64px;
  padding-top: 10px;
`;

export const PoolsTable: React.FC<React.PropsWithChildren> = ({ children }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  return (
    <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
      {children}
    </StyledTable>
  );
};
