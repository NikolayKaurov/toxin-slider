module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:fsd/all',
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
      rules: {
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
          },
        ],
      },
    },
  ],
  parserOptions: {
  },
  rules: {
  },
};
