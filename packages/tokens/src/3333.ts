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
    'https://www.rebuschain.com/',
  ),
}
