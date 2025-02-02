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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setup({ App, props }: { App: any; props: any }) {
            return App.render(props);
        },

        progress: {
            color: '#4B5563',
        },
    }),
);
