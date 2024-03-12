/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Client } from '@elastic/elasticsearch'

if (!process.env.ES_NODE_URL) {
  throw new Error('ES_NODE_URL must be set')
}

if (!process.env.ES_API_KEY) {
  throw new Error('ES_API_KEY must be set')
}

const CURRENCIES = [`WREBUS`, `VERTO`, `LUDUS`, `axlUSDC`, `axlWBTC`, `axlWETH`, `COM`]
const TIME_WINDOWS = ['hourly', 'daily', 'weekly']

// Only set this value to one of the currencies above if adding one currency only instead of redoing all of them
const NEW_CURRENCY = ``

const client = new Client({
  node: process.env.ES_NODE_URL,
  auth: {
    apiKey: process.env.ES_API_KEY || '',
  },
})

async function sleep(delay) {
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function retry(callback) {
  let retries = 0
  let lastError

  while (retries < 2) {
    try {
      return await callback()
    } catch (err) {
      lastError = err
      retries++
      await sleep(2000)
    }
  }

  throw lastError
}

async function execute(token0, token1, timeWindow, allTime) {
  if (!token0 || !token1) {
    throw new Error('TIME_WINDOW, TOKEN_0 and TOKEN_1 must be set')
  }

  const pair = `${token0}-${token1}`
  const inversedPair = `${token1}-${token0}`
  const lowercasePair = `${token0.toLowerCase()}-${token1.toLowerCase()}`
  const destIndex = `liquidity_${lowercasePair}_${timeWindow}`
  const alias = `liquidity_${token1.toLowerCase()}-${token0.toLowerCase()}_${timeWindow}`
  const transformId = `${destIndex}_transform`

  let range = `now-1d/d`
  let calendarInterval = `hour`

  if (timeWindow === 'daily') {
    range = `now-1M/d`
    calendarInterval = `day`
  } else if (timeWindow === 'weekly') {
    range = `now-1y/w`
    calendarInterval = `week`
  }

  if (allTime) {
    console.log(`Deleting index ${destIndex}...`)
    try {
      await retry(() =>
        client.indices.delete({
          index: destIndex,
        }),
      )
    } catch (err: any) {
      // Skip if index does not exist
      if (err.meta.statusCode !== 404) {
        throw err
      }
    }
  }

  if (!(await retry(() => client.indices.exists({ index: destIndex })))) {
    console.log(`Creating index ${destIndex}...`)
    await retry(() =>
      client.indices.create({
        index: destIndex,
      }),
    )
  }

  console.log(`Setting index ${destIndex} alias as ${alias}...`)

  await retry(() =>
    client.indices.putAlias({
      index: destIndex,
      name: alias,
    }),
  )

  console.log(`Creating transform ${transformId}...`)

  try {
    console.log(`Stopping transform ${transformId}`)
    await retry(() =>
      client.transform.stopTransform({ transform_id: transformId, force: true, wait_for_completion: true }),
    )
    // eslint-disable-next-line no-empty
  } catch (e) {}

  try {
    console.log(`Deleting transform ${transformId}`)
    await retry(() => client.transform.deleteTransform({ transform_id: transformId }))
    // eslint-disable-next-line no-empty
  } catch (e) {}

  console.log(`Creating transform ${transformId}`)
  await sleep(1000)
  await retry(() =>
    client.transform.putTransform({
      transform_id: transformId,
      body: {
        description: `${timeWindow} aggregate of liquidity for ${pair}`,
        dest: {
          index: destIndex,
          pipeline: `add_ingest_timestamp_pipeline`,
        },
        source: {
          index: `transactions_*`,
          query: {
            bool: {
              minimum_should_match: 1,
              should: [
                {
                  term: {
                    pair: {
                      value: pair,
                    },
                  },
                },
                {
                  term: {
                    pair: {
                      value: inversedPair,
                    },
                  },
                },
              ],
              must: [
                (!allTime && {
                  range: {
                    timestamp: {
                      gte: range,
                    },
                  },
                }) as any,
              ].filter(Boolean),
            },
          },
        },
        pivot: {
          group_by: {
            timestamp: {
              date_histogram: {
                field: 'timestamp',
                calendar_interval: calendarInterval as any,
              },
            },
            pair: {
              terms: {
                field: 'pair',
              },
            },
          },
          aggregations: {
            total_transactions: {
              cardinality: {
                field: 'hash',
              },
            },
            total_value: {
              sum: {
                field: 'total_value',
              },
            },
            token_0: {
              scripted_metric: {
                init_script: 'state.values = []',
                map_script: `
                HashMap info = new HashMap();
                if (params._source.token_in.symbol == '${token0}') {
                  info.token = params._source.token_in;
                  info.in = true;
                } else {
                  info.token = params._source.token_out;
                  info.in = false;
                }
                state.values.add(info);
                `,
                combine_script: 'return state.values',
                reduce_script: `
                HashMap token = null;
                ArrayList infos = new ArrayList();
                for (a in states) {
                  infos.addAll(a);
                }
                for (a in infos) {
                  if (token == null) {
                    token = new HashMap();
                    token.name = a.token.name;
                    token.symbol = a.token.symbol;
                    token.amount = new BigInteger(a.token.amount);
                    token.price = a.token.price;
                    token.min_price = a.token.price;
                    token.max_price = a.token.price;
                    token.volume_in = BigInteger.valueOf((long)(a.in ? a.token.price * new BigInteger(a.token.amount) : 0));
                    token.volume_out = BigInteger.valueOf((long)(a.in ? 0 : a.token.price * new BigInteger(a.token.amount)));
                  } else {
                    token.amount = token.amount.add(new BigInteger(a.token.amount));
                    token.price += a.token.price;
    
                    if (token.min_price > a.token.price) {
                      token.min_price = a.token.price;
                    }
                    
                    if (token.max_price < a.token.price) {
                      token.max_price = a.token.price;
                    }
                    
                    if (a.in) {
                      token.volume_in = token.volume_in.add(BigInteger.valueOf((long)(a.token.price * new BigInteger(a.token.amount))));
                    } else {
                      token.volume_out = token.volume_out.add(BigInteger.valueOf((long)(a.token.price * new BigInteger(a.token.amount))));
                    }
                  }
                }
                if (token != null) {
                  token.price /= states.length;
                  token.volume_in = token.volume_in.toString();
                  token.volume_out = token.volume_out.toString();
                  token.amount = token.amount.toString();
                }
                return token;
              `,
              },
            },
            token_1: {
              scripted_metric: {
                init_script: 'state.values = []',
                map_script: `
                HashMap info = new HashMap();
                if (params._source.token_in.symbol == '${token1}') {
                  info.token = params._source.token_in;
                  info.in = true;
                } else {
                  info.token = params._source.token_out;
                  info.in = false;
                }
                state.values.add(info);
                `,
                combine_script: 'return state.values',
                reduce_script: `
                HashMap token = null;
                ArrayList infos = new ArrayList();
                for (a in states) {
                  infos.addAll(a);
                }
                for (a in infos) {
                  if (token == null) {
                    token = new HashMap();
                    token.name = a.token.name;
                    token.symbol = a.token.symbol;
                    token.amount = new BigInteger(a.token.amount);
                    token.price = a.token.price;
                    token.min_price = a.token.price;
                    token.max_price = a.token.price;
                    token.volume_in = BigInteger.valueOf((long)(a.in ? a.token.price * new BigInteger(a.token.amount) : 0));
                    token.volume_out = BigInteger.valueOf((long)(a.in ? 0 : a.token.price * new BigInteger(a.token.amount)));
                  } else {
                    token.amount = token.amount.add(new BigInteger(a.token.amount));
                    token.price += a.token.price;
    
                    if (token.min_price > a.token.price) {
                      token.min_price = a.token.price;
                    }
                    
                    if (token.max_price < a.token.price) {
                      token.max_price = a.token.price;
                    }
                    
                    if (a.in) {
                      token.volume_in = token.volume_in.add(BigInteger.valueOf((long)(a.token.price * new BigInteger(a.token.amount))));
                    } else {
                      token.volume_out = token.volume_out.add(BigInteger.valueOf((long)(a.token.price * new BigInteger(a.token.amount))));
                    }
                  }
                }
                if (token != null) {
                  token.price /= states.length;
                  token.volume_in = token.volume_in.toString();
                  token.volume_out = token.volume_out.toString();
                  token.amount = token.amount.toString();
                }
                return token;
              `,
              },
            },
          },
        },
        frequency: '60s',
        sync: {
          time: {
            field: 'ingest_timestamp',
            delay: '60s',
          },
        },
        settings: {
          align_checkpoints: false,
        },
      },
    }),
  )

  console.log(`Starting transform ${transformId}`)
  await retry(() => client.transform.startTransform({ transform_id: transformId }))
}

async function runForAll(allTime) {
  for (let i = 0, len = CURRENCIES.length; i < len; ++i) {
    const currency0 = CURRENCIES[i]
    const otherCurrencies = CURRENCIES.slice(i + 1)

    if (currency0 === NEW_CURRENCY) {
      continue
    }

    if (NEW_CURRENCY) {
      for (const timeWindow of TIME_WINDOWS) {
        await execute(currency0, NEW_CURRENCY, timeWindow, allTime)
        await sleep(1000)
      }
    } else {
      for (const currency1 of otherCurrencies) {
        for (const timeWindow of TIME_WINDOWS) {
          await execute(currency0, currency1, timeWindow, allTime)
          await sleep(1000)
        }
      }
    }
  }
}

// eslint-disable-next-line prettier/prettier
(async () => {
  const allTime = process.env.ALL_TIME === 'true'

  if (allTime) {
    console.log(`Running for all time...`)
    await runForAll(true)
    console.log(`Finished running for all time...`)
    await sleep(5000)
    console.log(`Updating transforms to query only recent...`)
    await runForAll(false)
  } else {
    await runForAll(false)
  }
})()
