import styled from 'styled-components'

interface AvatarImageProps {
  src: string
  borderColor?: string
  alt?: string
}

const AvatarImage = styled.div.attrs<AvatarImageProps>(({ alt }) => ({
  alt,
}))<AvatarImageProps>`
  background: url('${({ src }) => src}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 128px;
  height: 128px;
  border: 6px solid ${({ theme }) => theme.colors.vertoBg1};

  & > img {
    border-radius: 50%;
  }
`

export default AvatarImage
