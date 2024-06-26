import { Text, TextProps } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { MarketEvent } from '../../../../../state/nftMarket/types'

interface ActivityEventTextProps extends TextProps {
  marketEvent: MarketEvent
}

const ActivityEventText: React.FC<React.PropsWithChildren<ActivityEventTextProps>> = ({ marketEvent, ...props }) => {
  const { t } = useTranslation()

  const events = {
    [MarketEvent.NEW]: {
      text: t('Listed'),
      color: 'text',
    },
    [MarketEvent.CANCEL]: {
      text: t('Delisted'),
      color: 'textSubtle',
    },
    [MarketEvent.MODIFY]: {
      text: t('Modified'),
      color: 'textSubtle',
    },
    [MarketEvent.BUY]: {
      text: t('Bought'),
      color: 'success',
    },
    [MarketEvent.SELL]: {
      text: t('Sold'),
      color: 'failure',
    },
  }

  return (
    <Text {...props} color={events[marketEvent].color}>
      {events[marketEvent].text}
    </Text>
  )
}

export default ActivityEventText
