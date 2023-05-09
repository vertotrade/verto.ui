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
  xverto: new ERC20Token(
    ChainId.REBUS,
    '0x8dC1090552D092901D7c750b0f4E237B92013e02',
    18,
    'XVERTO',
    'xVerto',
    'https://vertotrade.com/',
  ),
}
