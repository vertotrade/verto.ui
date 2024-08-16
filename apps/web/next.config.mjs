/* eslint-disable @typescript-eslint/no-var-requires */
import BundleAnalyzer from '@next/bundle-analyzer'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// const withTM = NextTranspileModules([])

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  assetPrefix: process.env.NEXT_ASSETS_URL,
  experimental: {
    scrollRestoration: true,
    transpilePackages: [
      '@verto/ui',
      '@verto/uikit',
      '@verto/swap-sdk-core',
      '@verto/farms',
      '@verto/localization',
      '@verto/hooks',
      '@verto/multicall',
      '@verto/token-lists',
      '@verto/utils',
      '@verto/tokens',
      '@verto/smart-router',
      '@wagmi',
      'wagmi',
      '@ledgerhq',
      '@gnosis.pm/safe-apps-wagmi',
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nftvertodata.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'd22btkczn46ld4.cloudfront.net',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/info/tokens/:address',
      },
      {
        source: '/info/pool/:address',
        destination: '/info/pools/:address',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/tokens/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/swap/:outputCurrency',
        destination: '/swap?outputCurrency=:outputCurrency',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/liquidity',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/res',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/collectibles',
        destination: '/nfts',
        permanent: true,
      },
      {
        source: '/info/pools',
        destination: '/info/pairs',
        permanent: true,
      },
      {
        source: '/info/pools/:address',
        destination: '/info/pairs/:address',
        permanent: true,
      },
    ]
  },
  webpack: webpackConfig => {
    return webpackConfig
  },
}

export default withBundleAnalyzer(withVanillaExtract(config))
