import styled from 'styled-components'
import { Box, BoxProps, Heading, Text, Button, Flex, MountainsImage } from '@verto/uikit'

const StyledFlex = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradientGreenOrange};
  gap: 112px;
`

const StyledRectangle = styled(Box)`
  background: ${({ theme }) => theme.colors.vertoBg1};
  width: 600px;
  height: 180px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  padding: 15px;
`

const StyledBox = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientGreenOrange};
  margin-left: auto;
  width: 150px;
  height: 150px;
  border-radius: 100px;
  padding: 43px;
`

const StyledButton = styled(Button)`
  background: ${({ theme }) => theme.colors.vertoBg1};
  font-weight: 500;
  font-size: 16p;
`

interface ApplyToMarketplaceProps extends BoxProps {
  config: {
    applyHeader: string
    applyDescription: string
    applyButton: string
  }
}

const ApplyToMarketplace: React.FC<ApplyToMarketplaceProps> = ({ config, ...props }) => {
  return (
    <StyledFlex padding={['24px 0', '24px', '120px 120px 120px 0']} {...props}>
      <StyledRectangle display={['none', 'none', 'block']}>
        <StyledBox>
          <MountainsImage width="64px" height="64px" />
        </StyledBox>
      </StyledRectangle>
      <Box mb="24px" maxWidth="560px">
        <Heading as="h1" scale="xxl" mb="16px" color="buttonText">
          {config.applyHeader}
        </Heading>
        <Text mb="24px" color="buttonText">
          {config.applyDescription}
        </Text>
        <StyledButton
          variant="vertoSecondary"
          onClick={() => {
            window.open(
              'https://docs.vertotrade.com/contact-us/business-partnerships/',
              '_blank',
              'noopener noreferrer',
            )
          }}>
          {config.applyButton}
        </StyledButton>
      </Box>
    </StyledFlex>
  )
}

export default ApplyToMarketplace
