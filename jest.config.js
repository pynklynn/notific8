module.exports = {
  clearMocks: true,
  coverageDirectory: './coverage',
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/*.spec.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  preset: 'ts-jest',
};