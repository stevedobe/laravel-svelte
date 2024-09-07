<?php

return [
    'compatibleWith' => [
        'laravel/breeze' => '2.1',
        'laravel/jetstream' => '5.1',
    ],
    'dependencies' => [
        // We install Svelte and Typescript packages regardless of the options chosen.
        'base' => [
            '@inertiajs/svelte' => '^1.2.0',
            '@sveltejs/vite-plugin-svelte' => '^3.1.1',
            '@tsconfig/svelte' => '^5.0.4',
            'svelte' => '^4.2.18',
            'svelte-check' => '^3.8.4',
            'svelte-preprocess' => '^6.0.2',
            'typescript' => '^5.5.3',
        ],

        'eslint' => [
            '@eslint/js' => '^9.7.0',
            '@types/eslint__js' => '^8.42.3',
            'eslint' => '^8.57.0',
            'eslint-plugin-svelte' => '^2.43.0',
            'typescript-eslint' => '^7.16.1',

            'cypress' => [
                'eslint-plugin-cypress' => '^3.3.0',
            ],

            'prettier' => [
                '@types/eslint-config-prettier' => '^6.11.3',
                'eslint-config-prettier' => '^9.1.0',
            ],
        ],

        'prettier' => [
            'prettier' => '^3.3.3',
            'prettier-plugin-svelte' => '^3.2.6',
            'prettier-plugin-tailwindcss' => '^0.6.5',
        ],

        'cypress' => [
            '@faker-js/faker' => '^8.4.1',
            'cypress' => '^13.13.1',
        ],

        'playwright' => [
            '@faker-js/faker' => '^8.4.1',
            '@playwright/test' => '^1.46.1',
        ],

        'vue' => [
            '@inertiajs/vue3',
            '@vitejs/plugin-vue',
            '@vue/server-renderer',
            'vue',
        ],
    ],
];
