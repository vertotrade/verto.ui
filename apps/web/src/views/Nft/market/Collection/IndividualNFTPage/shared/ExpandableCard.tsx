import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Flex, Text, Card, Box, ChevronUpIcon, ChevronDownIcon, IconButton } from '@verto/uikit'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 720px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 710px;
  }
  to {
    max-height: 0px;
  }
`

const ExpandableCardBody = styled(Box)<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
`

const FullWidthCard = styled(Card)`
  width: 100%;
  background: ${({ theme }) => `${theme.colors.vertoBg1}`};
  border: 1px solid ${({ theme }) => `${theme.colors.hr}`};
`

interface ExpandableCardProps {
  title: string
  content: React.ReactNode
}

const ExpandableCard: React.FC<React.PropsWithChildren<ExpandableCardProps>> = ({ title, content }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <FullWidthCard background="transparent">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="600" fontFamily="Poppins,sans-serif">
          {title}
        </Text>
        <IconButton
          onClick={() => {
            setExpanded(prev => !prev)
          }}
          variant="text"
          maxWidth="32px">
          {expanded ? (
            <ChevronUpIcon width="24px" height="24px" color="textSubtle" />
          ) : (
            <ChevronDownIcon width="24px" height="24px" color="textSubtle" />
          )}
        </IconButton>
      </Flex>
      <ExpandableCardBody expanded={expanded}>{content}</ExpandableCardBody>
    </FullWidthCard>
  )
}

export default ExpandableCard
