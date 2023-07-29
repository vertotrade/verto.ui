/* eslint-disable camelcase */
import axios from 'axios'

export const client = axios.create({
  baseURL: '/api',
})

export const search = <T>(body) => client.post<T>('/search', body)

export type TransactionToken = {
  symbol: string
  amount: string
  price: number
  name: string
}

export type Transaction = {
  total_value: number
  fees: string
  block_number: number
  block_hash: string
  type: string
  price_proportion: number
  pair: string
  receiver_address: string
  ingest_timestamp: string
  token_out: TransactionToken
  hash: string
  token_in: TransactionToken
  timestamp: number
}

export type AggregatedToken = {
  symbol: string
  amount: string
  max_price: number
  volume_out: string
  min_price: number
  price: number
  name: string
  volume_in: string
}

export type LiquidityAggregate = {
  total_value: number
  total_transactions: number
  token_0: AggregatedToken
  token_1: AggregatedToken
  ingest_timestamp: string
  pair: string
  timestamp: string
}
