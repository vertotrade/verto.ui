import { Pool, Text } from '@verto/uikit'
import { Token } from '@verto/sdk'

interface LiquidityCellProps {
  pool: Pool.DeserializedPool<Token>
}

const LiquidityCell: React.FC<React.PropsWithChildren<LiquidityCellProps>> = ({ pool }) => {
  const { liquidity } = pool
  const displayLiquidity = `$${Number(liquidity || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  return (
    <Pool.BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <Pool.CellContent>
        <Text textAlign="left">{displayLiquidity}</Text>
      </Pool.CellContent>
    </Pool.BaseCell>
  )
}

export default LiquidityCell
