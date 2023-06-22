import styled from "styled-components";
import { useTranslation } from "@verto/localization";
import { useCallback } from "react";
import { Text } from "../Text";
import { ChevronDownIcon, ChevronUpIcon } from "../Svg";

export interface ExpandableSectionButtonProps {
  onClick?: () => void;
  expanded?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }
`;

const ExpandableSectionButton: React.FC<React.PropsWithChildren<ExpandableSectionButtonProps>> = ({
  onClick,
  expanded = false,
}) => {
  const { t } = useTranslation();
  const handleOnClick = useCallback(() => onClick?.(), [onClick]);

  return (
    <Wrapper aria-label={t("Hide or show expandable content")} role="button" onClick={handleOnClick}>
      <Text color="text" bold>
        {expanded ? t("Hide") : t("Details")}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  );
};

export default ExpandableSectionButton;
