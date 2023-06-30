import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getNonBscVaultContractFee, MessageTypes } from 'views/Farms/hooks/getNonBscVaultFee'

export const stakeFarm = async (masterChefContract: Contract, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.deposit(value, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const unstakeFarm = async (masterChefContract, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.withdraw(value, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const harvestFarm = async (masterChefContract, gasPrice, gasLimit?: number) => {
  return masterChefContract.deposit('0', {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const nonBscStakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Deposit,
  })
  console.info(totalFee, 'stake totalFee')
  return contract.deposit(pid, value, { value: totalFee })
}

export const nonBscUnstakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Withdraw,
  })
  console.info(totalFee, 'unstake totalFee')
  return contract.withdraw(pid, value, { value: totalFee })
}
