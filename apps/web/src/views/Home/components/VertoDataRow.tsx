import { Flex, Heading, Skeleton, Text, Balance } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import styled from 'styled-components'
import { formatNumber } from '@verto/utils/formatBalance'
import { useHomeData } from 'utils/home'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean; noDesktopBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.greyO} solid;
         }
       `
      : `border-left: 1px ${theme.colors.greyO} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}

  ${({ noDesktopBorder, theme }) =>
    noDesktopBorder &&
    `${theme.mediaQueries.md} {
           padding: 0;
           border-left: none;
         }
       `}
`

const GridWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.greyO};
  border-radius: 24px;
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  padding: 0px 24px 24px;
  grid-template-columns: repeat(2, auto);
  grid-template-areas:
    'a d'
    'b e'
    'c f';

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-areas:
      'a b'
      'c d'
      'e f';
    grid-gap: 32px;
    grid-template-columns: repeat(2, auto);
  }
`

const VertoDataRow = () => {
  const { t } = useTranslation()
  const {
    CIRCULATING_SUPPLY: circulatingSupply,
    TOTAL_SUPPLY: vertoSupply,
    BURNED: burnedBalance,
    MARKETCAP: marketCap,
    VERTO_FOR_BLOCK: emissionsPerBlock,
  } = useHomeData() || {}

  return (
    <GridWrapper flexDirection="column">
      <Heading as="h2" scale="md" mb="24px" p="24px">
        {t('Token Details')}
      </Heading>
      <Grid>
        <Flex flexDirection="column" style={{ gridArea: 'a' }}>
          <Text color="textSubtle">{t('Circulating Supply')}</Text>
          {typeof circulatingSupply === 'number' ? (
            <Balance
              color="text"
              decimals={0}
              lineHeight="1.1"
              fontFamily={`'Poppins',sans-serif`}
              fontSize="24px"
              bold
              value={circulatingSupply}
            />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </Flex>
        <StyledColumn noMobileBorder noDesktopBorder style={{ gridArea: 'b' }}>
          <Text color="textSubtle">{t('Total supply')}</Text>
          {typeof vertoSupply === 'number' ? (
            <Balance
              color="text"
              decimals={0}
              lineHeight="1.1"
              fontFamily={`'Poppins',sans-serif`}
              fontSize="24px"
              bold
              value={vertoSupply}
            />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn noMobileBorder noDesktopBorder style={{ gridArea: 'c' }}>
          <Text color="textSubtle">{t('Max Supply')}</Text>

          <Balance
            color="text"
            decimals={0}
            lineHeight="1.1"
            fontFamily={`'Poppins',sans-serif`}
            fontSize="24px"
            bold
            value={600000000}
          />
        </StyledColumn>
        <StyledColumn noMobileBorder noDesktopBorder style={{ gridArea: 'd' }}>
          <Text color="textSubtle">{t('Market cap')}</Text>
          {typeof marketCap === 'number' ? (
            <Heading fontFamily={`'Poppins',sans-serif`} scale="lg" color="text">
              {t('$%marketCap%', { marketCap: formatNumber(marketCap, 2) })}
            </Heading>
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn noMobileBorder noDesktopBorder style={{ gridArea: 'e' }}>
          <Text color="textSubtle">{t('Burned to date')}</Text>
          {typeof burnedBalance === 'number' ? (
            <Balance
              color="text"
              decimals={0}
              lineHeight="1.1"
              fontFamily={`'Poppins',sans-serif`}
              fontSize="24px"
              bold
              value={burnedBalance}
            />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn noMobileBorder noDesktopBorder style={{ gridArea: 'f' }}>
          <Text color="textSubtle">{t('Current emissions')}</Text>

          {typeof emissionsPerBlock === 'number' ? (
            <Heading fontFamily={`'Poppins',sans-serif`} color="text" scale="lg">
              {t('%emissionsPerBlock%/block', { emissionsPerBlock })}
            </Heading>
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
      </Grid>
    </GridWrapper>
  )
}

export default VertoDataRow
