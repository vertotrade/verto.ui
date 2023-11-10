import { Flex } from '@verto/uikit'
// import { useTranslation } from '@verto/localization'
import { ERC20Token } from '@verto/sdk'
// import { AmountLabel } from './styles'
import { CollectionCard } from './index'

interface CollectionCardWithVolumeProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
  volume: number
  token: ERC20Token
}

const CollectionCardWithVolume: React.FC<CollectionCardWithVolumeProps> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  // volume,
  // token,
}) => {
  // const { t } = useTranslation()
  return (
    <CollectionCard bgSrc={bgSrc} avatarSrc={avatarSrc} collectionName={collectionName} url={url}>
      <Flex alignItems="center">
        {/* <Text fontSize="12px" color="textSubtle">
          {t('Volume')}
        </Text>
        <AmountLabel token={token} amount={volume} /> */}
      </Flex>
    </CollectionCard>
  )
}

export default CollectionCardWithVolume
