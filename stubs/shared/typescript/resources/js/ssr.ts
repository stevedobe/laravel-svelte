/* eslint-disable @typescript-eslint/no-explicit-any */
import { createInertiaApp } from '@inertiajs/svelte';
import createServer from '@inertiajs/svelte/server';
import { render } from 'svelte/server';

createServer((page: any) =>
    createInertiaApp({
        page,

        resolve: (name: string) => {
            const pages = import.meta.glob('./Pages/**/*.svelte', {
                eager: true,
            });

            return pages[`./Pages/${name}.svelte`];
        },

        setup({ App, props }: { App: any; props: any }) {
            return render(App, { props });
        },

        progress: {
            color: '#4B5563',
        },
    }),
);
