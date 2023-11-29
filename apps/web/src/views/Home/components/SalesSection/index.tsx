import { Flex, Text, Button, Link, NextLinkFromReactRouter as RouterLink, LinkExternal } from '@verto/uikit'
import styled from 'styled-components'
import { useTheme } from '@verto/hooks'
import { CompositeImageProps } from '../CompositeImage'
import ColoredWordHeading from '../ColoredWordHeading'

interface SalesSectionButtonPrimary {
  to: string
  text: string
  external: boolean
}

interface SalesSectionButtonSecondary {
  to: string
  text: string
  external: boolean
  isIcon: boolean
}

const ContentWrapper = styled(Flex)<{ addStyles?: boolean }>`
  ${props =>
    props.addStyles &&
    `
      width: 100%;
      gap: 100px;

      @media screen and (max-width: 1080px) {
        gap: 0px;
      }}

      @media screen and (max-width: 1000px) {
        flex-direction: column-reverse;
        gap: 0px;
      }}
  `}
`
const ContentInnerWrapper = styled(Flex)<{ addStyles?: boolean }>`
  padding: 30px;

  ${props =>
    props.addStyles &&
    `
      width: 50%;
      justify-content: flex-end;

      div:first-of-type {
        max-width: 503px;
      }

      @media screen and (max-width: 1080px) {
        div:first-of-type {
          max-width: unset;
        }
      }}

      @media screen and (max-width: 900px) {
        div:first-of-type {
          max-width: 503px;
        }
        
        justify-content: center;
        width: 100%;
      }}
  `}
`

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButtonPrimary
  secondaryButton: SalesSectionButtonSecondary
  images: CompositeImageProps
  colorOverride?: boolean
  ClipComponent?: React.ComponentType
  addContainerStyles?: boolean
  headingStyle?: React.CSSProperties
}

const SalesSection: React.FC<React.PropsWithChildren<SalesSectionProps>> = props => {
  const {
    headingText,
    bodyText,
    reverse,
    primaryButton,
    secondaryButton,
    colorOverride,
    ClipComponent,
    addContainerStyles = false,
  } = props
  const { theme } = useTheme()

  return (
    <Flex flexDirection="column">
      <ContentWrapper
        addStyles={addContainerStyles}
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['center', null, null, 'center']}
        justifyContent="center">
        <ContentInnerWrapper addStyles={addContainerStyles}>
          <Flex
            flexDirection="column"
            flex="1"
            ml={[null, null, null, reverse && '64px']}
            mr={[null, null, null, !reverse && '64px']}
            alignSelf={['flex-start', null, null, 'flex-start']}>
            <ColoredWordHeading
              text={headingText}
              style={props.headingStyle}
              firstColor="text"
              color={theme.colors.text}
            />
            <Text color={theme.colors.text} mb="24px">
              {bodyText}
            </Text>
            <Flex>
              <Button mr="16px" variant="secondary">
                {primaryButton.external ? (
                  <Link external href={primaryButton.to}>
                    <Text color={colorOverride ? '' : 'card'} bold fontSize="16px">
                      {primaryButton.text}
                    </Text>
                  </Link>
                ) : (
                  <RouterLink to={primaryButton.to}>
                    <Text color={colorOverride ? '' : 'card'} bold fontSize="16px">
                      {primaryButton.text}
                    </Text>
                  </RouterLink>
                )}
              </Button>
              {secondaryButton.external ? (
                <LinkExternal
                  isIcon={secondaryButton.isIcon}
                  color={theme.colors.text}
                  textDecoration="none"
                  href={secondaryButton.to}
                  padding="0 20px">
                  {secondaryButton.text}
                </LinkExternal>
              ) : (
                <RouterLink color={theme.colors.text} to={secondaryButton.to}>
                  {secondaryButton.text}
                </RouterLink>
              )}
            </Flex>
          </Flex>
        </ContentInnerWrapper>
        <Flex
          height={['null', null, null, '100%']}
          width={['320px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}>
          {ClipComponent && <ClipComponent />}
        </Flex>
      </ContentWrapper>
    </Flex>
  )
}

export default SalesSection
