import styled from 'styled-components'
import { Box, Flex, Text, Heading, Link } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import useTheme from 'hooks/useTheme'

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 40px 0;
  width: 100%;
`

const StepContainer = styled(Flex)`
  gap: 24px;
  width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  background: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  border-radius: ${({ theme }) => theme.radii.card};
`

const StepCardInner = styled(Box)<{ background?: string }>`
  width: 100%;
  padding: 24px;
  background: ${props => props.background};
  border-radius: ${({ theme }) => theme.radii.card};
`

const StepNumberWrapper = styled.span`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 33px;
`

const TicketCard = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 454px;
  margin-bottom: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
`

type Step = { title: string; subtitle: string; label: string }

const StepCard: React.FC<React.PropsWithChildren<{ step: Step }>> = ({ step }) => {
  const { theme, isDark } = useTheme()
  const textColor = isDark ? theme.colors.white : theme.colors.text
  const bgColor = isDark ? theme.colors.backgroundAlt2D9 : theme.colors.background

  return (
    <StyledStepCard width="100%">
      <StepCardInner background={bgColor} height={['200px', '180px', null, '200px']}>
        <Text mb="16px" fontSize="12px" bold textAlign="left" textTransform="uppercase">
          <StepNumberWrapper>{step.label}</StepNumberWrapper>
        </Text>
        <Heading mb="16px" scale="lg" color={textColor}>
          {step.title}
        </Heading>
        <Text color={textColor}>{step.subtitle}</Text>
      </StepCardInner>
    </StyledStepCard>
  )
}

const InlineLink = styled(Link)`
  display: inline;
`

const GappedFlex = styled(Flex)`
  gap: 24px;
`
const BigGappedFlex = styled(Flex)`
  gap: 124px;
`

const TextWidth = styled(Text)`
  max-width: 464px;
`
const Subtitle = styled(Text)`
  margin-bottom: 32px;
`

const GraphImgWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
`

const HowToPlay: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()

  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Buy Tickets'),
      subtitle: t('Prices are set when the round starts, equal to 5 USD in VERTO per ticket.'),
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Wait for the Draw'),
      subtitle: t('There is one draw every day alternating between 0 AM UTC and 12 PM UTC.'),
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Check for Prizes'),
      subtitle: t('Once the round’s over, come back to the page and check to see if you’ve won!'),
    },
  ]
  return (
    <Box width="100%">
      <Flex mb="40px" alignItems="center" flexDirection="column">
        <Heading mb="24px" scale="xl" color={isDark ? theme.colors.white : theme.colors.black}>
          {t('How to Play')}
        </Heading>
      </Flex>
      <StepContainer>
        {steps.map(step => (
          <StepCard key={step.label} step={step} />
        ))}
      </StepContainer>
      <Divider />
      <BigGappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="1" flexDirection="column">
          <Heading mb="8px" scale="xl" color="text">
            {t('Winning Criteria')}
          </Heading>
          <Text mb="24px" fontSize="16px">
            {t('The digits on your ticket must match in the correct order to win.')}
          </Text>
          <Text mb="16px" color="text">
            {t('Here’s an example lottery draw, with two tickets, A and B.')}
          </Text>
          <TicketCard>
            <Text fontSize="16px" fontWeight="700">
              {t('Ticket A')}
            </Text>
            <Text fontSize="14px" color="text">
              {t(
                'The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.',
              )}
            </Text>
          </TicketCard>
          <TicketCard>
            <Text fontSize="16px" fontWeight="700">
              {t('Ticket B')}
            </Text>
            <Text fontSize="14px" color="text">
              {t('Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.')}
            </Text>
          </TicketCard>
          <TextWidth mt="16px" color="text">
            {t(
              'Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.',
            )}
          </TextWidth>
        </Flex>
        <Flex flex="1" justifyContent="center">
          <GraphImgWrapper>
            <img
              alt="winning-ticket-example"
              src={`images/lottery/${isDark ? 'winning-ticket-dark.png' : 'winning-ticket.png'}`}
            />
          </GraphImgWrapper>
        </Flex>
      </BigGappedFlex>
      <Divider />
      <GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="1" flexDirection="column">
          <Heading mb="8px" scale="xl" color="text">
            {t('Prize Funds')}
          </Heading>
          <Subtitle color="text">{t('The prizes for each lottery round come from three sources:')}</Subtitle>
          <TicketCard>
            <Heading mb="16px" scale="md">
              {t('Ticket Purchases')}
            </Heading>
            <Text display="inline" color="text">
              {t('100% of the VERTO paid by people buying tickets that round goes back into the prize pools.')}
            </Text>
          </TicketCard>
          <TicketCard>
            <Heading my="16px" scale="md">
              {t('Rollover Prizes')}
            </Heading>
            <Text display="inline" color="text">
              {t(
                'After every round, if nobody wins in one of the prize brackets, the unclaimed VERTO for that bracket rolls over into the next round and are redistributed among the prize pools.',
              )}
            </Text>
          </TicketCard>
          <TicketCard>
            <Heading my="16px" scale="md">
              {t('VERTO Injections')}
            </Heading>
            <Text display="inline" color="text">
              {t(
                'An average total of 35,000 VERTO from the treasury is added to lottery rounds over the course of a week. This VERTO is of course also included in rollovers! Read more in our guide to ',
              )}
              <InlineLink href="https://docs.vertotrade.com/tokenomics">{t('VERTO Tokenomics')}</InlineLink>
            </Text>
          </TicketCard>
        </Flex>
        <Flex flex="1" justifyContent="center">
          <GraphImgWrapper>
            <img alt="winning-ticket-example" src={`images/lottery/${isDark ? 'matches-dark.png' : 'matches.png'}`} />
          </GraphImgWrapper>
        </Flex>
      </GappedFlex>
    </Box>
  )
}

export default HowToPlay
