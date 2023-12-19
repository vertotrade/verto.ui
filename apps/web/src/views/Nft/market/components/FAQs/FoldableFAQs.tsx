import { useState, ReactNode } from 'react'
import styled from 'styled-components'
import { Button, Flex, FlexProps, Text, MinusIcon, AddIcon } from '@verto/uikit'
import useTheme from 'hooks/useTheme'

interface FoldableTextProps extends Omit<FlexProps, 'title'> { title?: ReactNode }

const StyledFlex = styled(Flex)<{ borderColor?: string }>`
  flex-direction: column;
  border: 2px solid ${({borderColor}) => borderColor};
  border-radius: 16px;
  padding: 24px 24px 0 24px;
  margin-bottom: 16px;
`

const Wrapper = styled(Flex)`
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
`

const StyledExpandableLabelWrapper = styled(Flex)`
  button {
    align-items: center;
    justify-content: flex-start;
  }
`

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  flex-direction: column;
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '24px' : '0px')};

  &>p {
    font-size: 14px;
  }
`

const FoldableFAQs: React.FC<React.PropsWithChildren<FoldableTextProps>> = ({
  title,
  children,
  ...props
}) => {
  const { theme, isDark } = useTheme()

  const [isExpanded, setIsExpanded] = useState(false)

  const borderColorCollapsed = isDark ? '#2F2F2F' : '#EBEBEB'
  const borderColorExpanded = isDark ? theme.colors.primary : '#BABABA'
  const borderColor = isExpanded ? borderColorExpanded : borderColorCollapsed;

  const expandIcon = isExpanded ? <MinusIcon color="text" /> : <AddIcon color="text" />

  return (
    <StyledFlex {...props} borderColor={borderColor}>
      <Wrapper onClick={() => setIsExpanded(s => !s)}>
        <Text fontWeight="bold" fontSize="18px" fontFamily='Poppins'>{title}</Text>
        <StyledExpandableLabelWrapper>
          <Button
            variant="vertoText"
            scale="newSm"
            width="100%"
            padding='0'
            aria-label="Hide or show expandable FAQ"
            endIcon={expandIcon}
          >
          </Button>
        </StyledExpandableLabelWrapper>
      </Wrapper>
      <StyledChildrenFlex isExpanded={isExpanded}>
        {children}
      </StyledChildrenFlex>
    </StyledFlex>
  )
}

export default FoldableFAQs
