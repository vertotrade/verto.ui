import { useMemo } from 'react'
import uriToHttp from '@verto/utils/uriToHttp'

export default function useHttpLocations(uri: string | undefined): string[] {
  return useMemo(() => {
    return uri ? uriToHttp(uri) : []
  }, [uri])
}
