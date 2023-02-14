import { useIsMounted } from "@verto/hooks";
import React from "react";
import { vars } from "@verto/ui/css/vars.css";
import { Box, Flex } from "../Box";
import { LogoWithTextIcon } from "../Svg";
import SocialLinks from "./Components/SocialLinks";

import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledText,
  StyledToolsContainer,
} from "./styles";

import LangSelector from "../LangSelector/LangSelector";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { FooterProps } from "./types";
import { SkeletonV2 } from "../Skeleton";
import useMatchBreakpoints from "../../contexts/MatchBreakpoints/useMatchBreakpoints";

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  ...props
}) => {
  const isMounted = useIsMounted();
  const { isMobile } = useMatchBreakpoints();

  return (
    <StyledFooter p={["40px 16px", null, "56px 40px 62px 40px"]} position="relative" {...props} justifyContent="center">
      <Flex
        flexDirection={`${isMobile ? "column" : "row"}`}
        justifyContent="space-between"
        flexWrap="wrap"
        width={["100%", null, "968px;"]}
      >
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <LogoWithTextIcon width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[1]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
          alignItems="flex-center"
          mb={isMobile ? "0" : "42px"}
          width="100%"
        >
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? vars.colors.secondary : "text"}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
          <Box display={["none", null, "block"]}>
            <LogoWithTextIcon width="160px" />
          </Box>
        </Flex>
        <SocialLinks order={[2]} display="flex" alignItems="center" />
        <StyledToolsContainer order={[3]} flexDirection={["column", null, "row"]} justifyContent="space-between">
          <Flex order={[2, null, 1]} alignItems="center">
            <SkeletonV2 variant="round" width="56px" height="32px" isDataReady={isMounted}>
              <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
            </SkeletonV2>
            <LangSelector
              currentLang={currentLang}
              menuItemColor="textSubtle"
              langs={langs}
              setLang={setLang}
              color="text"
              dropdownPosition={isMobile ? "top" : "top-left"}
            />
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
