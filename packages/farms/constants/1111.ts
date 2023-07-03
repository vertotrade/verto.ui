import { SerializedFarmConfig } from '@verto/farms'
import { vertoTokens } from '@verto/tokens'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'VERTO-ALXUSDC LP',
    lpAddress: '0xa0A8163324AC9e277E133e0De998937227fA9107',
    poolAddress: '0x2B9B68ada280356d16180d799E888E4734AB3b73',
    token: vertoTokens.axlusdc,
    quoteToken: vertoTokens.verto,
  },
].map(p => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  // rewardToken: p.rewardToken.serialize,
}))

export default farms
