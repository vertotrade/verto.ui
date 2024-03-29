import { useTranslation } from '@verto/localization'
import {
  Flex,
  Farm as FarmUI,
  FarmTableLiquidityProps,
  FarmTableMultiplierProps,
  LinkExternal,
  Text,
  useMatchBreakpoints,
} from '@verto/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContext, useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
import styled, { css, keyframes } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '@verto/farms'

import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
import { AprProps } from '../Apr'
import { HarvestAction, HarvestActionContainer, ProxyHarvestActionContainer } from './HarvestAction'
import StakedAction, { ProxyStakedContainer, StakedContainer } from './StakedAction'

const { Liquidity } = FarmUI.FarmTable

export interface ActionPanelProps {
  apr: AprProps
  multiplier: FarmTableMultiplierProps
  liquidity: FarmTableLiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const Tr = styled.tr<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: transparent;
  padding: 24px;
  border-radius: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const StyledFlex = styled(Flex)<{ isMobile?: boolean }>`
  margin-bottom: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: ${({ theme }) => theme.colors.dropdown};

  padding-bottom: ${({ isMobile }) => (isMobile ? '16px' : '24px')};

  ${({ isMobile }) => (isMobile ? 'padding-top: 8px;' : '')};
`

const ActionContainer = styled.div<{ isDesktop?: boolean }>`
  background-color: ${({ theme }) => theme.colors.dropdown};
  height: 100%;
  display: flex;
  flex-direction: column;

  ${({ isDesktop }) => (isDesktop ? 'margin-bottom: 8px' : '')};
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div<{ isDesktop?: boolean; isMobile?: boolean }>`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-top-left-radius: 8px;
  height: 100%;
  min-width: 200px;
  padding: 24px 0;
  padding-left: 32px;
  min-height: ${({ isMobile }) => (isMobile ? '0' : '150px')};

  ${({ isDesktop }) => (isDesktop ? 'border-bottom-left-radius: 8px' : '')};
  ${({ isDesktop }) => (isDesktop ? 'margin-bottom: 8px' : '')};

  ${({ isMobile }) => (isMobile ? 'border-top-right-radius: 8px' : '')};
  ${({ isMobile }) => (isMobile ? 'padding: 16px 16px 8px' : '')};
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const EmptyDiv = styled.div<{ isDesktop: boolean }>`
  min-height: 150px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  ${({ isDesktop }) => (isDesktop ? 'margin-bottom: 8px' : '')};
`

const TdStyled = styled.td<{ isDesktop: boolean }>`
  &:last-child ${EmptyDiv} {
    border-top-right-radius: 8px;
    ${({ isDesktop }) => (isDesktop ? 'border-bottom-right-radius: 8px' : '')};
  }
`

const EmptyTd = ({ isDesktop }: { isDesktop?: boolean }) => (
  <TdStyled isDesktop={isDesktop}>
    <EmptyDiv isDesktop={isDesktop} />
  </TdStyled>
)

const ActionPanel: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  details,
  apr,
  // multiplier,
  liquidity,
  userDataReady,
  expanded,
}) => {
  const { chainId } = useActiveChainId()
  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)

  const farm = details

  const { isDesktop, isMobile } = useMatchBreakpoints()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token, stableSwapAddress } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const { lpAddress } = farm
  const bsc = getBlockExploreLink(lpAddress, 'address', chainId)

  const infoUrl = useMemo(() => {
    if (farm.isStable) {
      return `/info${multiChainPaths[chainId]}/pairs/${stableSwapAddress}?type=stableSwap`
    }
    return `/info${multiChainPaths[chainId]}/pairs/${lpAddress}`
  }, [chainId, farm.isStable, lpAddress, stableSwapAddress])

  const infoContainer = useMemo(
    () => (
      <InfoContainer isMobile={isMobile} isDesktop={isDesktop}>
        <ValueContainer>
          {farm.isCommunity && farm.auctionHostingEndDate && (
            <ValueWrapper>
              <Text>{t('Auction Hosting Ends')}</Text>
              <Text paddingLeft="4px">
                {new Date(farm.auctionHostingEndDate).toLocaleString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </ValueWrapper>
          )}
          <Text small mb="8px">
            {t('About')}
          </Text>
        </ValueContainer>
        {isActive && (
          <StakeContainer>
            <StyledLinkExternal hoverBackgroundColor="transparent" href={`/add/${liquidityUrlPathParts}`}>
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        <StyledLinkExternal hoverBackgroundColor="transparent" isBscScan href={bsc}>
          {t('View Contract')}
        </StyledLinkExternal>
        <StyledLinkExternal hoverBackgroundColor="transparent" href={infoUrl}>
          {t('See Pair Info')}
        </StyledLinkExternal>
      </InfoContainer>
    ),
    [
      bsc,
      farm.auctionHostingEndDate,
      farm.isCommunity,
      infoUrl,
      isActive,
      isDesktop,
      isMobile,
      liquidityUrlPathParts,
      locale,
      lpLabel,
      t,
    ],
  )

  const stakedContainer = useMemo(
    () => (
      <ActionContainer isDesktop={isDesktop}>
        {shouldUseProxyFarm ? (
          <ProxyStakedContainer {...proxyFarm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
            {props => <StakedAction {...props} />}
          </ProxyStakedContainer>
        ) : (
          <StakedContainer {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
            {props => <StakedAction {...props} />}
          </StakedContainer>
        )}
      </ActionContainer>
    ),
    [apr.value, farm, isDesktop, lpLabel, proxyFarm, shouldUseProxyFarm, userDataReady],
  )

  const harvestContainer = useMemo(
    () => (
      <ActionContainer isDesktop={isDesktop}>
        {shouldUseProxyFarm ? (
          <ProxyHarvestActionContainer {...proxyFarm} userDataReady={userDataReady}>
            {props => <HarvestAction {...props} />}
          </ProxyHarvestActionContainer>
        ) : (
          <HarvestActionContainer {...farm} userDataReady={userDataReady}>
            {props => <HarvestAction {...props} />}
          </HarvestActionContainer>
        )}
      </ActionContainer>
    ),
    [farm, isDesktop, proxyFarm, shouldUseProxyFarm, userDataReady],
  )

  return (
    <>
      {isMobile && (
        <>
          <Tr expanded={expanded}>
            <td colSpan={4}>{infoContainer}</td>
          </Tr>
          <Tr expanded={expanded}>
            <td colSpan={4}>{harvestContainer}</td>
          </Tr>
          <Tr expanded={expanded}>
            <td colSpan={4}>{stakedContainer}</td>
          </Tr>
        </>
      )}
      {!isMobile && (
        <Tr expanded={expanded}>
          <td>{infoContainer}</td>
          <td>{harvestContainer}</td>
          {isDesktop && <EmptyTd isDesktop={isDesktop} />}
          <td>{stakedContainer}</td>
          <EmptyTd isDesktop={isDesktop} />
        </Tr>
      )}
      <Tr expanded={expanded}>
        {!isDesktop && (
          <td colSpan={4}>
            <StyledFlex isMobile={isMobile} alignItems="center" justifyContent="space-evenly" flexWrap="wrap-reverse">
              {/* <ValueWrapper> */}
              {/*   <Text>{t('APR')}</Text> */}
              {/*   <Apr {...apr} useTooltipText={false} boosted={farm.boosted} /> */}
              {/* </ValueWrapper> */}
              {/* <ValueWrapper>
                <Text mr="8px">{t('Multiplier')}</Text>
                <Multiplier {...multiplier} />
              </ValueWrapper> */}
              <ValueWrapper>
                <Text mr="8px">{t('Liquidity')}</Text>
                <Liquidity {...liquidity} />
              </ValueWrapper>
            </StyledFlex>
          </td>
        )}
      </Tr>
    </>
  )
}

export default ActionPanel
