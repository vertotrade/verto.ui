import { Flex, Link, LinkExternal, Skeleton, Text, TimerIcon, Balance, Pool } from '@verto/uikit'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { formatDistance } from 'date-fns'
import BigNumber from 'bignumber.js'
import { rebus, rebusTestnet, rebusTestnetL2, rebusL2 } from 'utils/wagmi-chains'
import { useTranslation } from '@verto/localization'
import { ChainId, Token } from '@verto/sdk'
import { memo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import MaxStakeRow from './MaxStakeRow'
import { DurationAvg, PerformanceFee, TotalLocked, TotalStaked } from './Stat'

const blockExplorerUrl =
  DEFAULT_CHAIN_ID === ChainId.REBUS
    ? rebus.blockExplorers.default.url
    : DEFAULT_CHAIN_ID === ChainId.REBUS_L2
    ? rebusL2.blockExplorers.default.url
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? rebusTestnetL2.blockExplorers.default.url
    : rebusTestnet.blockExplorers.default.url

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({
  pool,
  account,
  showTotalStaked = true,
  alignLinksToRight = false,
}) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const {
    stakingToken,
    earningToken,
    liquidToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    vaultKey,
    profileRequirement,
    isFinished,
  } = pool

  const {
    totalCakeInVault,
    totalLockedAmount,
    fees: { performanceFeeAsDecimal },
    userData,
  } = useVaultPoolByKey(vaultKey)

  const tokenAddress = earningToken.address || ''
  const liquidTokenAddress = liquidToken?.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const rebusVaultContractAddress = getVaultPoolAddress(vaultKey)

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  let { withdrawFeePeriod } = pool

  if (pool.userInfo && withdrawFeePeriod) {
    const endTimestamp = new BigNumber(withdrawFeePeriod)
      .plus(new BigNumber((pool.userInfo.lastDepositedTime as any)._hex))
      .toString()

    if (new Date().getTime() / 1000 >= Number(`${endTimestamp}`)) {
      withdrawFeePeriod = 'None'
    } else {
      withdrawFeePeriod = formatDistance(new Date(), new Date(Number(`${endTimestamp}000`)))
    }
  } else {
    withdrawFeePeriod = `${Number(withdrawFeePeriod || 0) / 60 / 60} hours`
  }

  return (
    <>
      {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
        <Flex mb="8px" justifyContent="space-between">
          <Text small>{t('Requirement')}:</Text>
          <Text small textAlign="right">
            {profileRequirement.required && t('Verto Profile')}{' '}
            {profileRequirement.thresholdPoints.gt(0) && (
              <Text small>
                {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
              </Text>
            )}
          </Text>
        </Flex>
      )}
      {/* {!vaultKey && <AprInfo pool={pool} stakedBalance={stakedBalance} />} */}
      {showTotalStaked && (
        <TotalStaked totalStaked={vaultKey ? totalCakeInVault : totalStaked} stakingToken={stakingToken} />
      )}
      {vaultKey === VaultKey.RebusVault && <TotalLocked totalLocked={totalLockedAmount} lockedToken={stakingToken} />}
      {vaultKey === VaultKey.RebusVault && <DurationAvg />}
      {!isFinished && stakingLimit && stakingLimit.gt(0) && (
        <MaxStakeRow
          small
          currentBlock={currentBlock}
          hasPoolStarted={hasPoolStarted}
          stakingLimit={stakingLimit}
          stakingLimitEndBlock={stakingLimitEndBlock}
          stakingToken={stakingToken}
        />
      )}
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Deposit Fee')}:</Text>
        <Flex alignItems="center">
          <Text small>{((Number(pool.depositFee) || 0) / 100).toFixed(2)}%</Text>
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Withdraw Fee')}:</Text>
        <Flex alignItems="center">
          <Text small>{((Number(pool.withdrawFee) || 0) / 100).toFixed(2)}%</Text>
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Withdraw Fee Period')}:</Text>
        <Flex alignItems="center">
          <Text small>{withdrawFeePeriod}</Text>
        </Flex>
      </Flex>
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
          {blocksRemaining || blocksUntilStart ? (
            <Flex alignItems="center">
              <Link
                external
                href={getBlockExploreLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}
                hoverBackgroundColor="transparent">
                <Balance small value={blocksToDisplay} decimals={0} color="text" />
                <Text small ml="4px" color="text" textTransform="lowercase">
                  {t('Blocks')}
                </Text>
                <TimerIcon ml="4px" color="text" />
              </Link>
            </Flex>
          ) : (
            <Skeleton width="54px" height="21px" />
          )}
        </Flex>
      )}
      {vaultKey && <PerformanceFee userData={userData} performanceFeeAsDecimal={performanceFeeAsDecimal} />}
      {/* <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${earningToken.address}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex> */}
      {!vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={earningToken.projectLink} bold={false} small hoverBackgroundColor="transaprent">
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
      )}
      {vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal
            href="https://docs.vertotrade.com/products/res-pool/new-verto-pool"
            bold={false}
            small
            hoverBackgroundColor="transaprent">
            {t('View Tutorial')}
          </LinkExternal>
        </Flex>
      )}
      {poolContractAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'space-between'}>
          <LinkExternal
            isBscScan
            href={`${blockExplorerUrl}/address/${vaultKey ? rebusVaultContractAddress : poolContractAddress}`}
            bold={false}
            hoverBackgroundColor="transaprent"
            small>
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="vertoLink"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: '21px' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={tokenAddress}
            tokenSymbol={earningToken.symbol}
            tokenDecimals={earningToken.decimals}
            tokenLogo={`${window.origin}/images/tokens/${tokenAddress}.png`}
          />
        </Flex>
      )}
      {account && liquidTokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="vertoLink"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: '21px' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={liquidTokenAddress}
            tokenSymbol={liquidToken.symbol}
            tokenDecimals={liquidToken?.decimals}
            tokenLogo={`${window.origin}/images/tokens/${liquidTokenAddress}.png`}
          />
        </Flex>
      )}
    </>
  )
}

export default memo(PoolStatsInfo)
