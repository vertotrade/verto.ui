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

const IconDivider = ({ background, textColor, divBackground, Icon = CoinStack }) => {
  return (
    <IconDiv background={divBackground}>
      <IconCircleWrapper background={background}>
        <IconImgWrapper>
          <Icon color={textColor} />
        </IconImgWrapper>
      </IconCircleWrapper>
    </IconDiv>
  )
}

export default IconDivider
