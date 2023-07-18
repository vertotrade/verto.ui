import styled from "styled-components";
import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const StyledWrapper = styled(Wrapper)<{ hasThirdImage?: boolean }>`
  display: flex;
  max-width: ${(props) => (props.hasThirdImage ? `112px` : `76px`)};
  width: ${(props) => (props.hasThirdImage ? `112px` : `76px`)};
`;

const TokenPairDivider = styled.hr<{ bold?: boolean }>`
  display: inline;
  flex-shrink: 0;
  height: 1px;
  background: ${({ theme, bold }) => (bold ? theme.colors.hrBold : theme.colors.hr)};
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
  bold,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <StyledWrapper position="relative" width={width} height={height} hasThirdImage={!!tertiarySrc} {...props}>
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
      {tertiarySrc && (
        <>
          <TokenPairDivider bold={bold} />
          <StyledSecondaryImage
            variant={variant}
            src={tertiarySrc}
            width={secondaryImageSize}
            height={secondaryImageSize}
          />
        </>
      )}
    </StyledWrapper>
  );
};

export default TokenPairImage;
