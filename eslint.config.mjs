import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
      "curly": "off",
      "no-alert": "error",
      "no-console": "error",
      "no-var": "error",
      "no-duplicate-imports": "error",
      "max-lines": [
        "error",
        {
          "skipBlankLines": true,
          "skipComments": true,
          "max": 500
        }
      ]
    },
  },
  {
    ignores: ['node_modules/', 'lib/'],
  },
]);
