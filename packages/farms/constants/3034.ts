import { SerializedFarmConfig } from '@verto/farms'
import { vertoTokensTestnetL2 } from '@verto/tokens'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'REBUS-VERTO LP',
    lpAddress: '0xfCC3f12d1A7Bc944164393861B395BDB0F1a819b',
    poolAddress: '0x9a3889D4cf116704eba1253a78E56b8c4D1131F8',
    token: vertoTokensTestnetL2.rebus,
    quoteToken: vertoTokensTestnetL2.lqwrebus,
    rewardToken: vertoTokensTestnetL2.verto,
  },
].map(p => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  rewardToken: p.rewardToken.serialize,
}))

export default farms
