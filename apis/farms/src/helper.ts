import { Obj } from 'itty-router'
import { error } from 'itty-router-extras'
import { createFarmFetcher } from '@verto/farms'
import { createMulticall } from '@verto/multicall'
import { bscProvider, bscTestnetProvider, goerliProvider, rebusProvider, rebusTestnetProvider, rebusTestnetL2Provider, rebusL2Provider } from './provider'

export const getProvider = ({ chainId }: { chainId?: number }): any => {
  switch (chainId) {
    case 56:
      return bscProvider
    case 97:
      return bscTestnetProvider
    case 5:
      return goerliProvider
    case 1011:
      return rebusProvider
    case 3033:
      return rebusTestnetProvider
    case 3034:
      return rebusTestnetL2Provider  
    case 9696:
        return rebusL2Provider  
    default:
      return null
  }
}

const multicall = createMulticall(getProvider)

export const farmFetcher = createFarmFetcher(multicall.multicallv2)

export function requireChainId(params: Obj | undefined) {
  if (!params) {
    return error(400, 'Invalid params')
  }
  const { chainId } = params
  if (!chainId || !farmFetcher.isChainSupported(+chainId)) {
    return error(400, 'Invalid chain id')
  }
  return null
}

function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

export function isOriginAllowed(origin: string | null, allowedOrigin: any) {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true
      }
    }
    return false
  }
  if (isString(allowedOrigin)) {
    return origin === allowedOrigin
  }
  if (origin && allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin)
  }
  return !!allowedOrigin
}

export const handleCors = (allowedOrigin: any) => (request: Request) => {
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  const methods = `GET, HEAD, OPTIONS`
  const headers = `referer, origin, content-type`
  if (isAllowed && reqOrigin) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': reqOrigin,
      'Access-Control-Allow-Methods': methods,
      'Access-Control-Allow-Headers': headers,
    }
    // Handle CORS pre-flight request.
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  console.info('Origin not allowed', reqOrigin)
  // Handle standard OPTIONS request.
  return new Response(null, {
    headers: {
      Allow: methods,
    },
  })
}

export const wrapCorsHeader = (request: Request, response: Response, options: any = {}) => {
  const { allowedOrigin = '*' } = options
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  if (isAllowed && reqOrigin) {
    response.headers.set('Access-Control-Allow-Origin', reqOrigin)
  }
  console.info('Origin not allowed', reqOrigin)

  return response
}
