import { Card, CardBody, Flex, Heading, Text, NextLinkFromReactRouter, ProfileAvatar } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import useTheme from 'hooks/useTheme'
import Image from 'next/image'
import styled from 'styled-components'

interface CollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  collectionVolume?: string
  collectionSupply?: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px ${({ theme }) => theme.colors.backgroundAlt} solid;
`

const StyledCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 16px;
  height: 100%;
  max-width: 375px;
  margin: 0 auto;
  background: transparent;
  width: 100%;

  & > div {
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 16px;
    padding: 8px;
    width: 100%;
  }
`

const StyledImage = styled(Image)`
  width: 100%;
  aspect-ratio: 2.7/1;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`

const StyledCardDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    width: 50%;
  }
`

const CollectionCard: React.FC<React.PropsWithChildren<CollectionCardProps>> = ({
  bgSrc,
  collectionName,
  collectionVolume,
  collectionSupply,
  url,
  disabled,
  children,
}) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const renderBody = () => (
    <CardBody p="0">
      <StyledImage src={bgSrc} alt={`nft-collection-card-${collectionName}`} height={125} width={375} />
      <Flex position="relative" justifyContent="center" pt="8px" mb="8px" mx="12px" flexDirection="column">
        {/* avatarSrc ? <CollectionAvatar src={avatarSrc} width={96} height={96} /> : '' */}
        <Heading
          color={disabled ? 'textDisabled' : 'body'}
          scale="h4"
          as="h3"
          mb={collectionSupply || collectionVolume ? '16px' : '0'}>
          {collectionName}
        </Heading>

        {collectionSupply || collectionVolume ? (
          <StyledCardDetailsContainer>
            {collectionVolume ? (
              <div>
                <Text small color={isDark ? '#818181' : '#969EAD'}>
                  {t('Volume')}
                </Text>
                <Text>{collectionVolume}</Text>
              </div>
            ) : (
              ''
            )}
            {collectionSupply ? (
              <div>
                <Text small color={isDark ? '#818181' : '#969EAD'}>
                  {t('Items')}
                </Text>
                <Text>{collectionSupply}</Text>
              </div>
            ) : (
              ''
            )}
          </StyledCardDetailsContainer>
        ) : (
          ''
        )}

        {children}
      </Flex>
    </CardBody>
  )

  return (
    <StyledCollectionCard disabled={disabled} data-test="hot-collection-card" background="transparent">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledCollectionCard>
  )
}

export default CollectionCard
