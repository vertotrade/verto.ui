import { ChainId, ERC20Token } from '@verto/sdk'

export const vertoTokens = {
  wrebus: new ERC20Token(
    ChainId.REBUS,
    '0xD9d1b3814d3c5741C9939Ce232ac8075031D959C',
    18,
    'WREBUS',
    'WRebus',
    'https://www.rebuschain.com/',
  ),
  lqwrebus: new ERC20Token(
    ChainId.REBUS,
    '0x00ead699Afc6da26B1e51c57E56f113aA4e229CD',
    18,
    'lqWREBUS',
    'lqWRebus',
    'https://www.rebuschain.com/',
  ),
  ludus: new ERC20Token(
    ChainId.REBUS,
    '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
    6,
    'LUDUS',
    'Ludus',
    'https://www.rebuschain.com/',
  ),
  aureus: new ERC20Token(
    ChainId.REBUS,
    '0x03E72C6f3A01C6282FF6de1DD652db926A113cDf',
    18,
    'AUREUS',
    'Aureus',
    'https://farmingtales.io/',
  ),
  verto: new ERC20Token(
    ChainId.REBUS,
    '0x088D38759c2D67eD0DA54d52AEf8d5Fb748Ef70E',
    18,
    'VERTO',
    'Verto',
    'https://vertotrade.com/',
  ),
  lqverto: new ERC20Token(
    ChainId.REBUS,
    '0xa3d6E8aE944B53C3305f88F8b843Dfa5fdd20a9b',
    18,
    'lqVERTO',
    'lqVerto',
    'https://vertotrade.com/',
  ),
  xverto: new ERC20Token(
    ChainId.REBUS,
    '0x8dC1090552D092901D7c750b0f4E237B92013e02',
    18,
    'XVERTO',
    'xVerto',
    'https://vertotrade.com/',
  ),
  axlusdc: new ERC20Token(
    ChainId.REBUS,
    '0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75',
    6,
    'axlUSDC',
    'Axelar Wrapped USDC',
    'https://axelar.network/',
  ),
  axlwbtc: new ERC20Token(
    ChainId.REBUS,
    '0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687',
    8,
    'axlWBTC',
    'Axelar Wrapped WBTC',
    'https://axelar.network/',
  ),
  axlweth: new ERC20Token(
    ChainId.REBUS,
    '0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265',
    18,
    'axlWETH',
    'Axelar Wrapped WETH',
    'https://axelar.network/',
  ),
  techne: new ERC20Token(
    ChainId.REBUS,
    '0x16B4975206628BCd6Fa0F1Abc87c4594439C58Cb',
    18,
    'TECHNE',
    'Techne',
    'https://digitaltechne.eu/',
  ),
}