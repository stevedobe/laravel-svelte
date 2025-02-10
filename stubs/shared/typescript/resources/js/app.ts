/* eslint-disable @typescript-eslint/no-explicit-any */
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/svelte';
import { mount } from 'svelte';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob('./Pages/**/*.svelte', {
            eager: true,
        });

        return pages[`./Pages/${name}.svelte`];
    },

    setup({ el, App, props }: { el: any; App: any; props: any }) {
        mount(App, { target: el, props });
    },

    progress: {
        color: '#4B5563',
    },
});
