import styled from 'styled-components'
import { useTranslation } from '@verto/localization'
import { Heading, Text, Flex, HeadingProps } from '@verto/uikit'
import SearchBar from '../SearchBar'
import useTheme from 'hooks/useTheme'
import { HeroSVG } from './HeroSVG'

const HeroWrapper = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 120px;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
`

const ImageWrapper = styled.div`
  position: relative;
`

const StyledSearchBar = styled(SearchBar)`
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  border-radius: 8px;
`

interface HeroTitleProps extends HeadingProps {
  textGradient?: boolean;
}

const HeroTitle = styled(Heading)<HeroTitleProps>`
  ${({ textGradient }) => textGradient ? 
    `background: linear-gradient(90deg, #231F20 60.42%, #565656 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;` 
  : ""}
`

export const HeroSection = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <HeroWrapper>
      <div>
        <HeroTitle scale="xxl" mb="16px" as="h1" textGradient={!isDark} >
          {t('NFT')}<br/>
          {t('Marketplace')}
        </HeroTitle>
        <Text fontSize="16px" mb="40px" >{t('Buy and Sell NFTs on Rebuschain')}</Text>
        <StyledSearchBar />
      </div>

      <ImageWrapper>
        <HeroSVG />
      </ImageWrapper>

    </HeroWrapper>
  )
}
