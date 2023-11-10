import { BigNumber } from '@ethersproject/bignumber'
import { Cake, Erc20 } from 'config/abi/types'

export const requiresApproval = async (
  contract: Erc20 | Cake,
  account: string,
  spenderAddress: string,
  minimumRequired?: BigNumber,
) => {
  try {
    const response = await contract.allowance(account, spenderAddress)
    if (minimumRequired?.gt(0)) {
      return response.lt(minimumRequired)
    }
    return response.lte(BigNumber.from(0))
  } catch (error) {
    return true
  }
}
