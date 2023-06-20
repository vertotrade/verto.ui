import styled from "styled-components";
import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage, StyledTertiaryImage } from "./styles";
import Wrapper from "./Wrapper";

const StyledWrapper = styled(Wrapper)`
  display: flex;
  max-width: 76px;
  width: 76px;
`;

const TokenPairDivider = styled.hr`
  display: inline;
  height: 1px;
  background: ${({ theme }) => theme.colors.hr};
  border: none;
  width: 8px;
  margin: 19px 4px;
`;

const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primarySrc,
  secondarySrc,
  tertiarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <StyledWrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} />
      <TokenPairDivider />
      <StyledSecondaryImage
        variant={variant}
        src={secondarySrc}
        width={width}
        height={height}
        {...secondaryImageProps}
      />
      {tertiarySrc && (
        <StyledTertiaryImage
          variant={variant}
          src={tertiarySrc}
          width={secondaryImageSize}
          height={secondaryImageSize}
        />
      )}
    </StyledWrapper>
  );
};

export default TokenPairImage;
