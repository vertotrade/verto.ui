import BigNumber from 'bignumber.js'
import { multicallv2, multicallv3 } from 'utils/multicall'
import cakeAbi from 'config/abi/cake.json'
import rebusVaultAbi from 'config/abi/rebusVaultV2.json'
import { getRebusVaultAddress, getRebusFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { ChainId } from '@verto/sdk'
import { CAKE } from '@verto/tokens'

const rebusVaultV2 = getRebusVaultAddress()
const rebusFlexibleSideVaultV2 = getRebusFlexibleSideVaultAddress()
export const fetchPublicVaultData = async (rebusVaultAddress = rebusVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map(method => ({
      abi: rebusVaultAbi,
      address: rebusVaultAddress,
      name: method,
    }))

    const cakeBalanceOfCall = {
      abi: cakeAbi,
      address: CAKE[ChainId.BSC].address,
      name: 'balanceOf',
      params: [rebusVaultV2],
    }

    const [[sharePrice], [shares], totalLockedAmount, [totalCakeInVault]] = await multicallv3({
      calls: [...calls, cakeBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: new BigNumber(totalCakeInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async (rebusVaultAddress = rebusFlexibleSideVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares'].map(method => ({
      abi: rebusVaultAbi,
      address: rebusVaultAddress,
      name: method,
    }))

    const cakeBalanceOfCall = {
      abi: cakeAbi,
      address: CAKE[ChainId.BSC].address,
      name: 'balanceOf',
      params: [rebusVaultAddress],
    }

    const [[sharePrice], [shares], [totalCakeInVault]] = await multicallv3({
      calls: [...calls, cakeBalanceOfCall],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: new BigNumber(totalCakeInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
    }
  }
}

export const fetchVaultFees = async (rebusVaultAddress = rebusVaultV2) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map(method => ({
      address: rebusVaultAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2({ abi: rebusVaultAbi, calls })

    return {
      performanceFee: performanceFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
