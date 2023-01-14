import { Pool } from '@verto/uikit'
import { Coin } from '@verto/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
