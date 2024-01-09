import { useIsMounted, useTheme } from "@verto/hooks";
import React from "react";
import { vars } from "@verto/ui/css/vars.css";
import { Box, Flex } from "../Box";
import { BasicLogo } from "../Svg";
import SocialLinks from "./Components/SocialLinks";

import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledText,
  StyledToolsContainer,
  HiddenLangSelector,
} from "./styles";

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
  const { theme } = useTheme();

  return (
    <StyledFooter p={["40px 16px", null, "56px 40px 62px 40px"]} position="relative" {...props} justifyContent="center">
      <Flex
        flexDirection={`${isMobile ? "column" : "row"}`}
        justifyContent="space-between"
        flexWrap="wrap"
        width={["100%", null, "968px;"]}
      >
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <BasicLogo width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[1]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
          alignItems="flex-center"
          mb={isMobile ? "0" : "42px"}
          width="100%"
        >
          <Box display={["none", null, "block"]}>
            <BasicLogo color={theme.colors.text} width="160px" />
          </Box>
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, internal, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      href={href}
                      target={href.includes("http") ? "_blank" : undefined}
                      rel={href.includes("http") ? "noopener noreferrer" : undefined}
                      color="text"
                      bold={false}
                      internal={internal}
                      hoverBackgroundColor="inherit"
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
        </Flex>
        <SocialLinks order={[2]} display="flex" alignItems="center" />
        <StyledToolsContainer order={[3]} flexDirection={["column", null, "row"]} justifyContent="space-between">
          <Flex
            order={[2, null, 1]}
            alignItems={["flex-start", null, "center"]}
            justifyContent="center"
            flexDirection={["column", null, "row"]}
          >
            <SkeletonV2 variant="round" width="auto" height="auto" isDataReady={isMounted}>
              <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} showText />
            </SkeletonV2>
            <HiddenLangSelector
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
