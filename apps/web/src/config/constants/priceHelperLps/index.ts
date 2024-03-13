import { getFarmsPriceHelperLpFiles } from '@verto/farms/constants/priceHelperLps/getFarmsPriceHelperLpFiles'
import { ChainId } from '@verto/sdk'
import PoolsEthereumPriceHelper from './pools/1'
import PoolsGoerliPriceHelper from './pools/5'
import PoolsBscPriceHelper from './pools/56'
import PoolsBscTestnetPriceHelper from './pools/97'
import PoolsRebusPriceHelper from './pools/1111'
import PoolsRebusTestnetPriceHelper from './pools/3033'

export { getFarmsPriceHelperLpFiles }

export const getPoolsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return PoolsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return PoolsBscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return PoolsEthereumPriceHelper
    case ChainId.GOERLI:
      return PoolsGoerliPriceHelper
    case ChainId.REBUS:
      return PoolsRebusPriceHelper
    case ChainId.REBUS_TESTNET:
      return PoolsRebusTestnetPriceHelper
    default:
      return []
  }
}
