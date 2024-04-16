import { useCallback, useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, useTooltip, Skeleton, Select, OptionProps } from '@verto/uikit'
import { escapeRegExp } from 'utils'
import { useTranslation } from '@verto/localization'
import { ERC20Token } from '@verto/sdk'
import { CollectionStructOutput } from 'config/abi/types/NftMarket'
import { Divider } from '../shared/styles'
import { GreyedOutContainer, AmountCell, RightAlignedInput, FeeAmountCell } from './styles'

interface SetPriceStageProps {
  contractCollection: CollectionStructOutput
  variant: 'set' | 'adjust'
  currentPrice?: string
  lowestPrice?: number
  nftTokenAddress?: string
  price: string
  setPrice: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
  token: ERC20Token
  setToken: React.Dispatch<React.SetStateAction<ERC20Token>>
  tokenPrice?: number
  tokensToShow: OptionProps[]
}

const MIN_PRICE = 1

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<React.PropsWithChildren<SetPriceStageProps>> = ({
  contractCollection,
  variant,
  lowestPrice,
  currentPrice,
  nftTokenAddress,
  price,
  setPrice,
  continueToNextStage,
  token,
  setToken,
  tokenPrice,
  tokensToShow,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const adjustedPriceIsTheSame =
    variant === 'adjust' && parseFloat(currentPrice) === parseFloat(price) && nftTokenAddress === token.address
  const priceIsValid = !price || Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0

  const creatorFee = contractCollection.creatorFee.div(100).toString()
  const tradingFee = contractCollection.tradingFee.div(100).toString()
  const creatorFeeAsNumber = parseFloat(creatorFee)
  const tradingFeeAsNumber = parseFloat(tradingFee)
  const priceAsFloat = parseFloat(price)
  const priceInUsd = tokenPrice * priceAsFloat || 0

  const priceIsOutOfRange = priceAsFloat < MIN_PRICE

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setPrice(nextUserInput)
    }
  }

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'When selling NFTs from this collection, a portion of the %symbol% paid will be diverted before reaching the seller:',
          { symbol: token?.symbol },
        )}
      </Text>
      {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to buy & burn VERTO', { percentage: tradingFee })}</Text>
    </>,
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const getButtonText = () => {
    if (variant === 'adjust') {
      if (adjustedPriceIsTheSame || priceIsValid) {
        return t('Input New Sale Price')
      }
      return t('Confirm')
    }
    return t('Enable Listing')
  }

  const handleChange = useCallback(
    (option: OptionProps) => {
      setToken(option.value)
    },
    [setToken],
  )

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {variant === 'set' ? t('Set Currency') : t('Adjust Sale Currency')}
      </Text>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb={2}>
          {t('Set Price')}
        </Text>
        <Flex>
          <Select options={tokensToShow} onOptionChange={handleChange} defaultOptionIndex={0} mr={2} />
          <RightAlignedInput
            scale="md"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            inputMode="decimal"
            value={price}
            ref={inputRef}
            isWarning={priceIsOutOfRange}
            ml={2}
            onChange={e => {
              enforcer(e.target.value.replace(/,/g, '.'))
            }}
          />
        </Flex>
        <Flex alignItems="center" height="21px" justifyContent="flex-end">
          {!Number.isNaN(priceInUsd) && (
            <Text fontSize="12px" color="textSubtle">
              {`$${priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
          )}
        </Flex>
        {priceIsOutOfRange && (
          <Text fontSize="12px" color="failure">
            {t('The minimum price should be %minPrice% %symbol%', {
              minPrice: MIN_PRICE,
              symbol: token?.symbol,
            })}
          </Text>
        )}
        <Flex mt="8px">
          {Number.isFinite(creatorFeeAsNumber) && Number.isFinite(tradingFeeAsNumber) ? (
            <>
              <Text small color="textSubtle" mr="8px">
                {t('Seller pays %percentage%% platform fee on sale', {
                  percentage: creatorFeeAsNumber + tradingFeeAsNumber,
                })}
              </Text>
              <span ref={targetRef}>
                <ErrorIcon />
              </span>
              {tooltipVisible && tooltip}
            </>
          ) : (
            <Skeleton width="70%" />
          )}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Platform fee if sold')}
          </Text>
          {Number.isFinite(creatorFeeAsNumber) && Number.isFinite(tradingFeeAsNumber) ? (
            <FeeAmountCell
              amount={priceAsFloat}
              creatorFee={creatorFeeAsNumber}
              tradingFee={tradingFeeAsNumber}
              token={token}
            />
          ) : (
            <Skeleton width={40} />
          )}
        </Flex>
        {lowestPrice && (
          <Flex justifyContent="space-between" alignItems="center" mt="16px">
            <Text small color="textSubtle">
              {t('Lowest price on market')}
            </Text>
            <AmountCell amount={lowestPrice} token={token} />
          </Flex>
        )}
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The NFT will be removed from your wallet and put on sale at this price.')}
          </Text>
          <Text small color="textSubtle">
            {t('Sales are in WREBUS. You can swap WREBUS to REBUS 1:1 for free with VertoTrade.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}>
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
