import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/svelte';

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });

        return pages[`./Pages/${name}.svelte`];
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup({ el, App, props }: { el: Element; App: any; props: any }) {
        new App({ target: el, props, hydrate: true });
    },

    progress: {
        color: '#4B5563',
    },
});
