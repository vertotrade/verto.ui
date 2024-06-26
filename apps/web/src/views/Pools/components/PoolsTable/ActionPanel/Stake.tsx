import {
  AddIcon,
  Button,
  Flex,
  IconButton,
  MinusIcon,
  HelpIcon,
  Skeleton,
  Text,
  useModal,
  useTooltip,
  Box,
  SkeletonV2,
  useMatchBreakpoints,
  Balance,
  Pool,
} from '@verto/uikit'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import { useERC20 } from 'hooks/useContract'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedRebusVault } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import styled from 'styled-components'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { getBalanceNumber, getFullDisplayBalance } from '@verto/utils/formatBalance'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import isUndefinedOrNull from '@verto/utils/isUndefinedOrNull'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'
import { Token } from '@verto/sdk'
import { BSC_BLOCK_TIME } from 'config'
import { useInitialBlock } from 'state/block/hooks'

import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../RebusVaultCard/VaultStakeModal'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import StakeModal from '../../Modals/StakeModal'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { VaultStakeButtonGroup } from '../../Vault/VaultStakeButtonGroup'
import AddCakeButton from '../../LockedPool/Buttons/AddCakeButton'
import ExtendButton from '../../LockedPool/Buttons/ExtendDurationButton'
import AfterLockedActions from '../../LockedPool/Common/AfterLockedActions'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'
import BurningCountDown from '../../LockedPool/Common/BurningCountDown'
import LockedStakedModal from '../../LockedPool/Modals/LockedStakeModal'

const IconButtonWrapper = styled.div`
  display: flex;
`
const circularButtonStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
}

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({ pool }) => {
  const initialBlock = useInitialBlock()
  const threshHold = initialBlock > 0 ? initialBlock + POOL_START_BLOCK_THRESHOLD : 0
  const {
    sousId,
    stakingToken,
    earningToken,
    liquidToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    liquidTokenPrice,
    vaultKey,
    profileRequirement,
    userDataLoaded,
    isBoosted,
    startBlock,
    endBlock,
    boostBlockStart,
    isLiquid,
  } = pool
  const depositEndBlock = startBlock - boostBlockStart
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(vaultKey)
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(vaultKey, setLastUpdated)

  const handleApprove = vaultKey ? handleVaultApprove : handlePoolApprove
  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance =
    getBalanceNumber(stakedBalance.multipliedBy(stakingTokenPrice), stakingToken.decimals) || 0

  const liquidAmountAvailable = userData?.amountAvailable ? new BigNumber(userData.amountAvailable) : BIG_ZERO
  const liquidTokenBalance = getBalanceNumber(liquidAmountAvailable, liquidToken?.decimals)
  const liquidTokenDollarBalance =
    getBalanceNumber(liquidAmountAvailable.multipliedBy(liquidTokenPrice), liquidToken?.decimals) || 0

  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: {
      userShares,
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
    },
  } = vaultData

  const { lockEndDate, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.RebusVault
        ? (vaultData as DeserializedLockedRebusVault).userData?.lockStartTime ?? '0'
        : '0',
    lockEndTime:
      vaultKey === VaultKey.RebusVault ? (vaultData as DeserializedLockedRebusVault).userData?.lockEndTime ?? '0' : '0',
    burnStartTime:
      vaultKey === VaultKey.RebusVault
        ? (vaultData as DeserializedLockedRebusVault).userData?.burnStartTime ?? '0'
        : '0',
  })

  const hasSharesStaked = userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal pool={pool} stakingTokenBalance={stakingTokenBalance} stakingTokenPrice={stakingTokenPrice} />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={isLiquid ? liquidAmountAvailable : stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const onStake = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const isStakeEnabled = useMemo(
    () => (!isBoosted || Number(startBlock) >= threshHold) && (!boostBlockStart || depositEndBlock > threshHold),
    [isBoosted, startBlock, threshHold, boostBlockStart, depositEndBlock],
  )
  const isUnstakeEnabled = useMemo(() => !isBoosted || Number(endBlock) < threshHold, [isBoosted, endBlock, threshHold])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    !isStakeEnabled
      ? t('You cannot stake any more in this pool because it has started!')
      : t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const {
    targetRef: unstakeTargetRef,
    tooltip: unstakeTooltip,
    tooltipVisible: unstakeTooltipVisible,
  } = useTooltip(t('You can only unstake from this pool after it finishes!'), { placement: 'bottom' })

  const tooltipContentOfBurn = t(
    'After Burning starts at %burnStartTime%. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.',
    { burnStartTime },
  )
  const {
    targetRef: tagTargetRefOfBurn,
    tooltip: tagTooltipOfBurn,
    tooltipVisible: tagTooltipVisibleOfBurn,
  } = useTooltip(tooltipContentOfBurn, {
    placement: 'bottom',
  })

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval && !isNotVaultAndHasStake && !isVaultWithShares) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
            {t('Enable')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    const vaultPosition = getVaultPosition(vaultData.userData)
    return (
      <>
        <ActionContainer flex={vaultPosition > 1 ? 1.5 : 1}>
          <ActionContent mt={0}>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <Flex flex="1" flexDirection="column" alignSelf="flex-start">
                <ActionTitles>
                  <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                    {stakingToken.symbol}{' '}
                  </Text>
                  <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                    {vaultKey === VaultKey.RebusVault && (vaultData as DeserializedLockedRebusVault).userData.locked
                      ? t('Locked')
                      : t('Staked')}
                  </Text>
                </ActionTitles>
                <ActionContent>
                  <Box position="relative">
                    <Balance
                      lineHeight="1"
                      bold
                      fontSize="20px"
                      decimals={5}
                      value={vaultKey ? cakeAsNumberBalance : stakedTokenBalance}
                    />
                    <SkeletonV2
                      isDataReady={Number.isFinite(vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance)}
                      width={120}
                      wrapperProps={{ height: '20px' }}
                      skeletonTop="2px">
                      <Balance
                        fontSize="12px"
                        display="inline"
                        color="textSubtle"
                        decimals={2}
                        value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                        unit=" USD"
                        prefix="~"
                      />
                    </SkeletonV2>
                  </Box>
                </ActionContent>
                {vaultPosition === VaultPosition.Locked && (
                  <Box mt="16px">
                    <AddCakeButton
                      lockEndTime={(vaultData as DeserializedLockedRebusVault).userData.lockEndTime}
                      lockStartTime={(vaultData as DeserializedLockedRebusVault).userData.lockStartTime}
                      currentLockedAmount={cakeAsBigNumber}
                      stakingToken={stakingToken}
                      currentBalance={stakingTokenBalance}
                      stakingTokenBalance={stakingTokenBalance}
                    />
                  </Box>
                )}
              </Flex>
              {isLiquid && (
                <Flex flex="1" flexDirection="column" alignSelf="flex-start">
                  <ActionTitles>
                    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                      {liquidToken.symbol}{' '}
                    </Text>
                    <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                      {t('Available')}
                    </Text>
                  </ActionTitles>
                  <ActionContent>
                    <Box position="relative">
                      <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={liquidTokenBalance} />
                      <Balance
                        fontSize="12px"
                        display="inline"
                        color="textSubtle"
                        decimals={2}
                        value={liquidTokenDollarBalance}
                        unit=" USD"
                        prefix="~"
                      />
                    </Box>
                  </ActionContent>
                </Flex>
              )}
            </Flex>
            {vaultPosition >= VaultPosition.Locked && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {t('Unlocks In')}
                </Text>
                <Text
                  lineHeight="1"
                  mt="5px"
                  bold
                  fontSize="20px"
                  color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}>
                  {vaultPosition >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
                  {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
                  <span ref={tagTargetRefOfBurn}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </span>
                </Text>
                <Text
                  height="20px"
                  fontSize="12px"
                  display="inline"
                  color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}>
                  {t('On %date%', { date: lockEndDate })}
                </Text>
                {vaultPosition === VaultPosition.Locked && (
                  <Box mt="16px">
                    <ExtendButton
                      lockEndTime={(vaultData as DeserializedLockedRebusVault).userData.lockEndTime}
                      lockStartTime={(vaultData as DeserializedLockedRebusVault).userData.lockStartTime}
                      stakingToken={stakingToken}
                      currentBalance={stakingTokenBalance}
                      currentLockedAmount={cakeAsNumberBalance}>
                      {t('Extend')}
                    </ExtendButton>
                  </Box>
                )}
              </Flex>
            )}
            {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
              <IconButtonWrapper>
                {!isUnstakeEnabled ? (
                  <span ref={unstakeTargetRef}>
                    <IconButton variant="secondary" disabled mr="6px" style={circularButtonStyle}>
                      <MinusIcon color="textDisabled" width="24px" height="24px" />
                    </IconButton>
                  </span>
                ) : (
                  <IconButton variant="secondary" onClick={onUnstake} mr="6px" style={circularButtonStyle}>
                    <MinusIcon color="invertedContrast" width="14px" />
                  </IconButton>
                )}
                {reachStakingLimit || !isStakeEnabled ? (
                  <span ref={targetRef}>
                    <IconButton variant="secondary" disabled style={circularButtonStyle}>
                      <AddIcon color="textDisabled" width="24px" height="24px" />
                    </IconButton>
                  </span>
                ) : (
                  <IconButton
                    variant="secondary"
                    onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                    disabled={isFinished}
                    style={circularButtonStyle}>
                    <AddIcon color="invertedContrast" width="14px" />
                  </IconButton>
                )}
              </IconButtonWrapper>
            )}
            {!isMobile && vaultPosition >= VaultPosition.LockedEnd && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
                </Text>
                <Text lineHeight="1" mt="8px" bold fontSize="20px" color="failure">
                  {vaultPosition === VaultPosition.AfterBurning ? (
                    isUndefinedOrNull((vaultData as DeserializedLockedRebusVault).userData.currentOverdueFee) ? (
                      '-'
                    ) : (
                      t('%amount% Burned', {
                        amount: getFullDisplayBalance(
                          (vaultData as DeserializedLockedRebusVault).userData.currentOverdueFee,
                          18,
                          5,
                        ),
                      })
                    )
                  ) : (
                    <BurningCountDown lockEndTime={(vaultData as DeserializedLockedRebusVault).userData.lockEndTime} />
                  )}
                </Text>
              </Flex>
            )}
            {tooltipVisible && tooltip}
            {unstakeTooltipVisible && unstakeTooltip}
          </ActionContent>
        </ActionContainer>
        {isMobile && vaultPosition >= VaultPosition.LockedEnd && (
          <Flex mb="24px" justifyContent="space-between">
            <Text fontSize="14px" color="failure" as="span">
              {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
            </Text>
            <Text fontSize="14px" bold color="failure">
              {vaultPosition === VaultPosition.AfterBurning ? (
                isUndefinedOrNull((vaultData as DeserializedLockedRebusVault).userData.currentOverdueFee) ? (
                  '-'
                ) : (
                  t('%amount% Burned', {
                    amount: getFullDisplayBalance(
                      (vaultData as DeserializedLockedRebusVault).userData.currentOverdueFee,
                      18,
                      5,
                    ),
                  })
                )
              ) : (
                <BurningCountDown lockEndTime={(vaultData as DeserializedLockedRebusVault).userData.lockEndTime} />
              )}
            </Text>
          </Flex>
        )}
        {[VaultPosition.AfterBurning, VaultPosition.LockedEnd].includes(vaultPosition) && (
          <Box
            width="100%"
            mt={['0', '0', '24px', '24px', '24px']}
            ml={['0', '0', '12px', '12px', '12px', '32px']}
            mr={['0', '0', '12px', '12px', '12px', '0px']}>
            <AfterLockedActions
              isInline
              position={vaultPosition}
              currentLockedAmount={cakeAsNumberBalance}
              stakingToken={stakingToken}
              lockEndTime="0"
              lockStartTime="0"
            />
          </Box>
        )}
        {vaultKey === VaultKey.RebusVault && vaultPosition === VaultPosition.Flexible && (
          <Box
            width="100%"
            mt={['0', '0', '24px', '24px', '24px']}
            ml={['0', '0', '12px', '12px', '32px']}
            mr={['0', '0', '12px', '12px', '0']}>
            <ConvertToLock stakingToken={stakingToken} currentStakedAmount={cakeAsNumberBalance} isInline />
          </Box>
        )}
      </>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Stake')}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {stakingToken.symbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        {vaultKey ? (
          <VaultStakeButtonGroup
            onFlexibleClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            onLockedClick={vaultKey === VaultKey.RebusVault ? openPresentLockedStakeModal : null}
          />
        ) : (
          <Button
            width="100%"
            onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            variant="secondary"
            disabled={isFinished || !isStakeEnabled}>
            {t('Stake')}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
