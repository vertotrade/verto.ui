import { ElementType, ReactNode } from "react";
import { LayoutProps, SpaceProps } from "styled-system";
import type { PolymorphicComponentProps } from "../../util/polymorphic";

export const scales = {
  MD: "md",
  SM: "sm",
  XS: "xs",
  NEW_XS: "newXs",
  NEW_SM: "newSm",
  NEW_LG: "newLg",
} as const;

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  TEXT: "text",
  DANGER: "danger",
  SUBTLE: "subtle",
  SUBTLE2: "subtle2",
  SUCCESS: "success",
  LIGHT: "light",
  VERTOCUSTOM: "vertoCustom",
  VERTO_PRIMARY: "vertoPrimary",
  VERTO_PRIMARY_GRADIENT: "vertoPrimaryGradient",
  VERTO_SECONDARY: "vertoSecondary",
  VERTO_GHOST: "vertoGhost",
  VERTO_TEXT: "vertoText",
  VERTO_LINK: "vertoLink",
  VERTO_ICON: "vertoIcon",
} as const;

export type Scale = typeof scales[keyof typeof scales];
export type Variant = typeof variants[keyof typeof variants];

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: "a" | "button" | ElementType;
  external?: boolean;
  isLoading?: boolean;
  scale?: Scale;
  variant?: Variant;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  decorator?: {
    backgroundColor?: string;
    color?: string;
    text: string;
    direction?: "left" | "right";
  };
}

export type ButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<P, BaseButtonProps>;
