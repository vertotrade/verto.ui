import { AnchorHTMLAttributes } from "react";
import { TextProps } from "../Text";

export interface LinkProps extends TextProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  internal?: boolean;
  isBscScan?: boolean;
  isIcon?: boolean;
  hoverBackgroundColor?: string;
  padding?: string;
  textDecoration?: string;
}
