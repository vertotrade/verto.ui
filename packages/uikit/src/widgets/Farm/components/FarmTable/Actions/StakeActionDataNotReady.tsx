import { useTranslation } from "@verto/localization";
import { Text } from "../../../../../components/Text";
import { Skeleton } from "../../../../../components/Skeleton";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

const StakeActionDataNotReady = () => {
  const { t } = useTranslation();
  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text color="text" fontSize="14px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Skeleton width={180} marginBottom={28} marginTop={14} />
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakeActionDataNotReady;
