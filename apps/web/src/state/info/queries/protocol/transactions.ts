import { ESTransaction, search } from 'utils/elastic-search'
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types'
import { DEFAULT_TOKEN_LIST } from 'state/lists/hooks'
import { Transaction, getTransactionType } from 'state/info/types'
import { formatUnits } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'

const fetchTopTransactions = async (): Promise<Transaction[] | undefined> => {
  try {
    const getRequest = (): SearchRequest => ({
      index: `transactions_*`,
      size: 100,
      query: {
        bool: {
          must: [
            {
              term: {
                type: {
                  value: 'SWAP',
                },
              },
            },
          ],
          should: [],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
    })

    const { data } = await search<SearchResponse<ESTransaction>>(getRequest())

    const mappedData = data.hits.hits.map(hit => {
      const source = hit._source
      const tokenInInfo = DEFAULT_TOKEN_LIST.tokens.find(token => token.symbol === source.token_in.symbol)
      const tokenOutInfo = DEFAULT_TOKEN_LIST.tokens.find(token => token.symbol === source.token_out.symbol)
      const amountToken0 = Number(formatUnits(BigNumber.from(source.token_in.amount), tokenInInfo?.decimals || 18))
      const amountToken1 =
        Number(formatUnits(BigNumber.from(source.token_out.amount), tokenOutInfo?.decimals || 18)) * -1

      return {
        type: getTransactionType(source.type),
        hash: source.hash,
        timestamp: (source.timestamp / 1000).toString(),
        sender: source.receiver_address,
        token0Symbol: source.token_in.symbol,
        token1Symbol: source.token_out.symbol,
        token0Address: tokenInInfo?.address || '',
        token1Address: tokenOutInfo?.address || '',
        amountUSD: source.total_value,
        amountToken0,
        amountToken1,
      } as Transaction
    })

    return mappedData.sort((a, b) => {
      return parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10)
    })
  } catch {
    return undefined
  }
}

export default fetchTopTransactions
