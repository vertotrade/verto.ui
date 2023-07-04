import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { ChainId } from '@verto/sdk'
import { useAccount } from 'wagmi'
import {
  VertoHeading,
  Toggle,
  Text,
  Flex,
  Box,
  Farm as FarmUI,
  Loading,
  SearchInput,
  Select,
  OptionProps,
  FlexLayout,
  PageHeader,
  ToggleView,
  useMatchBreakpoints,
} from '@verto/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import { useRebusVaultUserData } from 'state/pools/hooks'
import { useIntersectionObserver } from '@verto/hooks'
import { DeserializedFarm, FarmWithStakedValue } from '@verto/farms'
import { useTranslation } from '@verto/localization'
import { getFarmApr } from 'utils/apr'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Table from './components/FarmTable/FarmTable'
import { BCakeBoosterCard } from './components/BCakeBoosterCard'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: center;
  }
`
const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Text} {
    margin-left: 8px;
  }
`

const FilterContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 75%;
    padding: 0;
  }

  ${({ isMobile }) => (isMobile ? 'justify-content: space-between;' : '')}
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { data: farmsLP, userDataLoaded, poolLength, regularRewardPerBlock } = useFarms()
  const cakePrice = usePriceCakeBusd()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { address: account } = useAccount()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  useRebusVaultUserData()

  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  // NOTE: Temporarily inactive aBNBc-BNB LP on FE
  const activeFarms = farmsLP.filter(farm => farm.multiplier !== '0X' && (!poolLength || poolLength > farm.pid))

  const inactiveFarms = farmsLP.filter(farm => farm.multiplier === '0X')
  const archivedFarms = farmsLP

  const stakedOnlyFarms = activeFarms.filter(
    farm =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    farm =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    farm =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(farm => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }

        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              chainId,
              new BigNumber(farm.poolWeight),
              cakePrice,
              totalLiquidity,
              farm.lpAddress,
              regularRewardPerBlock,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }

      return farmsToDisplayWithAPR
    },
    [query, isActive, chainId, cakePrice, regularRewardPerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarms = useMemo(() => {
    let chosenFs = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return chosenFs
  }, [
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ])

  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [chosenFarms, sortOption, numberOfFarmsVisible])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible(farmsCurrentlyVisible => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const providerValue = useMemo(() => ({ chosenFarmsMemoized }), [chosenFarmsMemoized])

  const { theme } = useTheme()

  const { isMobile } = useMatchBreakpoints()

  return (
    <FarmsContext.Provider value={providerValue}>
      <PageHeader>
        <FarmFlexWrapper justifyContent="space-between">
          <Box>
            <VertoHeading as="h1" scale="h2" mb="4px">
              {t('Farms')}
            </VertoHeading>
            <Text fontSize="14px">{t('Stake LP tokens to earn.')}</Text>
          </Box>
          {chainId === ChainId.BSC && (
            <Box>
              <BCakeBoosterCard />
            </Box>
          )}
        </FarmFlexWrapper>
      </PageHeader>
      <Page>
        <ControlContainer>
          <FilterContainer isMobile={isMobile}>
            <SearchInput
              initialValue={normalizedUrlSearch}
              onChange={handleChangeQuery}
              placeholder="Search Farms"
              iconColor={theme.colors.placeholder}
            />
            <FarmUI.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
            <Select
              my="8px"
              mr="12px"
              ml="4px"
              options={[
                {
                  label: t('Hot'),
                  value: 'hot',
                },
                {
                  label: t('APR'),
                  value: 'apr',
                },
                {
                  label: t('Multiplier'),
                  value: 'multiplier',
                },
                {
                  label: t('Earned'),
                  value: 'earned',
                },
                {
                  label: t('Liquidity'),
                  value: 'liquidity',
                },
                {
                  label: t('Latest'),
                  value: 'latest',
                },
              ]}
              onOptionChange={handleSortOptionChange}
              color="text"
            />
            <Flex mt={isMobile ? '8px' : '0'} ml="4px">
              <ToggleWrapper>
                <Toggle
                  id="staked-only-farms"
                  checked={stakedOnly}
                  onChange={() => setStakedOnly(!stakedOnly)}
                  scale="sm"
                />
                <Text small ml="8px" color="text">
                  {t('Staked only')}
                </Text>
              </ToggleWrapper>
            </Flex>
          </FilterContainer>
          <ViewControls>
            <Flex>
              <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
            </Flex>
          </ViewControls>
        </ControlContainer>
        {viewMode === ViewMode.TABLE ? (
          <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
        ) : (
          <FlexLayout>{children}</FlexLayout>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {poolLength && <div ref={observerRef} />}
      </Page>
    </FarmsContext.Provider>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
