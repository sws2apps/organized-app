import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    settings: {
      react: { version: '18.2' },
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        alias: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          map: [
            ['@assets', './src/assets'],
            ['@components', './src/components'],
            ['@icons', './src/components/icons'],
            ['@constants', './src/constants'],
            ['@features', './src/features'],
            ['@hooks', './src/hooks'],
            ['@layouts', './src/layouts'],
            ['@pages', './src/pages'],
            ['@routes', './src/routes'],
            ['@services', './src/services'],
            ['@states', './src/states'],
            ['@utils', './src/utils'],
            ['@wrapper', './src/wrapper'],
            ['@locales', './src/locales'],
            ['@definition', './src/definition'],
            ['@global', './src/global'],
            ['@db', './src/indexedDb'],
            ['@views', './src/views'],
          ],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'import/no-cycle': ['error', { maxDepth: 9999 }],
    },
  },
];
