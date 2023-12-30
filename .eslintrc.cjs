module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  globals: {
    __dirname: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/current'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        map: [
          ['@assets', './src/v3/assets'],
          ['@components', './src/v3/components/index.ts'],
          ['@icons', './src/v3/components/icons/index.ts'],
          ['@constants', './src/v3/constants'],
          ['@features', './src/v3/features'],
          ['@hooks', './src/v3/hooks'],
          ['@layouts', './src/v3/layouts'],
          ['@pages', './src/v3/pages'],
          ['@routes', './src/v3/routes'],
          ['@services', './src/v3/services'],
          ['@states', './src/v3/states'],
          ['@utils', './src/v3/utils'],
          ['@wrapper', './src/v3/wrapper'],
          ['@locales', './src/shared/locales'],
          ['@shared', './src/shared'],
        ],
      },
    },
  },
  plugins: ['react', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },
};
