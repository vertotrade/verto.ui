import { createGlobalStyle } from 'styled-components'
import { VertoTheme } from '@verto/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends VertoTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Syne', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
