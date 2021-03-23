/* eslint-disable max-len */
const path = require('path');

module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  rootDir: '.',
  moduleDirectories: [path.join('<rootDir>', 'node_modules'), path.join('<rootDir>', 'src')],
  modulePaths: ['<rootDir>/src/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-community|react-native-config|react-native-secure-key-store)/)',
  ],
  testPathIgnorePatterns: [],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
  globals: {
    __DEV__: true,
  },
};
