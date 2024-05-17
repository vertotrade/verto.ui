import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Text, PageHeader, MenuItems } from '@verto/uikit'
import { Collection } from 'state/nftMarket/types'
import { formatNumber } from '@verto/utils/formatBalance'
import { useTranslation } from '@verto/localization'
import Container from 'components/Layout/Container'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import { nftsBaseUrl } from '../constants'

const StyledMenu = styled(MenuItems)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.hr};
  margin: 0 32px;
  gap: 34px;
`

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { totalSupply, banner, avatar, listedItems, lowestPrice, volume: totalVolume } = collection as any
  const { t } = useTranslation()

  const volume = totalVolume
    ? parseFloat(totalVolume).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'

  const itemsConfig = collectionAddress
    ? [
        {
          label: t('Items'),
          href: `${nftsBaseUrl}/collections/${collectionAddress}`,
        },
        {
          label: t('Traits'),
          href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
        },
        {
          label: t('Activity'),
          href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
        },
      ]
    : []

  return (
    <>
      <PageHeader>
        <BannerHeader bannerImage={banner.large} avatar={<AvatarImage src={avatar} />} />
        <MarketPageTitle
          address={collection.address}
          title={collection.name}
          description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}>
          <StatBox>
            {totalSupply && <StatBoxItem title={t('Items')} stat={formatNumber(Number(totalSupply), 0, 0)} />}
            {listedItems && <StatBoxItem title={t('Items listed')} stat={formatNumber(Number(listedItems), 0, 0)} />}
            {lowestPrice && <StatBoxItem title="Lowest" stat={`$${formatNumber(lowestPrice, 0, 0)}`} />}
            {volume && <StatBoxItem title="Volume" stat={`$${volume}`} />}
          </StatBox>
        </MarketPageTitle>
      </PageHeader>
      <Container>
        <StyledMenu items={itemsConfig} activeItem={router.asPath} isSecondaryMenu />
      </Container>
    </>
  )
}

export default Header
