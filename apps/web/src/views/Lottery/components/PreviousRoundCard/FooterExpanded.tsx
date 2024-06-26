import { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Balance } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { LotteryRound, LotteryRoundGraphEntity } from 'state/types'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { getGraphLotteries } from 'state/lottery/getLotteriesData'
import { formatNumber, getBalanceNumber } from '@verto/utils/formatBalance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PrizePotSection = styled(Flex)`
  min-width: 110px;
`

const PreviousRoundCardFooter: React.FC<
  React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string }>
> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const [, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
  const lotteryGraphDataFromState = useGetLotteryGraphDataById(lotteryId)
  const cakePriceBusd = usePriceCakeBusd()

  useEffect(() => {
    const getGraphData = async () => {
      const fetchedGraphData = await getGraphLotteries(undefined, undefined, { id_in: [lotteryId] })
      setFetchedLotteryGraphData(fetchedGraphData[0])
    }
    if (!lotteryGraphDataFromState) {
      getGraphData()
    }
  }, [lotteryGraphDataFromState, lotteryId])

  let prizeInBusd = new BigNumber(NaN)
  if (lotteryNodeData) {
    const { amountCollectedInCake } = lotteryNodeData
    prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  }

  // todo: use this function to get total players when graph is fixed
  // const getTotalUsers = (): string => {
  //   if (!lotteryGraphDataFromState && fetchedLotteryGraphData) {
  //     return fetchedLotteryGraphData?.totalUsers?.toLocaleString()
  //   }

  //   if (lotteryGraphDataFromState) {
  //     return lotteryGraphDataFromState?.totalUsers?.toLocaleString()
  //   }

  //   return null
  // }

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={200} />
        ) : (
          <Heading scale="xl" lineHeight="1" color="primary">
            ~${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)}
          </Heading>
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            unit=" Verto"
            value={getBalanceNumber(lotteryNodeData?.amountCollectedInCake)}
            decimals={0}
          />
        )}
      </>
    )
  }

  return (
    <NextDrawWrapper>
      <PrizePotSection mr="24px" flexDirection="column" justifyContent="space-between">
        <Box>
          <Heading>{t('Prize pot')}</Heading>
          {getPrizeBalances()}
        </Box>
      </PrizePotSection>
      <RewardBrackets lotteryNodeData={lotteryNodeData} isHistoricRound />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter
