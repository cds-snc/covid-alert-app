module.exports = {
  extends: [
    '@react-native-community',
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'plugin:@shopify/jest',
    'plugin:@shopify/prettier',
  ],
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    'no-warning-comments': 'off',
    'no-process-env': 'off',
    'import/no-cycle': 'off',
    'react/jsx-no-bind': 'off',
    '@shopify/jest/no-vague-titles': 'off',
    '@shopify/jsx-no-complex-expressions': 'off',
    'import/no-named-as-default': 'off',
    '@shopify/images-no-direct-imports': 'off',
    '@shopify/jest/no-snapshots': 'off',
    'no-console': 'error',
    camelcase: 'off',
    'no-extend-native': 'off',
    'max-params': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'max-len': [
      'error',
      {
        code: 200,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/no-autofocus': 'off',
    'jest/no-try-expect': 'off',
  },
  ignorePatterns: [
    '**/node_modules',
    '**/services/BackendService/covidshield/*.d.ts',
    '**/services/BackendService/covidshield/*.js',
    '**/translations/index.js',
  ],
};
