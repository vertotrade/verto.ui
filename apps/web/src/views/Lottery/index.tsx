import { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton, PageSection } from '@verto/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import NextDrawCard from './components/NextDrawCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import HowToPlay from './components/HowToPlay'
import useShowMoreUserHistory from './hooks/useShowMoreUserRounds'
import { PageMeta } from '../../components/Layout/Page'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const { numUserRoundsRequested, handleShowMoreUserRounds } = useShowMoreUserHistory()

  return (
    <>
      <PageMeta />
      <LotteryPage>
        <PageSection
          background={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.background}
          index={1}
          innerProps={{ style: { marginLeft: '0px', marginRight: '0px', width: '100%' } }}
          hasCurvedDivider={false}>
          <Hero />
        </PageSection>
        <PageSection
          background={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.background}
          innerProps={{
            style: { marginLeft: '0px', marginRight: '0px', width: '100%', maxWidth: 'unset', padding: '48px 0px' },
          }}
          hasCurvedDivider={false}
          index={2}>
          <CheckPrizesSection />
        </PageSection>
        {/* <PageSection
          containerProps={{ style: { marginTop: '-30px' } }}
          background={theme.colors.vertoBg1}
          concaveDivider
          clipFill={{ light: theme.colors.vertoBg1 }}
          dividerPosition="top"
          index={2}>
          <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="24px">
            {status === LotteryStatus.OPEN && (
              <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
                {t('Get your tickets now!')}
              </Heading>
            )}
            <Flex alignItems="center" justifyContent="center" mb="48px">
              {nextEventTime && (postCountdownText || preCountdownText) ? (
                <Countdown
                  nextEventTime={nextEventTime}
                  postCountdownText={postCountdownText}
                  preCountdownText={preCountdownText}
                />
              ) : (
                <Skeleton height="41px" width="250px" />
              )}
            </Flex>
            <NextDrawCard />
          </Flex>
        </PageSection> */}

        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.gradientGreenOrange}
          hasCurvedDivider={false}
          index={2}>
          <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
            <Heading color={theme.colors.black} mb="24px" scale="xl">
              {t('Finished Rounds')}
            </Heading>
            <Box mb="24px">
              <HistoryTabMenu
                activeIndex={historyTabMenuIndex}
                setActiveIndex={index => setHistoryTabMenuIndex(index)}
              />
            </Box>
            {historyTabMenuIndex === 0 ? (
              <AllHistoryCard />
            ) : (
              <YourHistoryCard
                handleShowMoreClick={handleShowMoreUserRounds}
                numUserRoundsRequested={numUserRoundsRequested}
              />
            )}
          </Flex>
        </PageSection>
        <PageSection
          dividerPosition="top"
          dividerFill={{ light: theme.colors.vertoBg1, dark: theme.colors.vertoBg1 }}
          clipFill={{ light: theme.colors.backgroundAlt, dark: theme.colors.backgroundAlt }}
          index={2}>
          <HowToPlay />
        </PageSection>
      </LotteryPage>
    </>
  )
}

export default Lottery
