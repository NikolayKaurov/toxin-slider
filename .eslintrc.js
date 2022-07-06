module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'fsd',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:fsd/all',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
  ],
  parserOptions: {
  },
  rules: {
  },
};
