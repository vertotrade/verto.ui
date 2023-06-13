import { BigNumber } from '@ethersproject/bignumber'
import { Cake, Erc20 } from 'config/abi/types'

export const requiresApproval = async (
  contract: Erc20 | Cake,
  account: string,
  spenderAddress: string,
  minimumRequired: number | BigNumber = 100, // 100 is the default value for the minimum required
) => {
  try {
    const response = await contract.allowance(account, spenderAddress)
    const hasMinimumRequired =
      (typeof minimumRequired === 'number' && minimumRequired > 0) ||
      (BigNumber.isBigNumber(minimumRequired) && minimumRequired.gt(0))
    if (hasMinimumRequired) {
      return response.lt(minimumRequired)
    }
    return response.lte(0)
  } catch (error) {
    return true
  }
}
