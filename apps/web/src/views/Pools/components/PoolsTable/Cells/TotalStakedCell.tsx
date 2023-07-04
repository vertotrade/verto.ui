import { Flex, Skeleton, Balance, Pool } from '@verto/uikit'
import styled from 'styled-components'
import { Token } from '@verto/sdk'
import BigNumber from 'bignumber.js'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  stakingToken,
  totalStaked,
  totalStakedBalance,
}) => {
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
