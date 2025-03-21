import { ChainId } from '@verto/sdk'
import FarmsRebusPriceHelper from './1011'
import FarmsRebusTestnetPriceHelper from './3033'
import FarmsRebusTestnetL2PriceHelper from './3034'
import FarmsRebusL2PriceHelper from './9696'


export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.REBUS:
      return FarmsRebusPriceHelper
    case ChainId.REBUS_TESTNET:
      return FarmsRebusTestnetPriceHelper
    case ChainId.REBUS_TESTNET_L2:
      return FarmsRebusTestnetL2PriceHelper  
    case ChainId.REBUS_L2:
        return FarmsRebusL2PriceHelper        
    default:
      return []
  }
}
