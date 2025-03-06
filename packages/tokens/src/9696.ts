import { ChainId, ERC20Token, WETH9 } from '@verto/sdk'

export const vertoTokensL2 = {
  rebus: new ERC20Token(
    ChainId.REBUS_L2,
    '0x088D38759c2D67eD0DA54d52AEf8d5Fb748Ef70E',
    18,
    'REBUS',
    'Rebus',
    'https://www.rebuschain.com/',
  ),
  lqwrebus: new ERC20Token(
    ChainId.REBUS_L2,
    '0xfd3423e599CB90C5D1E5cFdA6F0A4c570443af9E',
    18,
    'lqWREBUS',
    'lqWRebus',
    'https://www.rebuschain.com/',
  ),
  verto: new ERC20Token(
    ChainId.REBUS_L2,
    '0x5B1B22949ae55101F35dCfCfc080985fCF3CB904',
    18,
    'VERTO',
    'Verto',
    'https://vertotrade.com/',
  ),
  weth: WETH9[ChainId.REBUS_L2],
  wrebus: new ERC20Token(
    ChainId.REBUS_L2,
    '0x088D38759c2D67eD0DA54d52AEf8d5Fb748Ef70E',
    18,
    'REBUS',
    'Rebus',
    'https://www.rebuschain.com/',
  ),
  lqverto: new ERC20Token(
    ChainId.REBUS_L2,
    '0x52411A12bcb04E7483dC2C100DCaB997e2Cb4ABc',
    18,
    'lqVERTO',
    'lqVerto',
    'https://vertotrade.com/',
  ),
}
