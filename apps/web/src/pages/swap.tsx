import { SUPPORT_REBUS } from 'config/constants/supportChains'
import Swap from '../views/Swap'
import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext'

const SwapPage = () => {
  return (
    <SwapFeaturesProvider>
      <Swap />
    </SwapFeaturesProvider>
  )
}

SwapPage.chains = SUPPORT_REBUS

export default SwapPage
