import { useRouter } from "next/router";
import { Flex } from "@verto/uikit";
import styled from "styled-components";
import { useTranslation } from "@verto/localization";
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot, NextLinkFromReactRouter } from "../../components";
import { ToggleView, ViewMode } from "../../components/ToggleView";

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    align-items: flex-end;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0px 16px;
  }
`;

interface PoolTableButtonsPropsType {
  stakedOnly: boolean;
  setStakedOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  hasStakeInFinishedPools: boolean;
  hideViewMode?: boolean;
}

const PoolTabButtons = ({
  stakedOnly,
  setStakedOnly,
  hasStakeInFinishedPools,
  viewMode,
  setViewMode,
  hideViewMode = false,
}: PoolTableButtonsPropsType) => {
  const router = useRouter();

  const { t } = useTranslation();

  const isExact = router.pathname === "/pools" || router.pathname === "/_mp/pools";

  const viewModeToggle = hideViewMode ? null : (
    <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={setViewMode} />
  );

  const liveOrFinishedSwitch = (
    <Wrapper>
      <Flex width="max-content" flexDirection="column">
        <ButtonMenu activeIndex={isExact ? 0 : 1}>
          <ButtonMenuItem as={NextLinkFromReactRouter} to="/pools" replace>
            {t("Live")}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem id="finished-pools-button" as={NextLinkFromReactRouter} to="/pools/history" replace>
              {t("Finished")}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
      </Flex>
    </Wrapper>
  );

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text color="text"> {t("Staked only")}</Text>
    </ToggleWrapper>
  );

  return (
    <ViewControls>
      {viewModeToggle}
      {liveOrFinishedSwitch}
      <Flex style={{ paddingBottom: "6px" }}>{stakedOnlySwitch}</Flex>
    </ViewControls>
  );
};

export default PoolTabButtons;
