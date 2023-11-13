import styled from 'styled-components'
import Link from 'next/link'
import { Box, Flex, Text } from '@verto/uikit'
import truncateHash from '@verto/utils/truncateHash'
import { defaultChain } from 'utils'

const StyledFlex = styled(Flex)<{ disableLink?: boolean }>`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: ${props => (props.disableLink ? 1 : 0.5)};
  }
`

const ProfileCell: React.FC<React.PropsWithChildren<{ accountAddress: string; disableLink?: boolean }>> = ({
  accountAddress,
  disableLink,
}) => {
  // const { profile, isFetching } = useProfileForAddress(accountAddress)
  // const profileName = profile?.username || '-'
  const content = (
    <StyledFlex disableLink={disableLink}>
      {/* {!isFetching ? (
        <ProfileAvatar
          width={32}
          height={32}
          mr={['4px', null, '12px']}
          src={profile?.nft?.image?.thumbnail}
          style={{ minWidth: '32px', minHeight: '32px' }}
        />
      ) : (
        <Skeleton variant="circle" width="32px" height="32px" mr={['4px', null, '12px']} />
      )} */}
      <Box display="inline">
        <Text lineHeight="1.25">{truncateHash(accountAddress)}</Text>
        {/* {isFetching ? <Skeleton /> : <Text lineHeight="1.25">{profileName}</Text>} */}
      </Box>
    </StyledFlex>
  )

  if (disableLink) {
    return content
  }

  return (
    <Link href={`${defaultChain.blockExplorers.default.url}/address/${accountAddress}`} target="_blank">
      {content}
    </Link>
  )
}

export default ProfileCell
