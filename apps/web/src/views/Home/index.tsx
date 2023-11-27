import { PageSection, Flex, Heading, BlastOffIcon, Text, LinkExternal } from '@verto/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from '@verto/localization'
import IconDivider from 'components/IconDivider'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { swapSectionData, earnSectionData, vertoSectionData } from './components/SalesSection/data'
import SalesSection, { ButtonsWrapper } from './components/SalesSection'
import VertoDataRow from './components/VertoDataRow'

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
    gap: 0px;
  }
`

const VertoRowWrapper = styled(Flex)`
  max-width: 600px;
  padding-bottom: 96px;
  width: 100%;
  max-width: 1200px;

  @media screen and (max-width: 1000px) {
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
`

const StyledText = styled(Text)`
  text-align: left;
`

const FooterWrapper = styled(Flex)`
  padding: 0 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 900px) {
    align-items: center;
    justify-content: center;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme, isDark } = useTheme()
  const { address: account } = useAccount()
  // const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '1200px' }
  const VertoSectionContainerStyles = {
    marginLeft: '0px',
    marginRight: '0px',
    width: '100%',
    maxWidth: 'unset',
    padding: '48px 0px',
  }

  const { t } = useTranslation()
  return (
    <>
      <PageMeta />
      <style jsx global>{`
        #home-1 .page-bg {
          background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
        }
        [data-theme='dark'] #home-1 .page-bg {
          background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
        }
        #home-2 .page-bg {
          background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
        }
        [data-theme='dark'] #home-2 .page-bg {
          background: linear-gradient(180deg, #09070c 22%, #201335 100%);
        }
        #home-3 .page-bg {
          background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
        }
        [data-theme='dark'] #home-3 .page-bg {
          background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
        }
        #home-4 .inner-wedge svg {
          fill: #d8cbed;
        }
        [data-theme='dark'] #home-4 .inner-wedge svg {
          fill: #201335;
        }
      `}</style>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.vertoBg1}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...swapSectionData(t, isDark)} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.vertoBg1}
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...earnSectionData(t, isDark)} colorOverride />
      </PageSection>
      <PageSection
        innerProps={{ style: VertoSectionContainerStyles }}
        background={theme.colors.vertoBg1}
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...vertoSectionData(t, isDark, theme)} addContainerStyles />
      </PageSection>
      <PageSection
        innerProps={{ style: { padding: '0px', ...HomeSectionContainerStyles } }}
        background={theme.colors.vertoBg1}
        hasCurvedDivider={false}
        index={2}
        noPadding>
        <VertoRowWrapper>
          <VertoDataRow />
        </VertoRowWrapper>
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
              Icon={BlastOffIcon}
            />
          </FlexItem>
          <FlexItem>
            <FooterWrapper flexDirection="column">
              <Heading mb="16px" scale="xxl" color="black">
                {t('Start in seconds.')}
              </Heading>
              <StyledText color="black">
                {t('Connect your crypto wallet to start using the app in seconds. No registration needed.')}
              </StyledText>
<<<<<<< HEAD
              <Flex
                justifyContent="flex-start"
                align-items="center"
                flexDirection={['column', null, 'row']}
                mr={['auto', null, 'unset']}>
=======
              <ButtonsWrapper justifyContent="center" align-items="center">
>>>>>>> c8f488b90 (DEV-743 Fix "start in seconds" section)
                {!account && (
                  <ConnectWalletButton
                    mt="24px"
                    mr="16px"
                    style={{ background: theme.colors.background, color: theme.colors.text }}
                  />
                )}
                <LinkExternal
                  style={{ marginTop: '24px', height: '48px' }}
                  color="black"
                  padding="0 20px"
                  textDecoration="none"
                  hoverBackgroundColor={theme.isDark ? 'white' : theme.colors.secondaryButtonHoverBg}
                  isIcon={false}
                  external
                  href="https://docs.vertotrade.com/">
                  {t('Learn how to start')}
                </LinkExternal>
              </ButtonsWrapper>
            </FooterWrapper>
          </FlexItem>
        </ContentWrapper>
      </PageSection>
    </>
  )
}

export default Home
