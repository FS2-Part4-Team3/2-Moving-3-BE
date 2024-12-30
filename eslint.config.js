import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: pluginPrettier,
      import: pluginImport,
    },
    rules: {
      'no-restricted-globals': 'off',
      'no-unused-vars': 'off',
      'consistent-return': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['.*'],
              message: "상대 경로 import는 허용되지 않습니다. '#/'로 시작하는 alias를 사용해주세요.",
            },
          ],
        },
      ],

      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',
      'import/no-duplicates': ['warn', { 'prefer-inline': true, considerQueryString: true }],
    },
  },
];
