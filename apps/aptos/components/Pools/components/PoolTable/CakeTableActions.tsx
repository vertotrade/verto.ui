import { Pool } from '@verto/uikit'
import { Coin } from '@verto/aptos-swap-sdk'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import CakeCollectModal from '../PoolCard/CakeCollectModal'
import CakeStakeModal from '../PoolCard/CakeStakeModal'

const StakeActions = Pool.withStakeActions(CakeStakeModal)

const StakeActionContainer = Pool.withStakeActionContainer(StakeActions, ConnectWalletButton)

export default Pool.withTableActions<Coin>(Pool.withCollectModalTableAction(CakeCollectModal), StakeActionContainer)
