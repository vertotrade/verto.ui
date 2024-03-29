import React from "react";
import { Flex } from "@verto/uikit";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "@verto/localization";
import { NextLinkFromReactRouter } from "../../../components/NextLink";
import { NotificationDot } from "../../../components/NotificationDot";
import { ButtonMenu, ButtonMenuItem } from "../../../components/ButtonMenu";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  margin-right: 6px;
  margin-top: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
  }
`;

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean;
}

export const FarmTabButtons: React.FC<React.PropsWithChildren<FarmTabButtonsProps>> = ({ hasStakeInFinishedFarms }) => {
  const router = useRouter();
  const { t } = useTranslation();

  let activeIndex;
  switch (router.pathname) {
    case "/farms":
      activeIndex = 0;
      break;
    case "/farms/history":
      activeIndex = 1;
      break;
    case "/_mp/farms/history":
      activeIndex = 1;
      break;
    case "/farms/archived":
      activeIndex = 2;
      break;
    default:
      activeIndex = 0;
      break;
  }

  return (
    <Wrapper>
      <Flex width="max-content" flexDirection="column">
        <ButtonMenu activeIndex={activeIndex}>
          <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms">
            {t("Live")}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedFarms}>
            <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms/history" id="finished-farms-button">
              {t("Finished")}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
      </Flex>
    </Wrapper>
  );
};
