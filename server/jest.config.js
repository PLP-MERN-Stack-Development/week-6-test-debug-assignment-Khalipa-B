module.exports = {
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  roots: ['<rootDir>/'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(test).js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  verbose: true,
};


