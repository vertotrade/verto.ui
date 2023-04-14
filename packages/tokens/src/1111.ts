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
  // ludus: new ERC20Token(
  //   ChainId.REBUS,
  //   '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
  //   6,
  //   'LUDUS',
  //   'Ludus',
  //   'https://www.rebuschain.com/',
  // ),
  // aureus: new ERC20Token(
  //   ChainId.REBUS,
  //   '0xE4b2549E64F2A040c66813b2bCA301A97d135a43',
  //   18,
  //   'AUREUS',
  //   'Aureus',
  //   'https://www.rebuschain.com/',
  // ),
  verto: new ERC20Token(
    ChainId.REBUS,
    '0x088D38759c2D67eD0DA54d52AEf8d5Fb748Ef70E',
    18,
    'VERTO',
    'Verto',
    'https://www.rebuschain.com/',
  ),
  dummy: new ERC20Token(
    ChainId.REBUS,
    '0xef9F669fAa5DE9A49cC338598Bb2B63C78E925df',
    18,
    'DUMMY',
    'Dummy',
    'https://www.rebuschain.com/',
  ),
}
