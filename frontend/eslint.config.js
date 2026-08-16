import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Mark components referenced only in JSX (e.g. polymorphic `as`/`icon`
      // props) as "used" so no-unused-vars doesn't false-positive on them.
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // The following are React-Compiler-preview rules shipped in
      // eslint-plugin-react-hooks v7's "recommended" config. This project does
      // not use the React Compiler, and the rules flag idiomatic patterns we
      // rely on deliberately:
      //   - set-state-in-effect : setting a loading flag at the start of a
      //     data-fetching effect (we have no data-fetching library).
      //   - only-export-components : context files co-export a Provider and its
      //     useXxx() hook — a standard, well-understood pattern.
      //   - purity / immutability : SVG chart helpers compute presentational
      //     values (gradient ids, paths) during render.
      // Kept at "warn" so the signal stays visible without failing the build.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
])
