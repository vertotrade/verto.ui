import styled from "styled-components";

export const ActionContainer = styled.div<{ isMobile?: boolean }>`
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;

  padding: ${({ isMobile }) => (isMobile ? "8px 16px" : "24px;")};
  ${({ isMobile }) => (isMobile ? "" : "padding-left: 0;")}
  ${({ isMobile }) => (isMobile ? "" : "min-height: 150px;")}
`;

export const ActionTitles = styled.div<{ isMobile?: boolean }>`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;

  ${({ isMobile }) => (isMobile ? "justify-content: center;" : "")}
`;

export const ActionContent = styled.div<{ isMobile?: boolean }>`
  display: flex;
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "space-between")};
  align-items: center;
`;

export const IconButtonWrapper = styled.div`
  display: flex;
`;

export const StyledActionContainer = styled(ActionContainer)`
  &:nth-child(3) {
    flex-basis: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    &:nth-child(3) {
      margin-top: 16px;
    }
  }
`;
