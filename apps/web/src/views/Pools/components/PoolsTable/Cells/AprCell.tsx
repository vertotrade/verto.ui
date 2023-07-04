import { BIG_ZERO } from '@verto/utils/bigNumber'
import { useMatchBreakpoints, Pool } from '@verto/uikit'
import BigNumber from 'bignumber.js'
import { Token } from '@verto/sdk'

import Apr from '../../Apr'

interface AprCellProps {
  pool: Pool.DeserializedPool<Token>
}

const AprCell: React.FC<React.PropsWithChildren<AprCellProps>> = ({ pool }) => {
  const { isMobile } = useMatchBreakpoints()
  const { userData } = pool
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  return (
    <Pool.BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <Pool.CellContent>
        <Apr pool={pool} stakedBalance={stakedBalance} showIcon={!isMobile} />
      </Pool.CellContent>
    </Pool.BaseCell>
  )
}

export default AprCell
