import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...ts.configs.strict,
    ...ts.configs.stylistic,
    ...svelte.configs['flat/recommended'],
    prettier,

    {
        files: ['resources/js/**/*.{ts,svelte}'],

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
                parser: ts.parser,
                extraFileExtensions: ['.svelte'],
            },
        },
    },

    {
        ignores: [
            'bootstrap/cache/',
            'bootstrap/ssr/',
            'public/',
            'storage/',
            'vendor/',
            'composer.lock',
            'package-lock.json',
        ],
    },
];
