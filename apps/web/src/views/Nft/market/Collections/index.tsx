import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Flex,
  Grid,
  VertoHeading,
  Text,
  Td,
  ProfileAvatar,
  Table,
  Th,
  useMatchBreakpoints,
  Select,
  OptionProps,
  NextLinkFromReactRouter,
  ToggleView,
  Container,
} from '@verto/uikit'
import useTheme from 'hooks/useTheme'

import useSWRImmutable from 'swr/immutable'
import orderBy from 'lodash/orderBy'
import { ViewMode } from 'state/user/actions'
import { Collection } from 'state/nftMarket/types'
import styled from 'styled-components'
import { FetchStatus } from 'config/constants/types'
import { useGetShuffledCollections } from 'state/nftMarket/hooks'
import { useTranslation } from '@verto/localization'
import Page from 'components/Layout/Page'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import PageLoader from 'components/Loader/PageLoader'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { ScrollableContainer } from '../../../../components/shared/styled'
import { CollectionCard } from '../components/CollectibleCard'

export const ITEMS_PER_PAGE = 9

const SORT_FIELD = {
  createdAt: 'createdAt',
  volume: 'volume',
  items: 'listedItems',
  supply: 'totalSupply',
  lowestPrice: 'lowestPrice',
  highestPrice: 'highestPrice',
}

const SORT_FIELD_INDEX_MAP = new Map([
  [SORT_FIELD.createdAt, 0],
  [SORT_FIELD.volume, 1],
  [SORT_FIELD.items, 2],
  [SORT_FIELD.supply, 3],
  [SORT_FIELD.lowestPrice, 4],
  [SORT_FIELD.highestPrice, 5],
])

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const CollectionsHeading = styled(VertoHeading)`
  font-size: 34px;
  font-weight: 600;
`

const CollectionViewOptions = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
  }
`

const getNewSortDirection = (oldSortField: string, newSortField: string, oldSortDirection: boolean) => {
  if (oldSortField !== newSortField) {
    return newSortField !== SORT_FIELD.lowestPrice
  }
  return !oldSortDirection
}

const Collectible = () => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()
  const { data: shuffledCollections } = useGetShuffledCollections()
  const { isMobile } = useMatchBreakpoints()
  const [sortField, setSortField] = useState(null)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [viewMode, setViewMode] = useState(ViewMode.CARD)
  const [sortDirection, setSortDirection] = useState<boolean>(false)
  const options = useMemo(() => {
    return [
      {
        label: t('Collection'),
        value: SORT_FIELD.createdAt,
      },
      {
        label: t('Volume'),
        value: SORT_FIELD.volume,
      },
      {
        label: t('Items'),
        value: SORT_FIELD.items,
      },
      {
        label: t('Supply'),
        value: SORT_FIELD.supply,
      },
      {
        label: t('Lowest Price'),
        value: SORT_FIELD.lowestPrice,
      },
      {
        label: t('Highest Price'),
        value: SORT_FIELD.highestPrice,
      },
    ]
  }, [t])

  const { data: collections = [], status } = useSWRImmutable<
    (Collection & Partial<{ lowestPrice: number; highestPrice: number }>)[]
  >(
    shuffledCollections && shuffledCollections.length ? ['collectionsWithPrice', viewMode, sortField] : null,
    async () => {
      if (viewMode === ViewMode.CARD && sortField !== SORT_FIELD.lowestPrice && sortField !== SORT_FIELD.highestPrice)
        return shuffledCollections
      return Promise.all(
        shuffledCollections.map(async collection => {
          // const [lowestPrice, highestPrice] = await Promise.all([
          //   getLeastMostPriceInCollection(collection.address, 'asc'),
          //   getLeastMostPriceInCollection(collection.address, 'desc'),
          // ])
          return {
            ...collection,
            // lowestPrice,
            // highestPrice,
          }
        }),
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  const handleSort = useCallback(
    (newField: string) => {
      setPage(1)
      setSortField(newField)
      setSortDirection(getNewSortDirection(sortField, newField, sortDirection))
    },
    [sortDirection, sortField],
  )

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        window.scroll({
          top: 50,
          left: 0,
          behavior: 'smooth',
        })
      }, 50)
    }
  }, [isMobile, page])

  useEffect(() => {
    let extraPages = 1
    if (collections.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.max(Math.floor(collections.length / ITEMS_PER_PAGE) + extraPages, 1))
  }, [collections])

  const sortedCollections = useMemo(() => {
    return orderBy(
      collections,
      collection => {
        if (sortField === SORT_FIELD.createdAt) {
          if (collection.createdAt) {
            return Date.parse(collection.createdAt)
          }
          return null
        }
        return parseFloat(collection[sortField])
      },
      sortDirection ? 'desc' : 'asc',
    ).filter(collection => !DELIST_COLLECTIONS[collection.address])
  }, [collections, sortField, sortDirection])

  const paginationControls = useMemo(
    () => (
      <Container px="0">
        <Flex
          borderTop={viewMode === ViewMode.TABLE ? `1px ${theme.colors.cardBorder} solid` : 'none'}
          pt="24px"
          flexDirection="column"
          justifyContent="space-between"
          height="100%">
          <PageButtons>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}>
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>
            <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}>
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </Flex>
      </Container>
    ),
    [page, maxPage, t, theme.colors.cardBorder, viewMode],
  )

  return (
    <>
      <Page>
        <CollectionViewOptions justifyContent="space-between" alignItems="center" mb="40px" py="16px">
          <CollectionsHeading scale="xl" mb="4px" as="h1">
            {t('Collections')}
          </CollectionsHeading>

          <Flex style={{ gap: '17px', alignItems: 'center' }}>
            <Flex width="max-content" style={{ gap: '8px', alignItems: 'center' }}>
              <Text
                fontSize="14px"
                color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                style={{ whiteSpace: 'nowrap' }}>
                {t('Sort by')}
              </Text>
              <Select
                options={options}
                color="text"
                placeHolderText={t('Select')}
                defaultOptionIndex={SORT_FIELD_INDEX_MAP.get(sortField)}
                onOptionChange={(option: OptionProps) => handleSort(option.value)}
              />
            </Flex>
            <ToggleView noBg idPrefix="clickCollection" viewMode={viewMode} onToggle={setViewMode} />
          </Flex>
        </CollectionViewOptions>
        {status !== FetchStatus.Fetched ? (
          <PageLoader />
        ) : (
          <>
            {viewMode === ViewMode.TABLE ? (
              <>
                <ScrollableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          onClick={() => handleSort(SORT_FIELD.createdAt)}>
                          {t('Collection')}
                          {arrow(SORT_FIELD.createdAt)}
                        </Th>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort(SORT_FIELD.volume)}>
                          {t('Volume')}
                          {arrow(SORT_FIELD.volume)}
                        </Th>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort(SORT_FIELD.lowestPrice)}>
                          {t('Lowest')}
                          {arrow(SORT_FIELD.lowestPrice)}
                        </Th>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort(SORT_FIELD.highestPrice)}>
                          {t('Highest')}
                          {arrow(SORT_FIELD.highestPrice)}
                        </Th>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSort(SORT_FIELD.items)}>
                          {t('Items')}
                          {arrow(SORT_FIELD.items)}
                        </Th>
                        <Th
                          textAlign="left"
                          fontWeight={400}
                          color={isDark ? theme.colors.neutralGray3 : theme.colors.neutralGray}
                          style={{ cursor: 'pointer', paddingRight: '20px' }}
                          onClick={() => handleSort(SORT_FIELD.supply)}>
                          {t('Supply')}
                          {arrow(SORT_FIELD.supply)}
                        </Th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCollections
                        .map(collection => {
                          const volume = collection.volume
                            ? parseFloat(collection.volume).toLocaleString(undefined, {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                              })
                            : '0'
                          const collectionName =
                            collection.name.length > 30 ? `${collection.name.slice(0, 34)} ...` : collection.name
                          return (
                            <tr style={{ fontWeight: 400 }} key={collection.address} data-test="nft-collection-row">
                              <Td style={{ cursor: 'pointer', minWidth: '200px', paddingLeft: '20px' }}>
                                <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collection.address}`}>
                                  <Flex alignItems="center">
                                    <ProfileAvatar src={collection.avatar} width={40} height={40} mr="12px" />
                                    {collectionName}
                                  </Flex>
                                </NextLinkFromReactRouter>
                              </Td>
                              <Td>
                                <Flex alignItems="center">
                                  ${volume}
                                  {/* <BnbUsdtPairTokenIcon ml="8px" /> */}
                                </Flex>
                              </Td>
                              <Td>
                                $
                                {(collection.lowestPrice || 0).toLocaleString(undefined, {
                                  maximumFractionDigits: 5,
                                })}
                              </Td>
                              <Td>
                                $
                                {(collection.highestPrice || 0).toLocaleString(undefined, {
                                  maximumFractionDigits: 5,
                                })}
                              </Td>
                              <Td>{collection.listedItems}</Td>
                              <Td style={{ paddingRight: '20px' }}>{collection?.totalSupply}</Td>
                            </tr>
                          )
                        })
                        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)}
                    </tbody>
                  </Table>
                </ScrollableContainer>
                {paginationControls}
              </>
            ) : (
              <>
                <Grid
                  gridGap="16px"
                  gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
                  mb="32px"
                  data-test="nft-collection-row">
                  {sortedCollections.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map(collection => {
                    return (
                      <CollectionCard
                        key={collection.address}
                        bgSrc={collection.banner.small}
                        collectionName={collection.name}
                        url={`${nftsBaseUrl}/collections/${collection.address}`}
                        collectionVolume={`${collection.volume} ${collection.symbol}`}
                        collectionSupply={collection.totalSupply}
                      />
                    )
                  })}
                </Grid>
                {paginationControls}
              </>
            )}
          </>
        )}
      </Page>
    </>
  )
}

export default Collectible
