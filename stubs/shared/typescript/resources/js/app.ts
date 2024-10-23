import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/svelte';
import type { ComponentType } from 'svelte';
import type { PageProps } from '@inertiajs/core';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });

        return pages[`./Pages/${name}.svelte`];
    },

    setup({ el, App, props }: { el: Element; App: ComponentType; props: PageProps }) {
        new App({ target: el, props });
    },

    progress: {
        color: '#4B5563',
    },
});
