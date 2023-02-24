import { ChainId, ERC20Token } from '@verto/sdk'

export const vertoTokens = {
  wrebus: new ERC20Token(
    ChainId.REBUS,
    '0xe21ee29B2E8A4cE8229b40Fc972A54501daD655B',
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
}
