import styled from 'styled-components'
import { Box, BoxProps, Flex, Skeleton, Text } from '@verto/uikit'

export interface StatBoxItemProps extends BoxProps {
  title: string
  stat: string
}

export const StatBoxItem: React.FC<React.PropsWithChildren<StatBoxItemProps>> = ({ title, stat, ...props }) => (
  <Box {...props}>
    <Text fontSize="14px" color="placeholder">
      {title}
    </Text>
    {stat === null ? (
      <Skeleton height="24px" width="50%" mx="auto" />
    ) : (
      <Text fontSize="16px" bold>
        {stat}
      </Text>
    )}
  </Box>
)

const StatBox = styled(Flex)`
  align-items: start;
  gap: 40px;
  margin-left: auto;
`

export default StatBox
