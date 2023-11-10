import { ReactElement } from 'react'
import { Card, Box, BoxProps, CameraIcon, Flex, FlexProps, SellIcon, Text, WalletFilledIcon } from '@verto/uikit'
import { ERC20Token } from '@verto/sdk'
import { useTranslation } from '@verto/localization'
import styled from 'styled-components'
import { CurrencyLogo } from 'components/Logo'

export const Footer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box borderTop={[null, null, null, '1px solid']} borderColor="cardBorder" pt="8px" {...props}>
    {children}
  </Box>
)

interface AmountLabelProps extends FlexProps {
  amount: number
  token: ERC20Token
}

export const AmountLabel: React.FC<React.PropsWithChildren<AmountLabelProps>> = ({ amount, token, ...props }) => (
  <Flex alignItems="center" {...props}>
    <CurrencyLogo currency={token} size="16px" style={{ marginLeft: '4px', marginRight: '4px' }} />
    <Text fontWeight="600">
      {amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      })}
    </Text>
  </Flex>
)

interface CostLabelProps extends FlexProps {
  cost: number
  usdPrice: number
  token: ERC20Token
}

export const CostLabel: React.FC<React.PropsWithChildren<CostLabelProps>> = ({ cost, usdPrice, token, ...props }) => {
  const priceInUsd = usdPrice * cost

  return (
    <Flex alignItems="center" {...props}>
      {priceInUsd > 0 && (
        <Text fontSize="12px" color="textSubtle">{`($${priceInUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}</Text>
      )}
      <AmountLabel amount={cost} token={token} />
    </Flex>
  )
}

interface MetaRowProps extends FlexProps {
  title: string
}

export const MetaRow: React.FC<React.PropsWithChildren<MetaRowProps>> = ({ title, children, ...props }) => (
  <Flex alignItems="center" justifyContent="space-between" {...props}>
    <Text fontSize="12px" color="textSubtle" maxWidth="120px" ellipsis title={title}>
      {title}
    </Text>
    <Box>{children}</Box>
  </Flex>
)

export interface NftTagProps extends FlexProps {
  icon?: ReactElement
  color?: string
}

export const NftTag: React.FC<React.PropsWithChildren<NftTagProps>> = ({
  icon,
  color = 'text',
  children,
  ...props
}) => (
  <Flex display="inline-flex" alignItems="center" height="24px" {...props}>
    {icon}
    <Text color={color} fontSize="14px" fontWeight="600">
      {children}
    </Text>
  </Flex>
)

export const ProfileNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = props => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<CameraIcon mr="4px" width="16px" color="textSubtle" />} color="textSubtle" {...props}>
      {t('Profile')}
    </NftTag>
  )
}

export const WalletNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = props => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<WalletFilledIcon mr="4px" width="16px" color="secondary" />} color="secondary" {...props}>
      {t('Wallet')}
    </NftTag>
  )
}

export const SellingNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = props => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<SellIcon mr="4px" width="16px" color="failure" />} color="failure" {...props}>
      {t('Selling')}
    </NftTag>
  )
}

export const StyledCollectibleCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  max-width: 320px;
  transition: opacity 200ms;

  & > div {
    border-radius: 20px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
`
