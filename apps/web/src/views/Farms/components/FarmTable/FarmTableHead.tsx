import { useMemo } from 'react'
import styled from 'styled-components'
import { MobileColumnSchema, DesktopColumnSchema, useMatchBreakpoints } from '@verto/uikit'
import { ColumnsDefTypes } from '@verto/uikit/src/widgets/Farm/types'

type FarmTableHead = {
  headerRow: Array<string>
}

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.newPrimary};
`

const Th = styled.th<{ isFirstChild: boolean; isDesktop: boolean }>`
  ${({ isFirstChild, isDesktop }) => (isFirstChild ? (isDesktop ? 'width: 380px;' : 'width: 260px') : '')};
`

const InnerCell = styled.div<{ isFirstChild: boolean }>`
  padding-bottom: 8px;
  text-transform: capitalize;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;

  padding-left: ${({ isFirstChild }) => (isFirstChild ? '32px' : '0')};
  color: ${({ theme }) => theme.colors.tableHeader};
`

export function FarmTableHead() {
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const tableSchema = isDesktop ? DesktopColumnSchema : MobileColumnSchema

  const headerCells = useMemo(
    () =>
      tableSchema.map(({ label }: ColumnsDefTypes, index: number) => (
        <Th isFirstChild={index === 0} isDesktop={isDesktop}>
          <InnerCell isFirstChild={index === 0}>{isMobile ? '' : label}</InnerCell>
        </Th>
      )),
    [tableSchema, isDesktop, isMobile],
  )

  return <Tr>{headerCells}</Tr>
}
