import styled from "styled-components";
import Text from "../Text/Text";
import { tags, scales, HeadingProps } from "./types";

const style = {
  [scales.MD]: {
    fontSize: "20px",
    fontSizeLg: "20px",
  },
  [scales.LG]: {
    fontSize: "22px",
    fontSizeLg: "24px",
  },
  [scales.XL]: {
    fontSize: "32px",
    fontSizeLg: "40px",
  },
  [scales.XXL]: {
    fontSize: "48px",
    fontSizeLg: "64px",
  },
  [tags.H1]: {
    fontSize: "48px",
    lineHeight: "48px",
    fontWeight: "600",
  },
  [tags.H2]: {
    fontSize: "34px",
    lineHeight: "40px",
    fontWeight: "600",
  },
  [tags.H3]: {
    fontSize: "22px",
    lineHeight: "28px",
    fontWeight: "600",
  },
  [tags.H4]: {
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: "600",
  },
  [tags.H5]: {
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: "500",
  },
  [tags.H6]: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "500",
  },
};

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale || scales.LG].fontSize};
  font-weight: 600;
  line-height: 1.1;
`;

Heading.defaultProps = {
  as: tags.H2,
};

export const VertoHeading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale || tags.H2].fontSize};
  font-weight: ${({ scale }) => style[scale || tags.H2].fontWeight};
  line-height: ${({ scale }) => style[scale || tags.H2].lineHeight};
`;

VertoHeading.defaultProps = {
  as: tags.H2,
};

export default Heading;
