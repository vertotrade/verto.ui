import styled from "styled-components";
import { variant as StyledSystemVariant } from "styled-system";
import { ImageProps, Variant, variants } from "./types";
import TokenImage from "./TokenImage";

interface StyledImageProps extends ImageProps {
  variant: Variant;
  bold?: boolean;
}

export const StyledPrimaryImage = styled(TokenImage)<StyledImageProps>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 7px;

  &:before {
    border: 1px solid ${({ theme, bold }) => (bold ? theme.colors.hrBold : theme.colors.hr)};
  }

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: "auto",
        left: 0,
        right: "auto",
        top: 0,
        zIndex: 5,
      },
      [variants.INVERTED]: {
        bottom: 0,
        left: "auto",
        right: 0,
        top: "auto",
        zIndex: 6,
      },
    },
  })}
`;

export const StyledSecondaryImage = styled(TokenImage)<StyledImageProps>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin: 10px 0;

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 0,
        left: "auto",
        right: 0,
        top: "auto",
        zIndex: 6,
      },
      [variants.INVERTED]: {
        bottom: "auto",
        left: 0,
        right: "auto",
        top: 0,
        zIndex: 5,
      },
    },
  })}
`;

export const StyledInbetweenImage = styled(TokenImage)<StyledImageProps>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin: 10px 0;
  left: 44px !important;
  top: -16px !important;
  position: absolute;

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 0,
        left: "auto",
        right: 0,
        top: "auto",
        zIndex: 6,
      },
      [variants.INVERTED]: {
        bottom: "auto",
        left: 0,
        right: "auto",
        top: 0,
        zIndex: 5,
      },
    },
  })}
`;
