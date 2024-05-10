import { Flex, Text, Button, Heading, Skeleton, Balance, useModal, Box } from "@verto/uikit";
import BigNumber from "bignumber.js";
import { ReactElement } from "react";
import { useTranslation } from "@verto/localization";
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from "@verto/utils/formatBalance";
import { CollectModalProps } from "./CollectModal";
import { HarvestAction as TableHarvestAction } from "./PoolsTable/HarvestAction";
import { HarvestActionsProps } from "./types";

const HarvestActions: React.FC<React.PropsWithChildren<HarvestActionsProps>> = ({
  earnings,
  isLoading,
  onPresentCollect,
  earningTokenPrice,
  earningTokenBalance,
  earningTokenDollarBalance,
  isLiquid,
  liquidTokenBalance,
  liquidTokenDollarBalance,
}) => {
  const { t } = useTranslation();
  const hasEarnings = earnings.toNumber() > 0;

  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="row" alignItems="center">
        {isLiquid && liquidTokenBalance && (
          <>
            <Flex flexDirection="column">
              <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={liquidTokenBalance} />
              {!Number.isNaN(liquidTokenDollarBalance) && liquidTokenDollarBalance && liquidTokenDollarBalance > 0 && (
                <Balance
                  display="inline"
                  fontSize="12px"
                  color="text"
                  decimals={2}
                  prefix="~"
                  value={liquidTokenDollarBalance}
                  unit=" USD"
                />
              )}
            </Flex>
            <Box mx={1}>/</Box>
          </>
        )}
        <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <>
                  <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                  {earningTokenPrice > 0 && (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      value={earningTokenDollarBalance}
                      unit=" USD"
                    />
                  )}
                </>
              ) : (
                <>
                  <Heading color="textDisabled">0</Heading>
                  <Text fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                </>
              )}
            </>
          )}
        </Flex>
      </Flex>
      <Button disabled={!hasEarnings} onClick={onPresentCollect}>
        {t("Harvest")}
      </Button>
    </Flex>
  );
};

interface WithHarvestActionsProps {
  earnings: BigNumber;
  liquid?: BigNumber;
  isLiquid?: boolean;
  earningTokenSymbol: string;
  sousId: number;
  earningTokenPrice: number;
  isLoading?: boolean;
  earningTokenDecimals: number;
  earningTokenAddress?: string;
  poolAddress?: {
    [index: number]: string;
  };
}

const withCollectModalFactory =
  (ActionComp: any) =>
  (CollectModalComponent: (props: CollectModalProps) => ReactElement) =>
  ({
    earnings,
    liquid,
    earningTokenSymbol,
    earningTokenAddress,
    earningTokenDecimals,
    sousId,
    earningTokenPrice,
    isLoading,
    poolAddress,
    isLiquid,
    ...props
  }: WithHarvestActionsProps) => {
    const earningTokenBalance: number = getBalanceNumber(earnings, earningTokenDecimals);
    const liquidTokenBalance = isLiquid && liquid ? getBalanceNumber(liquid, earningTokenDecimals) : undefined;

    const formattedBalance = formatNumber(liquidTokenBalance || earningTokenBalance, 5, 5);
    const burnFormattedBalance = liquidTokenBalance
      ? formatNumber(earningTokenBalance - liquidTokenBalance, 3, 3)
      : undefined;

    const fullBalance = getFullDisplayBalance(isLiquid && liquid ? liquid : earnings, earningTokenDecimals);

    const earningTokenDollarBalance = earnings
      ? getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningTokenDecimals)
      : 0;

    const liquidTokenDollarBalance =
      isLiquid && liquid ? getBalanceNumber(liquid.multipliedBy(earningTokenPrice), earningTokenDecimals) : 0;

    const [onPresentCollect] = useModal(
      <CollectModalComponent
        formattedBalance={formattedBalance}
        fullBalance={fullBalance}
        earningTokenSymbol={earningTokenSymbol}
        earningsDollarValue={earningTokenDollarBalance}
        burnFormattedBalance={burnFormattedBalance}
        sousId={sousId}
        earningTokenAddress={earningTokenAddress}
        poolAddress={poolAddress}
      />
    );

    return (
      <ActionComp
        onPresentCollect={onPresentCollect}
        earnings={earnings}
        liquid={liquid}
        isLiquid={isLiquid}
        earningTokenPrice={earningTokenPrice}
        earningTokenDollarBalance={earningTokenDollarBalance}
        earningTokenBalance={earningTokenBalance}
        liquidTokenBalance={liquidTokenBalance}
        liquidTokenDollarBalance={liquidTokenDollarBalance}
        isLoading={isLoading}
        earningTokenSymbol={earningTokenSymbol}
        {...props}
      />
    );
  };

export const withCollectModalTableAction = withCollectModalFactory(TableHarvestAction);

export const withCollectModalCardAction = withCollectModalFactory(HarvestActions);
