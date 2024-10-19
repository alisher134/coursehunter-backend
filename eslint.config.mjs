import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintImport from 'eslint-plugin-import';
import eslintPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', 'node_modules'] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			ecmaVersion: 2021,
			parser: tsParser,
			globals: globals.node
		},
		plugins: {
			import: eslintImport,
			prettier: eslintPrettier
		},
		rules: {
			'no-console': 'warn',
			'no-debugger': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-function-return-type': 'warn',
			'import/prefer-default-export': 'off',
			'prettier/prettier': [
				'error',
				{
					printWidth: 80,
					tabWidth: 2,
					useTabs: true,
					semi: true,
					singleQuote: true,
					trailingComma: 'none',
					arrowParens: 'avoid'
				}
			]
		}
	}
);
