/* eslint-disable no-console */
import { Client } from '@elastic/elasticsearch'

if (!process.env.ES_NODE_URL) {
  throw new Error('ES_NODE_URL must be set')
}

if (!process.env.ES_API_KEY) {
  throw new Error('ES_API_KEY must be set')
}

const allTime = process.env.ALL_TIME === 'true'

const client = new Client({
  node: process.env.ES_NODE_URL,
  auth: {
    apiKey: process.env.ES_API_KEY || '',
  },
})

async function execute(timeWindow) {
  const token0 = process.env.TOKEN_0
  const token1 = process.env.TOKEN_1
  if (!token0 || !token1) {
    throw new Error('TIME_WINDOW, TOKEN_0 and TOKEN_1 must be set')
  }

  const pair = `${token0}-${token1}`
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
    await client.indices.delete({
      index: destIndex,
    })
  }

  if (!(await client.indices.exists({ index: destIndex }))) {
    console.log(`Creating index ${destIndex}...`)
    await client.indices.create({
      index: destIndex,
    })
  }

  console.log(`Setting index ${destIndex} alias as ${alias}...`)

  await client.indices.putAlias({
    index: destIndex,
    name: alias,
  })

  console.log(`Creating transform ${transformId}...`)

  try {
    console.log(`Stopping transform ${transformId}`)
    await client.transform.stopTransform({ transform_id: transformId, force: true, wait_for_completion: true })
    // eslint-disable-next-line no-empty
  } catch (e) {}

  try {
    console.log(`Deleting transform ${transformId}`)
    await client.transform.deleteTransform({ transform_id: transformId })
    // eslint-disable-next-line no-empty
  } catch (e) {}

  console.log(`Creating transform ${transformId}`)
  await client.transform.putTransform({
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
            should: [],
            must: [
              {
                term: {
                  pair: {
                    value: pair,
                  },
                },
              },
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
  })

  console.log(`Starting transform ${transformId}`)
  await client.transform.startTransform({ transform_id: transformId })
}

// eslint-disable-next-line prettier/prettier
(async () => {
  const timeWindows = ['hourly', 'daily', 'weekly']

  for (const timeWindow of timeWindows) {
    // eslint-disable-next-line no-await-in-loop
    await execute(timeWindow)
  }
})()
