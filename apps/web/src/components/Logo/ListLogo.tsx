import styled from 'styled-components'
import { useHttpLocations } from '@verto/hooks'
import { TokenLogo } from '@verto/uikit'
import { BAD_SRCS } from './constants'

const StyledListLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <StyledListLogo badSrcs={BAD_SRCS} alt={alt} size={size} srcs={srcs} style={style} />
}
