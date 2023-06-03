import { useTranslation } from '@verto/localization'
import { ChainId } from '@verto/sdk'
import {
  Box,
  Flex,
  ModalRow,
  InjectedModalProps,
  Modal,
  QuestionHelper,
  Text,
  ThemeSwitcher,
  Toggle,
} from '@verto/uikit'
import { SUPPORT_ZAP } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useCallback, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useExpertModeManager,
  useSubgraphHealthIndicatorManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
  useUserUsernameVisibility,
  useZapModeManager,
} from 'state/user/hooks'
import { useStableSwapByDefault } from 'state/user/smartRouter'
import styled from 'styled-components'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'
import TransactionSettings from './TransactionSettings'
import { SettingsMode } from './types'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const withCustomOnDismiss =
  Component =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [zapMode, toggleZapMode] = useZapModeManager()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()
  const [isStableSwapByDefault, setIsStableSwapByDefault] = useStableSwapByDefault()

  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal title={t(mode === SettingsMode.GLOBAL ? 'Global settings' : 'Swap settings')} onDismiss={onDismiss}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex flexDirection="column">
              {/* <Text bold textTransform="uppercase" fontSize="18px" color="secondary" mb="24px"> */}
              {/*   {t('Global')} */}
              {/* </Text> */}
              <ModalRow justifyContent="space-between">
                <Text bold small>
                  {t('Dark mode')}
                </Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </ModalRow>
              <ModalRow justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <Text bold small>
                    {t('Subgraph Health Indicator')}
                  </Text>
                  <QuestionHelper
                    text={t(
                      'Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </ModalRow>
              <ModalRow justifyContent="space-between" alignItems="center" last>
                <Flex alignItems="center">
                  <Text bold small>
                    {t('Show username')}
                  </Text>
                  <QuestionHelper
                    text={t('Shows username of wallet instead of bunnies')}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-username-visibility"
                  checked={userUsernameVisibility}
                  onChange={() => {
                    setUserUsernameVisibility(!userUsernameVisibility)
                  }}
                />
              </ModalRow>
              {chainId === ChainId.BSC && <GasSettings />}
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex flexDirection="column">
              {/* <Text bold textTransform="uppercase" fontSize="18px" color="primary" mb="24px"> */}
              {/*   {t('Swaps & Liquidity')} */}
              {/* </Text> */}
              <Flex justifyContent="space-between" alignItems="center" mb={chainId === ChainId.BSC ? '24px' : '0px'}>
                {chainId === ChainId.BSC && <GasSettings />}
              </Flex>
              <TransactionSettings />
            </Flex>
            {SUPPORT_ZAP.includes(chainId) && (
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text bold small>
                    {t('Zap (Beta)')}
                  </Text>
                  <QuestionHelper
                    text={
                      <Box>
                        <Text>
                          {t(
                            'Zap enables simple liquidity provision. Add liquidity with one token and one click, without manual swapping or token balancing.',
                          )}
                        </Text>
                        <Text>
                          {t(
                            'If you experience any issue when adding or removing liquidity, please disable Zap and retry.',
                          )}
                        </Text>
                      </Box>
                    }
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  checked={zapMode}
                  onChange={() => {
                    toggleZapMode(!zapMode)
                  }}
                />
              </Flex>
            )}
            <ModalRow justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Text bold small>
                  {t('Expert Mode')}
                </Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle id="toggle-expert-mode-button" checked={expertMode} onChange={handleExpertModeToggle} />
            </ModalRow>
            <ModalRow justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Text bold small>
                  {t('Disable Multihops')}
                </Text>
                <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" />
              </Flex>
              <Toggle
                id="toggle-disable-multihop-button"
                checked={singleHopOnly}
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
              />
            </ModalRow>
            <ModalRow justifyContent="space-between" alignItems="center" last>
              <Flex alignItems="center">
                <Text bold small>
                  {t('Use StableSwap by default')}
                </Text>
                <QuestionHelper
                  text={
                    <Flex>
                      <Text mr="5px">
                        {t(
                          'Stableswap will enable users to save fees on trades. Output cannot be edited for routes that include StableSwap',
                        )}
                      </Text>
                    </Flex>
                  }
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-disable-smartRouter-button"
                checked={isStableSwapByDefault}
                onChange={e => setIsStableSwapByDefault(e.target.checked)}
              />
            </ModalRow>
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
