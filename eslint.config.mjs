import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import-x';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    plugins: {
      import: pluginImport,
      promise: pluginPromise,
      unicorn: pluginUnicorn,
    },
    rules: {
      /* Import Rules */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': [
        'warn',
        {
          alphabetical: false,
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
        },
      ],
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
  eslintConfigPrettier
);
