import { useRef } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;
  padding-top: 10px;

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }

  > div:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.radii.card};
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }
`;

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  background-size: 400% 400%;
  position: relative;
  padding-top: 10px;
  margin-top: 10px;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding-top: 10px;
    background: linear-gradient(92.9deg, #30e8bf -20.75%, #ff8235 99.44%);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }
`;

export const PoolsTable: React.FC<React.PropsWithChildren> = ({ children }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {children}
      </StyledTable>
    </StyledTableBorder>
  );
};
