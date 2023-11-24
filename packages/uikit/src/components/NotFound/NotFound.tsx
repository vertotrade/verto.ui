import styled from "styled-components";
import { NextSeo } from "next-seo";
import { Button, Heading, Text, LogoIcon } from "@verto/uikit";
import { useTranslation } from "@verto/localization";
import Link from "next/link";
import { ReactElement } from "react";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = ({ image }: { image?: ReactElement }) => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo title="404" />
      <StyledNotFound>
        {image}
        <LogoIcon width="64px" mb="8px" />
        <Heading scale="lg" mb="8px">
          {t("Page Not Found")}
        </Heading>
        <Text mb="16px">{t("Sorry, but the page you were looking for could not be found.")}</Text>
        <Link href="/" passHref>
          <Button mr="16px" variant="secondary">
            <Text fontWeight={600}>{t("Back to Home Page")}</Text>
          </Button>
        </Link>
      </StyledNotFound>
    </>
  );
};

export default NotFound;
