import { useTranslation } from "@verto/localization";
import { AutoRenewIcon, Button, Flex, Heading, Modal, Text } from "@verto/uikit";
import { formatNumber } from "@verto/utils/formatBalance";
import { useTheme } from "styled-components";
import getThemeValue from "../../util/getThemeValue";

export interface CollectModalProps {
  formattedBalance: string;
  fullBalance: string;
  earningTokenSymbol: string;
  earningsDollarValue: number;
  burnFormattedBalance?: string;
  sousId: number;
  onDismiss?: () => void;
  poolAddress?: {
    [index: number]: string;
  };
  earningTokenAddress?: string;
}

export interface CollectModalWithHandlerProps extends Omit<CollectModalProps, "isBnbPool" | "sousId"> {
  handleHarvestConfirm: () => Promise<any>;
  pendingTx: boolean;
}

export function CollectModal({
  formattedBalance,
  earningTokenSymbol,
  earningsDollarValue,
  burnFormattedBalance,
  onDismiss,
  handleHarvestConfirm,
  pendingTx,
}: CollectModalWithHandlerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Modal
      title={`${earningTokenSymbol} ${t("Harvest")}`}
      onDismiss={onDismiss}
      headerBackground={getThemeValue(theme, "colors.backgroundAlt")}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="8px">
        <Text>{t("Harvesting")}:</Text>
      </Flex>
      <Flex flexDirection="column" mb="24px">
        <Heading>
          {formattedBalance} {earningTokenSymbol}
        </Heading>
        {earningsDollarValue > 0 && (
          <Text fontSize="12px" color="textSubtle">{`~${formatNumber(earningsDollarValue)} USD`}</Text>
        )}
      </Flex>

      {burnFormattedBalance && (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Text>{t("Burning")}:</Text>
          </Flex>
          <Flex flexDirection="column" mb="24px">
            <Heading>
              {burnFormattedBalance} {earningTokenSymbol}
            </Heading>
            {earningsDollarValue > 0 && (
              <Text fontSize="12px" color="textSubtle">{`~${formatNumber(earningsDollarValue)} USD`}</Text>
            )}
          </Flex>
        </>
      )}

      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? t("Confirming") : t("Confirm")}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {t("Close Window")}
      </Button>
    </Modal>
  );
}
