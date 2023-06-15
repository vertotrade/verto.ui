import styled from 'styled-components'
import { Flex, CoinStack } from '@verto/uikit'

const IconDiv = styled(Flex)`
  min-width: 595px;
  border-radius: 0px 120px 120px 0px;
  background: ${props => props.background};
  justify-content: flex-end;
  flex-grow: 1;
  padding: 32px;

  @media screen and (max-width: 900px) {
    display: none;
  }
`
const IconDivReverse = styled(Flex)`
  min-width: 595px;
  border-radius: 120px 0px 0px 120px;
  background: ${props => props.background};
  justify-content: flex-start;
  flex-grow: 1;
  padding: 32px;
`

const IconCircleWrapper = styled(Flex)`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background: ${props => props.background};
`

const IconImgWrapper = styled(Flex)`
  max-width: 90px;
`

const IconDivider = ({ background, textColor, divBackground, Icon = CoinStack, reverse = false, Clip = null }) => {
  const InnerContent = (
    <IconCircleWrapper background={background}>
      {Clip ? (
        <Clip />
      ) : (
        <IconImgWrapper>
          <Icon color={textColor} />
        </IconImgWrapper>
      )}
    </IconCircleWrapper>
  )
  return (
    <>
      {reverse ? (
        <IconDivReverse background={divBackground}>{InnerContent}</IconDivReverse>
      ) : (
        <IconDiv background={divBackground}>{InnerContent}</IconDiv>
      )}
    </>
  )
}

export default IconDivider
