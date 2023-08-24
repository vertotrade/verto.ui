import { useTranslation } from "@verto/localization";
import BigNumber from "bignumber.js";
import { useMatchBreakpoints } from "@verto/uikit";
import { Button } from "../../../../../components/Button";
import { Heading } from "../../../../../components/Heading";
import { Text, TooltipText } from "../../../../../components/Text";
import { Balance } from "../../../../../components/Balance";
import { Skeleton } from "../../../../../components/Skeleton";
import { useTooltip } from "../../../../../hooks/useTooltip";
import { ActionContainer, ActionContent, ActionTitles } from "./styles";

interface HarvestActionProps {
  earnings: BigNumber;
  earningsBusd: number;
  displayBalance: string | JSX.Element;
  pendingTx: boolean;
  userDataReady: boolean;
  proxyCakeBalance?: number;
  handleHarvest: () => void;
  tokenName?: string;
}

const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  earnings,
  earningsBusd,
  displayBalance,
  pendingTx,
  userDataReady,
  proxyCakeBalance,
  handleHarvest,
  tokenName = `VERTO`,
}) => {
  const { t } = useTranslation();

  const toolTipBalance = !userDataReady ? (
    <Skeleton width={60} />
  ) : earnings.isGreaterThan(new BigNumber(0.00001)) ? (
    earnings.toFixed(5, BigNumber.ROUND_DOWN)
  ) : (
    `< 0.00001`
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${toolTipBalance} ${t(
      `${tokenName} has been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`
    )}`,
    {
      placement: "bottom",
    }
  );

  const { isMobile } = useMatchBreakpoints();

  return (
    <ActionContainer isMobile={isMobile}>
      <ActionTitles isMobile={isMobile}>
        <Text color="text" fontSize="14px" pr="4px">
          {tokenName}
        </Text>
        <Text color="text" fontSize="14px">
          {t("Earned")}
        </Text>
      </ActionTitles>
      <ActionContent isMobile={isMobile}>
        <div>
          {proxyCakeBalance ? (
            <>
              <TooltipText ref={targetRef} decorationColor="secondary">
                <Heading>{displayBalance}</Heading>
              </TooltipText>
              {tooltipVisible && tooltip}
            </>
          ) : (
            <Heading>{displayBalance}</Heading>
          )}
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button ml="4px" disabled={earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
          {pendingTx ? t("Harvesting") : t("Harvest")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
};

export default HarvestAction;
