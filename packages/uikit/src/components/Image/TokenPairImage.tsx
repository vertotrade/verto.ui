import styled from "styled-components";
import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const StyledWrapper = styled(Wrapper)`
  display: flex;
  max-width: 76px;
  width: 76px;
`;

const TokenPairDivider = styled.hr<{ bold?: boolean }>`
  display: inline;
  height: 1px;
  background: ${({ theme, bold }) => (bold ? theme.colors.hrBold : theme.colors.hr)};
  border: none;
  width: 8px;
  margin: 19px 4px;
`;

const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primarySrc,
  secondarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  bold,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  return (
    <StyledWrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage
        bold={bold}
        variant={variant}
        src={primarySrc}
        width={width}
        height={height}
        {...primaryImageProps}
      />
      <TokenPairDivider bold={bold} />
      <StyledSecondaryImage
        bold={bold}
        variant={variant}
        src={secondarySrc}
        width={width}
        height={height}
        {...secondaryImageProps}
      />
    </StyledWrapper>
  );
};

export default TokenPairImage;
