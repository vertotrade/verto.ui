import { useMemo } from 'react'
import {
  Container,
  LinkExternal,
  PageHeader,
  PageSection,
} from '@verto/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@verto/localization'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import { PageMeta } from 'components/Layout/Page'
import { useGetCollections } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import orderBy from 'lodash/orderBy'
import Collections from './Collections'
import config from './config'
import { HeroSection } from '../components/HeroSection/HeroSection'

const Home = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: collections, status } = useGetCollections()

  const newestCollections = useMemo(
    () => orderBy(collections, collection => (collection.createdAt ? Date.parse(collection.createdAt) : 0), 'desc'),
    [collections],
  )
  // HERE: DO we need Newest Collection and Newest Arrivals? Arrivals come from Newest.tsk
  return (
    <>
      <PageMeta />
      <PageHeader>
        <HeroSection />
        {/* {account && (
          <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} mt="32px">
            {t('Manage/Sell')}
          </Button>
        )} */}
      </PageHeader>
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%', paddingTop: 0 } }}
          index={1}
          hasCurvedDivider={false}>
          <Collections
            key="newest-collections"
            title={t('Newest Collections')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
          {/* <Newest /> */}
        </PageSection>
      )}
      <Container p="64px 0">
        <SectionsWithFoldableText header={t('FAQs')} config={config(t)} m="auto" />
        <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications" mx="auto" mt="32px">
          {t('Apply to NFT Marketplace!')}
        </LinkExternal>
      </Container>
    </>
  )
}

export default Home
