import styled from 'styled-components'
import { useMemo } from 'react'
import {
  Container,
  Button,
  Heading,
  LinkExternal,
  PageHeader,
  NextLinkFromReactRouter,
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
import SearchBar from '../components/SearchBar'
import Collections from './Collections'
import config from './config'

const StyledSearchBar = styled(SearchBar)`
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 0 24px;
`

const Home = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: collections, status } = useGetCollections()

  const newestCollections = useMemo(
    () => orderBy(collections, collection => (collection.createdAt ? Date.parse(collection.createdAt) : 0), 'desc'),
    [collections],
  )

  return (
    <>
      <PageMeta />
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('NFT Marketplace')}
        </Heading>
        <Heading scale="lg" color="text" mb="24px">
          {t('Buy and Sell NFTs on Rebuschain')}
        </Heading>
        {account && (
          <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} mt="32px">
            {t('Manage/Sell')}
          </Button>
        )}
      </PageHeader>
      <StyledSearchBar />
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
