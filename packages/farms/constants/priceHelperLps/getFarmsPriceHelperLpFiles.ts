import { ChainId } from '@verto/sdk'
import FarmsBscPriceHelper from './56'
import FarmsBscTestnetPriceHelper from './97'
import FarmsEthereumPriceHelper from './1'
import FarmsGoerliPriceHelper from './5'
import FarmsRebusPriceHelper from './1111'
import FarmsRebusTestnetPriceHelper from './3333'

export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return FarmsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return FarmsBscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return FarmsEthereumPriceHelper
    case ChainId.GOERLI:
      return FarmsGoerliPriceHelper
    case ChainId.REBUS:
      return FarmsRebusPriceHelper
    case ChainId.REBUS_TESTNET:
      return FarmsRebusTestnetPriceHelper
    default:
      return []
  }
}
