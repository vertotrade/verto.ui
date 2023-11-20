import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import EXTERNAL_LINK_PROPS from "../../util/externalLinkProps";
import Text from "../Text/Text";
import { LinkProps } from "./types";

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: ${(props) => props.padding || `0`};
  border-radius: 25px;
  -webkit-transition: background-color 0.2s, opacity 0.2s;
  transition: background-color 0.2s, opacity 0.2s;
  &:hover {
    text-decoration: ${(props) => props.textDecoration};
    background-color: ${(props) => props.hoverBackgroundColor || props.theme.colors.secondaryButtonHoverBg};
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Link: React.FC<React.PropsWithChildren<LinkProps>> = ({ external, internal, ...props }) => {
  const internalProps = external ? EXTERNAL_LINK_PROPS : {};
  return <StyledLink as={internal ? NextLink : "a"} bold {...internalProps} {...props} />;
};

/* eslint-disable react/default-props-match-prop-types */
Link.defaultProps = {
  color: "primary",
  textDecoration: "underline",
};

export default Link;
