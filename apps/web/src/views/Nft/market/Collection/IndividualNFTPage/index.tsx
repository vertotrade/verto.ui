import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For PancakeBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
