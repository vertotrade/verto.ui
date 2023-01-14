import { Currency } from '@verto/aptos-swap-sdk'
import { APTOS_COIN } from '@verto/awgmi'

export default function currencyId(currency: Currency): string {
  if (currency?.isNative) return APTOS_COIN
  if (currency?.isToken) return currency.address
  throw new Error('invalid currency')
}
