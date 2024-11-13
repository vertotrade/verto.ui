import { ChainId, ERC20Token, WETH9 } from '@verto/sdk'

export const vertoTokensTestnetL2 = {
  rebus: new ERC20Token(
    ChainId.REBUS_TESTNET_L2,
    '0xF7791AAeeAfBdB873bC91Cb8a761989567bbd654',
    18,
    'REBUS',
    'Rebus',
    'https://www.rebuschain.com/',
  ),
  lqwrebus: new ERC20Token(
    ChainId.REBUS_TESTNET_L2,
    '0xB5A68680f188917003D0e8ff9Bd46B2c5b0a6721',
    18,
    'lqWREBUS',
    'lqWRebus',
    'https://www.rebuschain.com/',
  ),
  verto: new ERC20Token(
    ChainId.REBUS_TESTNET_L2,
    '0x7C318c162e140972357a92964D55FadA23E2779a',
    18,
    'VERTO',
    'Verto',
    'https://vertotrade.com/',
  ),
  weth: WETH9[ChainId.REBUS_TESTNET_L2],
  wrebus: new ERC20Token(
    ChainId.REBUS_TESTNET_L2,
    '0xF7791AAeeAfBdB873bC91Cb8a761989567bbd654',
    18,
    'REBUS',
    'Rebus',
    'https://www.rebuschain.com/',
  ),
}
