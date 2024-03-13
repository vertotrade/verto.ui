import { ChainId } from '@verto/sdk'
import FarmsRebusPriceHelper from './1111'
import FarmsRebusTestnetPriceHelper from './3033'

export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.REBUS:
      return FarmsRebusPriceHelper
    case ChainId.REBUS_TESTNET:
      return FarmsRebusTestnetPriceHelper
    default:
      return []
  }
}
