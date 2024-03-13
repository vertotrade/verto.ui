import { SerializedFarmConfig } from '@verto/farms'
import { vertoTokensTestnet } from '@verto/tokens'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'REBUS-VERTO LP',
    lpAddress: '0x6b59FE4525CcaAa58137013e2C99b93531A7c177',
    poolAddress: '0x1D92AdF80C148640D75bb62D70499f77D012Ca56',
    token: vertoTokensTestnet.wrebus,
    quoteToken: vertoTokensTestnet.verto,
    rewardToken: vertoTokensTestnet.ludus,
  },
].map(p => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  rewardToken: p.rewardToken.serialize,
}))

export default farms
