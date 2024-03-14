import { Token } from '@verto/sdk'
import { useMemo } from 'react'
import styled from 'styled-components'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import getTokenLogoURL from '../../../../utils/getTokenLogoURL'
import LogoLoader from './LogoLoader'

const StyledLogo = styled(LogoLoader)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 8px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  color: ${({ theme }) => theme.colors.text};
`

export const CurrencyLogo: React.FC<
  React.PropsWithChildren<{
    address?: string
    size?: string
  }>
> = ({ address, size = '24px', ...rest }) => {
  const src = useMemo(() => {
    return getTokenLogoURL(new Token(DEFAULT_CHAIN_ID, address, 18, ''))
  }, [address])

  return <StyledLogo size={size} src={src} alt="token logo" {...rest} />
}

const DoubleCurrencyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 32px;
`

interface DoubleCurrencyLogoProps {
  address0?: string
  address1?: string
  size?: number
  chainName?: 'ETH' | 'BSC'
}

export const DoubleCurrencyLogo: React.FC<React.PropsWithChildren<DoubleCurrencyLogoProps>> = ({
  address0,
  address1,
  size = 16,
}) => {
  return (
    <DoubleCurrencyWrapper>
      {address0 && <CurrencyLogo address={address0} size={`${size.toString()}px`} />}
      {address1 && <CurrencyLogo address={address1} size={`${size.toString()}px`} />}
    </DoubleCurrencyWrapper>
  )
}
