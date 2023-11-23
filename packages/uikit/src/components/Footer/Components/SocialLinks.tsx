import React from "react";
import styled from "styled-components";
import { FlexProps } from "../../Box";
import Flex from "../../Box/Flex";
import Link from "../../Link/Link";
import { socials } from "../config";

const SocialLink = styled(Link)`
  &:hover > *:first-child path {
    fill: url(#gradient);
  }

  &:hover .hover-gradient {
    background: ${({ theme }) => theme.colors.gradientGreenOrange};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.75;
  }
`;

const SocialLinks: React.FC<React.PropsWithChildren<FlexProps>> = ({ ...props }) => (
  <Flex {...props}>
    {socials.map((social, index) => {
      const iconProps = {
        width: "20px",
        color: "textSubtle",
        style: { cursor: "pointer" },
      };
      const Icon = social.icon;
      const mr = index < socials.length - 1 ? "24px" : 0;

      return (
        <SocialLink external key={social.label} href={social.href} aria-label={social.label} mr={mr} hoverBackgroundColor="inherit">
          <Icon {...iconProps} />
        </SocialLink>
      );
    })}
  </Flex>
);

export default React.memo(SocialLinks, () => true);
