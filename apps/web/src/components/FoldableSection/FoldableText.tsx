import { useState, ReactNode } from 'react'
import styled from 'styled-components'
import { ExpandableLabel, Flex, FlexProps, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'

interface FoldableTextProps extends Omit<FlexProps, 'title'> {
  title?: ReactNode
}

const StyledFlex = styled(Flex)`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  }
`

const Wrapper = styled(Flex)`
  cursor: pointer;
`

const StyledExpandableLabelWrapper = styled(Flex)`
  button {
    align-items: center;
    justify-content: flex-start;
  }
`

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '16px' : '0px')};
`

const FoldableText: React.FC<React.PropsWithChildren<FoldableTextProps>> = ({ title, children, ...props }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <StyledFlex {...props} flexDirection="column">
      <Wrapper justifyContent="space-between" alignItems="center" pb="16px" onClick={() => setIsExpanded(s => !s)}>
        <Text fontWeight="bold">{title}</Text>
        <StyledExpandableLabelWrapper>
          <ExpandableLabel expanded={isExpanded}>{isExpanded ? t('Hide') : t('Details')}</ExpandableLabel>
        </StyledExpandableLabelWrapper>
      </Wrapper>
      <StyledChildrenFlex isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </StyledFlex>
  )
}

export default FoldableText
