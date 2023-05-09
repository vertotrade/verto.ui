import styled from 'styled-components'

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Heading, Flex, Text, FlexLayout, PageHeader, Loading, Pool, ViewMode } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@verto/sdk'
import { TokenPairImage } from 'components/TokenImage'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import RebusVaultCard from './components/RebusVaultCard'
import PoolControls from './components/PoolControls'
import PoolRow, { VaultPoolRow } from './components/PoolsTable/PoolRow'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithVault()

  const filteredPools = useMemo(() => pools.filter(pool => !pool.hasWhitelist || pool.whitelisted), [pools])

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Minting Pools')}
            </Heading>
            <Heading scale="md" color="notSelectedNavColor">
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading scale="md" color="notSelectedNavColor">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={filteredPools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch }) => (
            <>
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map(pool =>
                    pool.vaultKey ? (
                      <RebusVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
                    ) : (
                      <Pool.PoolCard<Token>
                        key={pool.sousId}
                        pool={pool}
                        isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                        cardContent={
                          account ? (
                            <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                          ) : (
                            <>
                              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                                {t('Start earning')}
                              </Text>
                              <ConnectWalletButton />
                            </>
                          )
                        }
                        tokenPairImage={
                          <TokenPairImage
                            primaryToken={pool.earningToken}
                            secondaryToken={pool.stakingToken}
                            width={64}
                            height={64}
                          />
                        }
                        cardFooter={<CardFooter pool={pool} account={account} />}
                        aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                      />
                    ),
                  )}
                </CardLayout>
              ) : (
                chosenPools.length > 0 && (
                  <Pool.PoolsTable>
                    {chosenPools.map(pool =>
                      pool.vaultKey ? (
                        <VaultPoolRow
                          initialActivity={
                            normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()
                          }
                          key={pool.vaultKey}
                          vaultKey={pool.vaultKey}
                          account={account}
                        />
                      ) : (
                        <PoolRow
                          initialActivity={
                            normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()
                          }
                          key={pool.sousId}
                          sousId={pool.sousId}
                          account={account}
                        />
                      ),
                    )}
                  </Pool.PoolsTable>
                )
              )}
            </>
          )}
        </PoolControls>
      </Page>
    </>
  )
}

export default Pools
