import { useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Button, Input, PercentageInput, Flex, ModalRow, Box, QuestionHelper } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTtl(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex flexDirection="column">
      <ModalRow flexDirection="column">
        <Flex mb="8px">
          <Text bold small>
            {t('Slippage Tolerance')}
          </Text>
          <QuestionHelper
            text={t(
              'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
            )}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex flexWrap="wrap">
          <Button
            mr="4px"
            scale="newSm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
            variant={userSlippageTolerance === 10 ? 'vertoPrimary' : 'vertoSecondary'}>
            0.1%
          </Button>
          <Button
            mx="4px"
            scale="newSm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
            variant={userSlippageTolerance === 50 ? 'vertoPrimary' : 'vertoSecondary'}>
            0.5%
          </Button>
          <Button
            mx="4px"
            scale="newSm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
            variant={userSlippageTolerance === 100 ? 'vertoPrimary' : 'vertoSecondary'}>
            1.0%
          </Button>
          <PercentageInput
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]{0,2}$"
            placeholder={(userSlippageTolerance / 100).toFixed(2)}
            value={slippageInput}
            onBlur={() => {
              parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
            }}
            onChange={event => {
              if (event.currentTarget.validity.valid) {
                parseCustomSlippage(event.target.value.replace(/,/g, '.'))
              }
            }}
            isWarning={!slippageInputIsValid}
            isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
          />
        </Flex>
        {!!slippageError && (
          <Text bold small color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </ModalRow>
      <ModalRow flexDirection="column" justifyContent="center" alignItems="flex-start">
        <Flex alignItems="center" mb="8px">
          <Text bold small>
            {t('Tx deadline (mins)')}
          </Text>
          <QuestionHelper
            text={t('Your transaction will revert if it is left confirming for longer than this time.')}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex>
          <Box width="176px">
            <Input
              inputMode="numeric"
              pattern="^[0-9]+$"
              isWarning={!!deadlineError}
              onBlur={() => {
                parseCustomDeadline((ttl / 60).toString())
              }}
              placeholder={(ttl / 60).toString()}
              value={deadlineInput}
              onChange={event => {
                if (event.currentTarget.validity.valid) {
                  parseCustomDeadline(event.target.value)
                }
              }}
            />
          </Box>
        </Flex>
      </ModalRow>
    </Flex>
  )
}

export default SlippageTabs
