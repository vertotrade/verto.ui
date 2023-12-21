import { useRouter } from 'next/router'
import { Text, PageHeader } from '@verto/uikit'
import { Collection } from 'state/nftMarket/types'
import { formatNumber } from '@verto/utils/formatBalance'
import { useTranslation } from '@verto/localization'
import Container from 'components/Layout/Container'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { nftsBaseUrl } from '../constants'

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
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(totalSupply), 0, 0)} />
            <StatBoxItem title={t('Items listed')} stat={listedItems ? formatNumber(Number(listedItems), 0, 0) : '0'} />
            <StatBoxItem title="Lowest" stat={`$${formatNumber(lowestPrice, 0, 0)}`} />
            <StatBoxItem title="Volume" stat={`$${volume}`} />
          </StatBox>
        </MarketPageTitle>
      </PageHeader>
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={router.asPath} mt="24px" mb="8px" />
      </Container>
    </>
  )
}

export default Header
