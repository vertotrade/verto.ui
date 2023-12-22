import { useRouter } from 'next/router'
import { PageSection, Flex, Heading, Text, Button, EmptyImg } from '@verto/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { Trans, useTranslation } from '@verto/localization'
import IconDivider from 'components/IconDivider'
import { swapSectionData, earnSectionData, vertoSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
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
  align-items: start;

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
  max-width: 559px;

  @media screen and (max-width: 900px) {
    text-align: center;
  }
`

const ApplyToNFT = styled(Flex)`
  padding: 0 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 900px) {
    align-items: center;
    justify-content: center;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme, isDark } = useTheme()
  // const { chainId } = useActiveChainId()

  const router = useRouter()

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
        innerProps={{ style: { margin: '0', width: '100%', maxWidth: 'unset', padding: '80px 0px' } }}
        background={theme.colors.gradientGreenOrange}
        hasCurvedDivider={false}
        style={{ padding: '40px 0' }}
        index={2}>
        <ContentWrapper alignItems="center" justifyContent="space-between">
          <FlexItem>
            <IconDivider
              small
              background={theme.colors.gradientGreenOrange}
              textColor={theme.colors.black}
              divBackground={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.white}
              Icon={EmptyImg}
            />
          </FlexItem>
          <FlexItem>
            <ApplyToNFT flexDirection="column">
              <Heading maxWidth="559px" mb="16px" scale="xxl" color="black">
                {t('Apply to NFT Marketplace!')}
              </Heading>
              <StyledText color="black">
                {t(
                  'Het is al geruime tijd een bekend gegeven dat een lezer, tijdens het bekijken van de layout van een pagina, afgeleid wordt door de tekstuele inhoud. Het belangrijke punt van het gebruik van Lorem Ipsum is dat het uit een min of meer normale verdeling van letters bestaat, in tegenstelling tot',
                )}
              </StyledText>
              <Flex
                justifyContent="flex-start"
                align-items="center"
                flexDirection={['column', null, 'row']}
                mr={['auto', null, 'unset']}
                mt="24px">
                <Button
                  variant="light"
                  scale="newSm"
                  style={{ background: theme.colors.background, color: theme.colors.text }}
                  onClick={() => router.push('/collections')}>
                  <Trans>Apply</Trans>
                </Button>
              </Flex>
            </ApplyToNFT>
          </FlexItem>
        </ContentWrapper>
      </PageSection>
    </>
  )
}

export default Home
