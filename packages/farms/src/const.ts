import { FixedNumber } from '@ethersproject/bignumber'
import env from '@beam-australia/react-env'
import { ChainId } from '@verto/sdk'

export const DEFAULT_CHAIN_ID = env('IS_MAINNET') === 'true' ? ChainId.REBUS : env('IS_MAINNET_L2') === 'true' ? ChainId.REBUS_L2 : env('IS_TESTNET_L2') === 'true' ? ChainId.REBUS_TESTNET_L2 : ChainId.REBUS_TESTNET

export const FIXED_ZERO = FixedNumber.from(0)
export const FIXED_ONE = FixedNumber.from(1)
export const FIXED_TWO = FixedNumber.from(2)

export const masterChefAddresses = {
  97: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
  1011: '0x2B9B68ada280356d16180d799E888E4734AB3b73',
  3033: '0xdfB5926eDFff1B13F11F65948adC3c2967CEd08d',
  9696: '0x4E828b9DBAebc4091E4c4Ed8e3Ef0Ee7A1c2F0F3',
}

export const nonBSCVaultAddresses = {
  1: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  5: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
  1011: '',
  3033: '',
}
