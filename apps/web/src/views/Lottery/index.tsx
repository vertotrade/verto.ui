import { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, PageSection, Text, QuestionOutline } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import IconDivider from 'components/IconDivider'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import HowToPlay from './components/HowToPlay'
import useShowMoreUserHistory from './hooks/useShowMoreUserRounds'
import { PageMeta } from '../../components/Layout/Page'
import SliderComponent from './components/Slider'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const StyledFooterWrapper = styled(Flex)`
  align-items: flex-start;

  @media screen and (max-width: 900px) {
    align-items: center;
  }
`

const ButtonLink = styled.a<{ background: string }>`
  display: inline-block;
  padding: 16px;
  background-color: ${props => props.background};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  border-radius: 32px;
  margin-top: 24px;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f3f3;
  }
`

const FlexItem = styled(Flex)`
  width: 50%;

  @media screen and (max-width: 900px) {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`

const ContentWrapper = styled(Flex)`
  width: 100%;
  gap: 100px;

  @media screen and (max-width: 1000px) {
    flex-direction: column-reverse;
  }

  @media screen and (max-width: 900px) {
    justify-content: center;
    align-items: center;
  }
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  // const {
  //   currentRound: { status, endTime },
  // } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  // const endTimeAsInt = parseInt(endTime, 10)
  // const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const { numUserRoundsRequested, handleShowMoreUserRounds } = useShowMoreUserHistory()
  const backgroundSectionColor = isDark ? theme.colors.backgroundAlt2D9 : theme.colors.background

  return (
    <>
      <PageMeta />
      <LotteryPage>
        <PageSection
          background={backgroundSectionColor}
          index={1}
          innerProps={{ style: { marginLeft: '0px', marginRight: '0px', width: '100%' } }}
          hasCurvedDivider={false}>
          <Hero />
        </PageSection>
        <PageSection
          background={backgroundSectionColor}
          innerProps={{
            style: { marginLeft: '0px', marginRight: '0px', width: '100%', maxWidth: 'unset', padding: '48px 0px' },
          }}
          hasCurvedDivider={false}
          index={2}>
          <CheckPrizesSection />
        </PageSection>
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
              <Flex
                width="100%"
                height="auto"
                margin="0 auto"
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <SliderComponent />
              </Flex>
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
          hasCurvedDivider={false}
          background={backgroundSectionColor}
          dividerFill={{ light: theme.colors.vertoBg1, dark: theme.colors.vertoBg1 }}
          clipFill={{ light: theme.colors.backgroundAlt, dark: theme.colors.backgroundAlt }}
          index={2}>
          <HowToPlay />
        </PageSection>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%', maxWidth: 'unset', padding: '48px 0px' } }}
          background={theme.colors.gradientGreenOrange}
          hasCurvedDivider={false}
          index={2}>
          <ContentWrapper alignItems="center" justifyContent="space-between">
            <FlexItem>
              <IconDivider
                background={theme.colors.gradientGreenOrange}
                textColor={theme.colors.black}
                divBackground={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.white}
                Icon={QuestionOutline}
              />
            </FlexItem>
            <FlexItem>
              <StyledFooterWrapper flexDirection="column">
                <Heading mb="16px" scale="xxl" color="black">
                  {t('Still got questions?')}
                </Heading>
                <Text color="black">{t('Check our in-depth guide on how to play the VERTO lottery')}</Text>
                <Flex>
                  <ButtonLink
                    background={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.white}
                    target="_blank"
                    href="https://docs.vertotrade.com/tokenomics/">
                    {t('Learn how to Play')}
                  </ButtonLink>
                </Flex>
              </StyledFooterWrapper>
            </FlexItem>
          </ContentWrapper>
        </PageSection>
      </LotteryPage>
    </>
  )
}

export default Lottery
