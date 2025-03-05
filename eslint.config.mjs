import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      react: reactPlugin
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-sort-props': 'warn',
      'react/jsx-curly-spacing': ['warn', { when: 'never' }],
      'react/jsx-equals-spacing': ['warn', 'never'],
      'react/jsx-tag-spacing': ['warn', { beforeSelfClosing: 'always' }],
      'react/jsx-wrap-multilines': 'warn',
      'react/jsx-indent': ['warn', 2],
      'react/jsx-indent-props': ['warn', 2],
      'react/jsx-closing-bracket-location': 'warn',
      'react/jsx-closing-tag-location': 'warn',
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
      'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    },
    files: ['app/**/*.{js,jsx,ts,tsx}', 'components/**/*.{js,jsx,ts,tsx}', 'lib/**/*.{js,jsx,ts,tsx}', 'mockData/**/*.{js,jsx,ts,tsx}', 'models/**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**'],
  },
];

export default eslintConfig;
