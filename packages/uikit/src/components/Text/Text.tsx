import styled, { DefaultTheme } from "styled-components";
import { space, typography, layout } from "styled-system";
import getThemeValue from "../../util/getThemeValue";
import { TextProps } from "./types";

interface ThemedProps extends TextProps {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps) => {
  const value = getThemeValue(theme, `colors.${color}`, color);

  if (value.includes("gradient")) {
    return `
      background: ${value};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      opacity: 0.75;
    `;
  }

  return `color: ${value};`;
};

const Text = styled.div<TextProps>`
  ${getColor}
  font-weight: ${({ bold }) => (bold ? 500 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}

  ${({ xSmall }) => xSmall && `font-size: 12px;`}
  ${({ small }) => small && `font-size: 14px;`}
  & .textSpan {
    ${typography}
  }
`;

Text.defaultProps = {
  color: "text",
  small: false,
  fontSize: "16px",
  ellipsis: false,
};

export default Text;
