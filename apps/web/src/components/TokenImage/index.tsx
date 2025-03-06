import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from '@verto/uikit'
import { Token, ChainId } from '@verto/sdk'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
  inbetweenToken?: Token
  tertiaryToken?: Token
}

const getImageUrlFromToken = (token: Token) => {
  if (!token) {
    return ``
  }

  const address = token?.isNative ? token.wrapped.address : token.address
  if (
    token.chainId !== ChainId.BSC &&
    token.chainId !== ChainId.REBUS &&
    token.chainId !== ChainId.REBUS_TESTNET &&
    token.chainId !== ChainId.REBUS_TESTNET_L2 &&
    token.chainId !== ChainId.REBUS_L2
  ) {
    return `/images/${token.chainId}/tokens/${address}.png`
  }
  return `/images/tokens/${address}.png`
}

export const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  inbetweenToken,
  tertiaryToken,
  ...props
}) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      inbetweenSrc={getImageUrlFromToken(inbetweenToken)}
      tertiarySrc={getImageUrlFromToken(tertiaryToken)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<React.PropsWithChildren<TokenImageProps>> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
