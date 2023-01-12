import { Token } from '@verto/sdk'
import { Pool } from '@verto/uikit'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
