import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const SubgraphHealthIndicator = dynamic(() => import('components/SubgraphHealthIndicator'), { ssr: false })

export const FixedSubgraphHealthIndicator = () => {
  const { pathname } = useRouter()
  const isOnNftPages = pathname.includes('nfts')
  return isOnNftPages ? <SubgraphHealthIndicator subgraphName="vertotrade/nft-market" /> : null
}
