module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  globals: {
    __dirname: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/current'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      alias: {
        extensions: ['.js', '.jsx'],
        map: [
          ['@assets', './src/v3/assets'],
          ['@components', './src/v3/components/index.js'],
          ['@icons', './src/v3/components/icons/index.js'],
        ],
      },
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
