import { LayoutProps, SpaceProps, TypographyProps } from "styled-system";

export interface TextProps extends SpaceProps, TypographyProps, LayoutProps {
  color?: string;
  bold?: boolean;
  hoverColor?: string;
  small?: boolean;
  ellipsis?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}
