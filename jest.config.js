/* eslint-disable max-len */
const path = require('path');

module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  rootDir: '.',
  moduleDirectories: [path.join('<rootDir>', 'node_modules'), path.join('<rootDir>', 'src')],
  modulePaths: ['<rootDir>/src/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(jest-)?react-native|react-clone-referenced-element|react-native-reanimated|@react-native-community|@react-navigation|react-navigation.*|static-container|lodash-es|expo-.*)',
  ],
  testPathIgnorePatterns: [],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
  globals: {
    __DEV__: true,
  },
};
