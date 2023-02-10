import { PageSection } from '@verto/uikit'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from '@verto/localization'
// import { useActiveChainId } from 'hooks/useActiveChainId'
import { swapSectionData, earnSectionData, vertoSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
// import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import VertoDataRow from './components/VertoDataRow'

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  // const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

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
        background={theme.colors.background}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...swapSectionData(t)} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(71.68deg,#f9f9f9,#e7cab7)"
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...earnSectionData(t)} />
        {/* {chainId === ChainId.BSC && <FarmsPoolsRow />} */}
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}>
        <SalesSection {...vertoSectionData(t)} />
        <VertoDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(51.68deg, rgb(131, 191, 136), rgb(225, 225, 225))"
        index={2}
        hasCurvedDivider={false}>
        <Footer />
      </PageSection>
    </>
  )
}

export default Home
