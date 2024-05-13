// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { configFile: './babel-test.config.json' }],
    // '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/src/config/__tests__/'],
  moduleNameMapper: {
    '^@verto/uikit': '<rootDir>/../../packages/uikit/src',
    '^@verto/ui-wallets': '<rootDir>../../packages/ui-wallets/src',
    '^@verto/ui/(.*)$': '<rootDir>../../packages/ui/$1',
    '^@verto/ui': '<rootDir>../../packages/ui',
    '^@verto/swap-sdk-core': '<rootDir>../../packages/swap-sdk-core/src',
    '^@verto/sdk': '<rootDir>../../packages/swap-sdk/src',
    '^@verto/localization': ['<rootDir>../../packages/localization/src'],
    '^@verto/hooks': ['<rootDir>../../packages/hooks/src'],
    '^@verto/wagmi/connectors/blocto': ['<rootDir>../../packages/wagmi/connectors/blocto'],
    '^@verto/wagmi/connectors/miniProgram': ['<rootDir>../../packages/wagmi/connectors/miniProgram'],
    '^@verto/wagmi/connectors/binanceWallet': ['<rootDir>../../packages/wagmi/connectors/binanceWallet'],
    '^@verto/wagmi': ['<rootDir>../../packages/wagmi/src'],
  },
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
const jestConfig = createJestConfig(customJestConfig)

module.exports = jestConfig().then(config => {
  // Remove default css mock
  // eslint-disable-next-line no-param-reassign
  delete config.moduleNameMapper['^.+\\.(css|sass|scss)$']
  return config
})
