import { ChainId, ERC20Token } from '@verto/sdk'

export const vertoTokensTestnet = {
  wrebus: new ERC20Token(
    ChainId.REBUS_TESTNET,
    '0xe21ee29B2E8A4cE8229b40Fc972A54501daD655B',
    18,
    'WREBUS',
    'WRebus',
    'https://www.rebuschain.com/',
  ),
  ludus: new ERC20Token(
    ChainId.REBUS_TESTNET,
    '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
    6,
    'LUDUS',
    'Ludus',
    'https://www.rebuschain.com/',
  ),
  aureus: new ERC20Token(
    ChainId.REBUS_TESTNET,
    '0xE4b2549E64F2A040c66813b2bCA301A97d135a43',
    18,
    'AUREUS',
    'Aureus',
    'https://farmingtales.io/',
  ),
  verto: new ERC20Token(
    ChainId.REBUS_TESTNET,
    '0x376Ffa8AA69593A4E4932b5A22C46a24F37383c5',
    18,
    'VERTO',
    'Verto',
    'https://vertotrade.com/',
  ),
  xverto: new ERC20Token(
    ChainId.REBUS_TESTNET,
    '0x2AB41eE01Cc023263CA2dC1257aF608a2046844B',
    18,
    'XVERTO',
    'xVerto',
    'https://vertotrade.com/',
  ),
}
