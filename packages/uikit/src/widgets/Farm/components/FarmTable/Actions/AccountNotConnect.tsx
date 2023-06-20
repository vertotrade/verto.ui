import { useTranslation } from "@verto/localization";
import { useMatchBreakpoints } from "@verto/uikit";
import { Text } from "../../../../../components/Text";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();

  return (
    <StyledActionContainer isMobile={isMobile}>
      <ActionTitles>
        <Text color="text" fontSize="14px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent>{children}</ActionContent>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
