import styled from 'styled-components'
import { Flex, Link, Skeleton, Text, TimerIcon, Balance, Pool } from '@verto/uikit'
import { getBlockExploreLink } from 'utils'
import { useCurrentBlock } from 'state/block/hooks'
import { useTranslation } from '@verto/localization'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { Token } from '@verto/sdk'

interface FinishCellProps {
  pool: Pool.DeserializedPool<Token>
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const EndsInCell: React.FC<React.PropsWithChildren<FinishCellProps>> = ({ pool }) => {
  const { sousId, startBlock, endBlock, isFinished, boostBlockStart } = pool
  const depositEndBlock = startBlock - boostBlockStart
  const currentBlock = useCurrentBlock()
  const { t } = useTranslation()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isCakePool = sousId === 0

  const renderBlocks = shouldShowBlockCountdown ? (
    <Flex alignItems="center">
      <Flex flex="1.3">
        <Balance fontSize="16px" value={blocksToDisplay} decimals={0} />
        <Text ml="4px" textTransform="lowercase">
          {t('Blocks')}
        </Text>
      </Flex>
      <Flex flex="1">
        <Link
          external
          href={getBlockExploreLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}
          onClick={e => e.stopPropagation()}>
          <TimerIcon ml="4px" />
        </Link>
      </Flex>
    </Flex>
  ) : (
    <Text>-</Text>
  )

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingBlockData = !currentBlock || (!blocksRemaining && !blocksUntilStart)
  const isLoadingPublicData = isLoadingBlockData
  const showLoading = isLoadingPublicData && !isCakePool && !isFinished
  let text = hasPoolStarted || !shouldShowBlockCountdown ? t('Ends in') : t('Starts in')

  if (boostBlockStart && currentBlock < depositEndBlock) {
    text = t('Deposit ends in')
  }

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {text}
        </Text>
        {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default EndsInCell
