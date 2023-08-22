import BigNumber from 'bignumber.js'
import { Cake, Erc20 } from 'config/abi/types'

export const requiresApproval = async (
  contract: Erc20 | Cake,
  account: string,
  spenderAddress: string,
  minimumRequired?: BigNumber,
) => {
  try {
    const response = new BigNumber((await contract.allowance(account, spenderAddress)).toString())
    if (minimumRequired?.gt(0)) {
      return response.lt(minimumRequired)
    }
    return response.lte(new BigNumber(0))
  } catch (error) {
    return true
  }
}
