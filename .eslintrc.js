module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['@maxxxxxdlp/eslint-config'],
  rules: {
    '@typescript-eslint/prefer-readonly-parameter-types': [
      'error',
      {
        ignoreInferredTypes: true,
      },
    ],
    'react/prop-types': 'off',
  },
};
