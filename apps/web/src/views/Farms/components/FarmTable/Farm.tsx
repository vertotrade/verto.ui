import { useFarmUser } from 'state/farms/hooks'
import { Farm as FarmUI, FarmTableFarmTokenInfoProps } from '@verto/uikit'
import { TokenPairImage } from 'components/TokenImage'

const { FarmTokenInfo } = FarmUI.FarmTable

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  rewardToken,
  label,
  pid,
  poolAddress,
  isReady,
  isStable,
}) => {
  const { stakedBalance, proxy } = useFarmUser(pid)

  return (
    <FarmTokenInfo
      pid={pid}
      poolAddress={poolAddress}
      label={label}
      token={token}
      quoteToken={quoteToken}
      isReady={isReady}
      isStable={isStable}
      stakedBalance={proxy?.stakedBalance?.gt(0) ? proxy?.stakedBalance : stakedBalance}>
      <TokenPairImage
        width={40}
        height={40}
        variant="inverted"
        primaryToken={token}
        secondaryToken={quoteToken}
        tertiaryToken={rewardToken}
      />
    </FarmTokenInfo>
  )
}

export default Farm
