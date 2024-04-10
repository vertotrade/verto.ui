import { ReactNode } from 'react'
import { Flex, Box, FlexProps } from '@verto/uikit'
import Image from 'next/image'
import { StyledBannerImageWrapper } from './BannerImage'

interface BannerHeaderProps extends FlexProps {
  bannerImage: string
  bannerAlt?: string
  avatar?: ReactNode
}

const BannerHeader: React.FC<React.PropsWithChildren<BannerHeaderProps>> = ({
  bannerImage,
  bannerAlt,
  avatar,
  children,
  ...props
}) => {
  return (
    <Flex flexDirection="column" mb="24px" {...props}>
      <Box position="relative" pb="56px">
        <StyledBannerImageWrapper>
          <Image src={bannerImage} alt={bannerAlt} fill priority objectFit="cover" />
        </StyledBannerImageWrapper>
        <Box position="absolute" bottom={0} left="26px">
          <Box>
            {avatar}
            {children}
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}

export default BannerHeader
