import { Trans } from '@verto/localization'
import { AtomBox } from '@verto/ui/components/AtomBox'
import { Button, Heading, LinkExternal, Text } from '@verto/uikit'
import { useState } from 'react'

const IntroSteps = [
  {
    title: <Trans>Your first step in the DeFi world</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/wallet_intro.png',
    description: (
      <Trans>
        A Web3 Wallet allows you to send and receive crypto assets like bitcoin, REBUS, ETH, NFTs and much more.
      </Trans>
    ),
  },
  {
    title: <Trans>Login using a wallet connection</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/world_lock.png',
    description: (
      <Trans>
        Instead of setting up new accounts and passwords for every website, simply set up your wallet in one go, and
        connect it to your favorite DApps.
      </Trans>
    ),
  },
]

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox padding="4px" onClick={onClick} cursor="pointer">
    <AtomBox
      bgc={active ? 'secondary' : 'inputSecondary'}
      width="56px"
      height="8px"
      borderLeftRadius={place === 'left' ? 'card' : '0'}
      borderRightRadius={place === 'right' ? 'card' : '0'}
    />
  </AtomBox>
)

export const StepIntro = ({ docLink, docText }: { docLink: string; docText: string }) => {
  const [step, setStep] = useState(0)

  const introStep = IntroSteps[step]

  return (
    <AtomBox
      display="flex"
      width="full"
      flexDirection="column"
      style={{ gap: '24px' }}
      mx="auto"
      my="48px"
      px="24px"
      textAlign="center"
      alignItems="center">
      {introStep && (
        <>
          <Heading as="h2" color="secondary">
            {introStep.title}
          </Heading>
          <Text maxWidth="368px" m="auto" small color="textSubtle">
            {introStep.description}
          </Text>
        </>
      )}
      <AtomBox display="flex">
        <StepDot place="left" active={step === 0} onClick={() => setStep(0)} />
        <StepDot place="right" active={step === 1} onClick={() => setStep(1)} />
      </AtomBox>
      <Button minHeight={40} variant="subtle" external as={LinkExternal} color="textSubtle" href={docLink}>
        {docText}
      </Button>
    </AtomBox>
  )
}
