import { useTranslation } from '@verto/localization'
import { Currency } from '@verto/sdk'
import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints, Button, useModal } from '@verto/uikit'
import { AppBody } from 'components/App'
import { useContext, useCallback } from 'react'

import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useAccount } from 'wagmi'
import { AtomBox } from '@verto/ui/components/AtomBox'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/swap/actions'
import { useSingleTokenSwapInfo, useSwapState } from '../../state/swap/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import HotTokenList from './components/HotTokenList'
import { SmartSwapForm } from './SmartSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import BuyTokenModal from '../../components/BuyTokenModal/BuyTokenModal'

export default function Swap() {
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }
  const isWrappingSwap = [inputCurrency?.symbol, outputCurrency?.symbol].includes('REBUS')

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)
  const [onPresentBuyToken] = useModal(<BuyTokenModal />)
  const handleBuyToken = useCallback((): void => {
    onPresentBuyToken()
  }, [onPresentBuyToken])

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        {!isMobile && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {isMobile && isChartSupported && !isWrappingSwap && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isMobile
                isFullWidthContainer
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={setIsChartDisplayed}
          />
        )}
        {!isMobile && isSwapHotTokenDisplay && isChartSupported && <HotTokenList />}

        <ModalV2
          isOpen={isMobile && isSwapHotTokenDisplay && isChartSupported}
          onDismiss={() => setIsSwapHotTokenDisplay(false)}>
          <Modal
            style={{ padding: 0 }}
            title={t('Top Token')}
            onDismiss={() => setIsSwapHotTokenDisplay(false)}
            bodyPadding="0px">
            <HotTokenList />
          </Modal>
        </ModalV2>

        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt="0">
              <AppBody>
                <SmartSwapForm />
                {account && (
                  <AtomBox display={{ xs: 'none', md: 'flex' }} height="100%" alignItems="center">
                    <Button variant="secondary" width="100%" minHeight={48} mt="2" onClick={handleBuyToken}>
                      {t('Buy Tokens')}
                    </Button>
                  </AtomBox>
                )}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
