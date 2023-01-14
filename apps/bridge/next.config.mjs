import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: [
      '@verto/uikit',
      '@verto/ui',
      '@verto/hooks',
      '@verto/localization',
      '@verto/utils',
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default withAxiom(withVanillaExtract(nextConfig))
