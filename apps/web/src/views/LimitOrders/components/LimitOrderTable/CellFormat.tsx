import { Box } from '@verto/uikit'
import { ReactElement } from 'react-markdown'

interface CellFormatProps {
  firstRow: ReactElement | number | string
  secondRow: ReactElement
}

const CellFormat: React.FC<React.PropsWithChildren<CellFormatProps>> = ({ firstRow, secondRow }) => {
  return (
    <Box>
      <Box mb="4px">{firstRow}</Box>
      <Box>{secondRow}</Box>
    </Box>
  )
}

export default CellFormat
