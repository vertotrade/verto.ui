import { ReactNode } from 'react'
import { Box, BoxProps, Heading, Text, Message, MessageText } from '@verto/uikit'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { useTranslation } from '@verto/localization'

interface MarketPageTitleProps extends BoxProps {
  title: string
  description?: ReactNode
  address?: string
}

const MarketPageTitle: React.FC<React.PropsWithChildren<MarketPageTitleProps>> = ({
  title,
  description,
  children,
  address,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <Box pl="32px" {...props}>
      <Box mb="24px">
        <Heading as="h1" scale="xl" mb="8px" data-test="collection-detail-page-title">
          {title}
        </Heading>
        {DELIST_COLLECTIONS[address] ? (
          <Message variant="danger">
            <MessageText>{t('This collection has been inactived for a while. Trade at your own risk.')}</MessageText>
          </Message>
        ) : (
          <Text maxWidth="750px">{description}</Text>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default MarketPageTitle
