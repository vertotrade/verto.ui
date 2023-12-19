import styled from 'styled-components'
import { Button, Flex, Grid, Heading, HeadingProps, NextLinkFromReactRouter, Text } from '@verto/uikit'
import useTheme from 'hooks/useTheme'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from '@verto/localization'
import { CollectionCard } from '../components/CollectibleCard'

interface HeroTitleProps extends HeadingProps {
  textGradient?: boolean
}

const CollectionsTitle = styled(Heading)<HeroTitleProps>`
  ${({ textGradient }) =>
    textGradient
      ? `background: linear-gradient(90deg, #231F20 60.42%, #565656 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;`
      : ''}
`

const Collections: React.FC<React.PropsWithChildren<{ title: string; testId: string; collections: Collection[] }>> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  console.log('Collcetions:', collections)

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <CollectionsTitle as="h3" scale="xl" data-test={testId} textGradient={!isDark}>
          {title}
        </CollectionsTitle>
        <Button
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/collections/`}
          variant="vertoSecondary"
          style={{ fontWeight: 500 }}
          scale="md">
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
        {collections.slice(0, 6).map(collection => {
          return (
            <CollectionCard
              key={collection.address}
              bgSrc={collection.banner.small}
              collectionName={collection.name}
              url={`${nftsBaseUrl}/collections/${collection.address}`}
              collectionVolume={`${collection.volume} ${collection.symbol}`}
              collectionSupply={collection.totalSupply}></CollectionCard>
          )
        })}
      </Grid>
    </>
  )
}

export default Collections
