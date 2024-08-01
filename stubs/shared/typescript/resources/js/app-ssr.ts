import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/svelte';
import type { ComponentType } from 'svelte';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });

        return pages[`./Pages/${name}.svelte`];
    },

    setup({ el, App }: { el: Element; App: ComponentType }) {
        new App({ target: el, hydrate: true });
    },

    progress: {
        color: '#4B5563',
    },
});
