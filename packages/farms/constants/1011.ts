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
    rewardToken: vertoTokens.axlusdc,
  },
  {
    pid: 1,
    v1pid: 1,
    lpSymbol: 'VERTO-WREBUS LP',
    lpAddress: '0xeDF4d57Ceb9983E5C08bD437A72B35b6217C4624',
    poolAddress: '0x363A81226D45716C1783304aEB2A980D352B5091',
    token: vertoTokens.wrebus,
    quoteToken: vertoTokens.verto,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 2,
    v1pid: 2,
    lpSymbol: 'WREBUS-axlUSDC LP',
    lpAddress: '0x4b56FB959d36d0228644b5ff273984450eCDCeb8',
    poolAddress: '0xfa2421B660d9BFa8025650e0BcE30140E30619c2',
    token: vertoTokens.axlusdc,
    quoteToken: vertoTokens.wrebus,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 3,
    v1pid: 3,
    lpSymbol: 'VERTO-axlUSDC LP',
    lpAddress: '0xa0A8163324AC9e277E133e0De998937227fA9107',
    poolAddress: '0xce0a20e63d5ed288cfa94e435297388c322786ae',
    token: vertoTokens.axlusdc,
    quoteToken: vertoTokens.verto,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 4,
    v1pid: 4,
    lpSymbol: 'axlWETH-axlUSDC LP',
    lpAddress: '0xA1b50B70422A14084678344254828BF74dC5e152',
    poolAddress: '0x8e5af0dc38689f53d438a1f728adaf2c62727ed0',
    token: vertoTokens.axlusdc,
    quoteToken: vertoTokens.axlweth,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 5,
    v1pid: 5,
    lpSymbol: 'axlBTC-axlUSDC LP',
    lpAddress: '0x3A481384caf20030efb9FF92275602344Df7b235',
    poolAddress: '0xa66ac9df629be0a73619e173573ea4b7614219be',
    token: vertoTokens.axlusdc,
    quoteToken: vertoTokens.axlwbtc,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 6,
    v1pid: 6,
    lpSymbol: 'axlWBTC-axlWETH LP',
    lpAddress: '0x1cADBc578e491c5Db36501B0dE79485c53deF934',
    poolAddress: '0x08f80928b3f7e41d310264418d30ad7da3726ba9',
    token: vertoTokens.axlweth,
    quoteToken: vertoTokens.axlwbtc,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 8,
    v1pid: 8,
    lpSymbol: 'lqWREBUS-WREBUS LP',
    lpAddress: '0x325A14a2e042f702c1a72Ede2caAfE7E2d60b045',
    poolAddress: '0xb556befc9ba8871b69381d77bb0c56e62ec1194c',
    token: vertoTokens.lqwrebus,
    quoteToken: vertoTokens.wrebus,
    rewardToken: vertoTokens.verto,
  },
  {
    pid: 9,
    v1pid: 9,
    lpSymbol: 'lqVERTO-VERTO LP',
    lpAddress: '0x8cD18d5c91035AB5490d4859Ce278d46011f8797',
    poolAddress: '0x3502b3c7f73220d6748830badc5d97ad78c0f97b',
    token: vertoTokens.lqverto,
    quoteToken: vertoTokens.verto,
    rewardToken: vertoTokens.verto,
  },
].map(p => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  rewardToken: p.rewardToken.serialize,
}))

export default farms
