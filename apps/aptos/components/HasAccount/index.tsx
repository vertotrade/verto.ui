import { useAccount } from '@verto/awgmi'
import { useIsMounted } from '@verto/hooks'

export default function HasAccount({ fallbackComp, children }) {
  const { account } = useAccount()
  const isMounted = useIsMounted()

  return isMounted && account ? <>{children}</> : fallbackComp
}
