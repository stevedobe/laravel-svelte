import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    {
        files: ['resources/js/**/*.{js,ts,svelte}'],
    },

    {
        ignores: [
            'eslint.config.js',
            'bootstrap/',
            'node_modules/',
            'public/',
            'storage/',
            'vendor/',
            'composer.lock',
            'package-lock.json',
        ],
    },

    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.svelte'],
            },
        },
    },

    js.configs.recommended,
    ...ts.configs.strict,
    ...ts.configs.stylistic,
    ...svelte.configs['flat/recommended'],
    prettier,
];
