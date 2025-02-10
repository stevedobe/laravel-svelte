<?php

return [
    'compatibleWith' => [
        'laravel/breeze' => '2.3',
        'laravel/jetstream' => '5.3',
    ],
    'dependencies' => [
        // We install Svelte and Typescript packages regardless of the options chosen.
        'base' => [
            '@inertiajs/svelte' => '^2.0.3',
            '@sveltejs/vite-plugin-svelte' => '^5.0.3',
            '@tailwindcss/vite' => '^4.0.1',
            '@tsconfig/svelte' => '^5.0.4',
            'globals' => '^15.14.0',
            'svelte' => '^5.19.3',
            'svelte-check' => '^4.1.4',
            'svelte-preprocess' => '^6.0.3',
            'tailwindcss' => '^4.0.0',
            'typescript' => '^5.7.3',
        ],

        'eslint' => [
            '@eslint/js' => '^9.19.0',
            '@types/eslint__js' => '^8.42.3',
            'eslint' => '^9.19.0',
            'eslint-plugin-svelte' => '^2.46.1',
            'typescript-eslint' => '^8.21.0',

            'cypress' => [
                'eslint-plugin-cypress' => '^4.1.0',
            ],

            'prettier' => [
                '@types/eslint-config-prettier' => '^6.11.3',
                'eslint-config-prettier' => '^10.0.1',
            ],
        ],

        'prettier' => [
            'prettier' => '^3.4.2',
            'prettier-plugin-svelte' => '^3.3.3',
            'prettier-plugin-tailwindcss' => '^0.6.11',
        ],

        'cypress' => [
            '@faker-js/faker' => '^9.4.0',
            'cypress' => '^14.0.0',
        ],

        'playwright' => [
            '@faker-js/faker' => '^9.4.0',
            '@playwright/test' => '^1.50.0',
        ],

        'unwanted' => [
            '@inertiajs/vue3',
            '@rushstack/eslint-patch',
            '@vitejs/plugin-vue',
            '@vue/eslint-config-prettier',
            '@vue/eslint-config-typescript',
            '@vue/server-renderer',
            'autoprefixer',
            'eslint-plugin-vue',
            'postcss',
            'prettier-plugin-organize-imports',
            'vue',
            'vue-tsc',
        ],
    ],
];
