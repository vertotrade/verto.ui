import styled from 'styled-components'
import { Select, OptionProps } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useNftStorage } from 'state/nftMarket/storage'
import { useGetNftOrdering } from 'state/nftMarket/hooks'

const StyledSelect = styled(Select)`
  > div {
    background: ${({ theme }) => theme.colors.vertoBg1};
  }
`

const SortSelect: React.FC<React.PropsWithChildren<{ collectionAddress: string }>> = ({ collectionAddress }) => {
  const { t } = useTranslation()
  const { setOrdering } = useNftStorage()
  const selectedOrder = useGetNftOrdering(collectionAddress)
  const handleChange = (newOption: OptionProps) => {
    const { field, direction } = newOption.value
    setOrdering({ collection: collectionAddress, field, direction })
  }

  const sortByItems = [
    { label: t('Recently listed'), value: { field: 'updated_at', direction: 'desc' } },
    { label: t('Lowest price'), value: { field: 'asking_price', direction: 'asc' } },
    { label: t('Highest price'), value: { field: 'asking_price', direction: 'desc' } },
    { label: t('Token ID'), value: { field: 'token_id', direction: 'asc' } },
  ]

  const defaultOptionIndex = sortByItems.findIndex(
    option => option.value.field === selectedOrder.field && option.value.direction === selectedOrder.direction,
  )

  return (
    <StyledSelect
      options={sortByItems}
      onOptionChange={handleChange}
      key={defaultOptionIndex !== -1 ? defaultOptionIndex : undefined}
      defaultOptionIndex={defaultOptionIndex !== -1 ? defaultOptionIndex : undefined}
    />
  )
}

export default SortSelect
