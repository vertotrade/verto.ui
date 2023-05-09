import { ChainId, Currency } from '@verto/sdk'
import { BinanceIcon, TokenLogo } from '@verto/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@verto/token-lists'
import styled from 'styled-components'
import { useHttpLocations } from '@verto/hooks'
import { BAD_SRCS } from './constants'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

const EMPTY_OBJ = {}

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const parsedStyle: React.CSSProperties = style || EMPTY_OBJ

  if (currency?.chainId === ChainId.REBUS || currency?.chainId === ChainId.REBUS_TESTNET) {
    // eslint-disable-next-line no-param-reassign
    parsedStyle.borderRadius = '0'
  }

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) {
          if (uriLocations.length) return [...uriLocations]
          return [currency.logoURI].filter(Boolean)
        }
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL && currency.address) return [`/images/tokens/${currency.address}.png`]
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }

    return (
      <StyledLogo
        badSrcs={BAD_SRCS}
        size={size}
        srcs={[`/images/chains/${currency.chainId}.png`]}
        width={size}
        style={parsedStyle}
      />
    )
  }

  return (
    <StyledLogo
      badSrcs={BAD_SRCS}
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? 'token'} logo`}
      style={parsedStyle}
    />
  )
}
