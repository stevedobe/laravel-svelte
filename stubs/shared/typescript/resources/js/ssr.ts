import { createInertiaApp } from '@inertiajs/svelte';
import createServer from '@inertiajs/svelte/server';
import type { Page } from '@inertiajs/core';

createServer((page: Page) =>
    createInertiaApp({
        page,

        resolve: (name: string) => {
            const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });

            return pages[`./Pages/${name}.svelte`];
        },

        progress: {
            color: '#4B5563',
        },
    }),
);
