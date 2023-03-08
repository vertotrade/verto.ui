import { Card, CardBody, Flex, Heading, ProfileAvatar, NextLinkFromReactRouter } from '@verto/uikit'

import Image from 'next/image'
import styled, { css } from 'styled-components'

interface CollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
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
  border-radius: 20px;
  border-bottom-left-radius: 56px;
  transition: opacity 200ms;
  height: 100%;
  max-width: 375px;
  margin: 0 auto;

  & > div {
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 20px;
    border-bottom-left-radius: 56px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`

const StyledImage = styled(Image)`
  height: 115px;
  width: 375px;
`

const CollectionCard: React.FC<React.PropsWithChildren<CollectionCardProps>> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
}) => {
  const renderBody = () => (
    <CardBody p="0">
      <StyledImage src={bgSrc} alt={`nft-collection-card-${collectionName}`} height={125} width={375} />
      <Flex
        position="relative"
        height="65px"
        justifyContent="center"
        alignItems="flex-end"
        pt="8px"
        mb="12px"
        mx="12px"
        flexDirection="column">
        <CollectionAvatar src={avatarSrc} width={96} height={96} />
        <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
          {collectionName}
        </Heading>
        {children}
      </Flex>
    </CardBody>
  )

  return (
    <StyledCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledCollectionCard>
  )
}

export default CollectionCard
