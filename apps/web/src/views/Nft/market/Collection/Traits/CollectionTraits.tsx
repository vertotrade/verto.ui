import { useState } from 'react'
import times from 'lodash/times'
import capitalize from 'lodash/capitalize'
import sum from 'lodash/sum'
import orderBy from 'lodash/orderBy'
import { Skeleton, Table, Td } from '@verto/uikit'
import { formatNumber } from '@verto/utils/formatBalance'
import CollapsibleCard from 'components/CollapsibleCard'
import { useTranslation } from '@verto/localization'
import { SortType } from '../../types'
import { TableWrapper, StyledCollapsibleCard, StyledTh } from './styles'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'

interface CollectionTraitsProps {
  collectionAddress: string
}

const CollectionTraits: React.FC<React.PropsWithChildren<CollectionTraitsProps>> = ({ collectionAddress }) => {
  const { data, isFetching } = useGetCollectionDistribution(collectionAddress)
  const [raritySort, setRaritySort] = useState<Record<string, SortType>>({})
  const { t } = useTranslation()

  if (isFetching) {
    return (
      <CollapsibleCard title={t('Loading...')}>
        <Table>
          <thead>
            <tr>
              <StyledTh textAlign="left">{t('Name')}</StyledTh>
              <StyledTh width="100px">{t('Count')}</StyledTh>
              <StyledTh width="160px">{t('Rarity')}</StyledTh>
            </tr>
          </thead>
          <tbody>
            {times(19).map(bunnyCnt => (
              <tr key={bunnyCnt}>
                <Td>
                  <Skeleton width="100px" />
                </Td>
                <Td>
                  <Skeleton />
                </Td>
                <Td>
                  <Skeleton />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CollapsibleCard>
    )
  }

  return (
    <>
      {data &&
        Object.keys(data).map((traitType, index) => {
          const total = sum(Object.values(data[traitType]))

          // Parse the distribution values into an array to make it easier to sort
          const traitValues: { value: string; count: number; rarity: number }[] = Object.keys(data[traitType]).map(
            traitValue => {
              const count = data[traitType][traitValue]
              const rarity = (count / total) * 100

              return { value: traitValue, count, rarity }
            },
          )
          const sortType = raritySort[traitType] || 'desc'

          const toggleRaritySort = () => {
            setRaritySort(prevRaritySort => {
              if (!prevRaritySort[traitType]) {
                return {
                  ...prevRaritySort,
                  [traitType]: 'asc',
                }
              }

              return {
                ...prevRaritySort,
                [traitType]: prevRaritySort[traitType] === 'asc' ? 'desc' : 'asc',
              }
            })
          }

          return (
            <StyledCollapsibleCard key={traitType} title={capitalize(traitType)} initialOpenState={index <= 1}>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <StyledTh textAlign="left">{t('Name')}</StyledTh>
                      <StyledTh width="100px">{t('Count')}</StyledTh>
                      <StyledTh width="160px" onClick={toggleRaritySort}>
                        {t('Rarity')}
                      </StyledTh>
                    </tr>
                  </thead>
                  <tbody>
                    {orderBy(traitValues, 'rarity', sortType).map(({ value, count, rarity }) => {
                      return (
                        <tr key={value}>
                          <Td fontWeight="600" lineHeight="24px">
                            {capitalize(value)}
                          </Td>
                          <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                          <Td textAlign="center">{`${formatNumber(rarity, 0, 2)}%`}</Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </StyledCollapsibleCard>
          )
        })}
    </>
  )
}

export default CollectionTraits
