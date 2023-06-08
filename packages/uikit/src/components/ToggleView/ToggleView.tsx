import { useCallback } from "react";
import styled from "styled-components";
import { CardViewIcon, ListViewIcon } from "../Svg";
import { ButtonMenu, ButtonMenuItem } from "../ButtonMenu";
import { IconButton } from "../Button";

export enum ViewMode {
  TABLE = "TABLE",
  CARD = "CARD",
}

interface ToggleViewProps {
  idPrefix: string;
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

const Container = styled.div`
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;

  &:hover {
    background: transparent;
  }
`;

export const ToggleView: React.FunctionComponent<React.PropsWithChildren<ToggleViewProps>> = ({
  idPrefix,
  viewMode,
  onToggle,
}) => {
  const handleToggleCard = useCallback(() => {
    if (viewMode !== ViewMode.CARD) {
      onToggle(ViewMode.CARD);
    }
  }, [onToggle, viewMode]);

  const handleToggleTable = useCallback(() => {
    if (viewMode !== ViewMode.TABLE) {
      onToggle(ViewMode.TABLE);
    }
  }, [onToggle, viewMode]);

  return (
    <Container>
      <ButtonMenu activeIndex={viewMode === ViewMode.CARD ? 0 : 1}>
        <ButtonMenuItem>
          <StyledIconButton variant="vertoGhost" scale="newXs" id={`${idPrefix}CardView`} onClick={handleToggleCard}>
            <CardViewIcon color={viewMode === ViewMode.CARD ? "icon" : "disabledTextDark"} />
          </StyledIconButton>
        </ButtonMenuItem>
        <ButtonMenuItem>
          <StyledIconButton variant="vertoGhost" scale="newXs" id={`${idPrefix}TableView`} onClick={handleToggleTable}>
            <ListViewIcon color={viewMode === ViewMode.TABLE ? "icon" : "disabledTextDark"} />
          </StyledIconButton>
        </ButtonMenuItem>
      </ButtonMenu>
    </Container>
  );
};
