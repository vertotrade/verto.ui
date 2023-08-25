import { useFetchWithCache } from './fetchWithCache'

export type VertoHomeData = {
  VERTO: number
  TOTAL_SUPPLY: number
  CIRCULATING_SUPPLY: number
  MARKETCAP: number
  BURNED: number
  VERTO_FOR_BLOCK: number
}

export const useHomeData = () => {
  return useFetchWithCache('verto', '') as VertoHomeData
}
