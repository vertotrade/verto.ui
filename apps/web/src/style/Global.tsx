import { createGlobalStyle } from 'styled-components'
import { VertoTheme } from '@verto/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends VertoTheme {}
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.vertoBg1};

    * {
      font-family: 'Roboto', sans-serif;
    }

    .modal * {
      font-family: 'Inter', sans-serif;
    }

    h1, h2, h3, h4, h5, h6,
    .modal :is(h1, h2, h3, h4, h5, h6),
    h1 span, h2 span, h3 span {
      font-family: 'Poppins', sans-serif;
    }

    input {
      font-family: 'Inter', sans-serif;
    }

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
