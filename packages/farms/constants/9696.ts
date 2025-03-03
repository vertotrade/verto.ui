import { SerializedFarmConfig } from '@verto/farms'
import { vertoTokensL2 } from '@verto/tokens'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'REBUS-VERTO LP',
    lpAddress: '0x5fc89D21A7C8d5E14419126C5Ce92baF331A0fFc',
    poolAddress: '0xaF4C44D02162EbbBc4E9dFecA28FFFD539f92813',
    token: vertoTokensL2.verto,
    quoteToken: vertoTokensL2.rebus,
    rewardToken: vertoTokensL2.verto,
  },
  {
    pid: 1,
    v1pid: 1,
    lpSymbol: 'REBUS-ETH LP',
    lpAddress: '0xfDb88f143f9D73606E59fcEd7EA5d9A8a4a7bccA',
    poolAddress: '0xE389a83a1AD2eC581F9267E07fde789348313Be8',
    token: vertoTokensL2.weth,
    quoteToken: vertoTokensL2.rebus,
    rewardToken: vertoTokensL2.verto,
  },
  {
    pid: 2,
    v1pid: 2,
    lpSymbol: 'VERTO-ETH LP',
    lpAddress: '0x90d2a9105D5067f2d18F9a021e0Ab914ae0d7D4C',
    poolAddress: '0x5990252a5bC0Bb327EAd912bbD013D9D4F5c6C2a',
    token: vertoTokensL2.weth,
    quoteToken: vertoTokensL2.verto,
    rewardToken: vertoTokensL2.verto,
  },
].map(p => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  rewardToken: p.rewardToken.serialize,
}))

export default farms
