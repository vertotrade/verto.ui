import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useState, memo, useRef, useEffect, useCallback } from 'react'
import { useFetchPairPrices } from 'state/swap/hooks'
import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
import PairPriceDisplay from '../../../../components/PairPriceDisplay'
import { getTimeWindowChange } from './utils'

const SwapLineChart = dynamic(() => import('./SwapLineChart'), {
  ssr: false,
})

const BasicChart = ({ token0Address, token1Address, isChartExpanded, inputCurrency, outputCurrency, isMobile }) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)

  const {
    pairPrices = [],
    pairId,
    hasError,
  } = useFetchPairPrices({
    inputCurrency,
    outputCurrency,
    timeWindow,
  })
  const mountedRef = useRef(false)
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value

  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
  const isChangePositive = changeValue >= 0
  const chartHeight = isChartExpanded ? 'calc(100vh - 220px)' : '378px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    hasError ||
    !pairId ||
    (pairPrices &&
      pairPrices.length > 0 &&
      pairPrices.every(
        price => (!price.value && price.value !== 0) || price.value === Infinity || Number.isNaN(price.value),
      ))

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const onSetHoverValue = useCallback(arg => {
    if (mountedRef.current) {
      setHoverValue(arg)
    }
  }, [])

  const onSetHoverDate = useCallback(arg => {
    if (mountedRef.current) {
      setHoverDate(arg)
    }
  }, [])

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px">
        <Flex flexDirection="column" pt="12px">
          <PairPriceDisplay
            isLoading={!pairPrices?.length}
            value={valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}>
            {!!valueToDisplay && (
              <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" ml="4px" bold>
                {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
              </Text>
            )}
          </PairPriceDisplay>
          <Text small color="primary">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box>
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} p={isMobile ? '0px' : '16px'} width="100%">
        <SwapLineChart
          data={pairPrices}
          setHoverValue={onSetHoverValue}
          setHoverDate={onSetHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default memo(BasicChart, (prev, next) => {
  return (
    prev.token0Address === next.token0Address &&
    prev.token1Address === next.token1Address &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isMobile === next.isMobile &&
    prev.isChartExpanded === next.isChartExpanded
  )
})
