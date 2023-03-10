import { ReactElement, createContext, useMemo, memo } from 'react'
import _noop from 'lodash/noop'

import { FarmWithStakedValue } from '@verto/farms'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

interface ProxyFarmContainerPropsType {
  children: ReactElement
  farm: FarmWithStakedValue
}

export const YieldBoosterStateContext = createContext({
  boosterState: YieldBoosterState.UNCONNECTED,
  refreshActivePool: _noop,
  proxyFarm: {},
  shouldUseProxyFarm: false,
  refreshProxyAddress: _noop,
  proxyAddress: '',
})

const ProxyFarmContainer: React.FC<ProxyFarmContainerPropsType> = ({ children, farm }) => {
  const {
    state: boosterState,
    refreshActivePool,
    shouldUseProxyFarm,
    refreshProxyAddress,
    proxyAddress,
  } = useYieldBoosterState({
    farmPid: farm.pid,
  })

  const proxyFarm = useMemo(
    () => ({
      ...farm,
      userData: farm.userData.proxy,
    }),
    [farm],
  )

  return (
    <YieldBoosterStateContext.Provider
      value={{ proxyAddress, boosterState, refreshActivePool, refreshProxyAddress, proxyFarm, shouldUseProxyFarm }}>
      {children}
    </YieldBoosterStateContext.Provider>
  )
}

export default memo(ProxyFarmContainer)
