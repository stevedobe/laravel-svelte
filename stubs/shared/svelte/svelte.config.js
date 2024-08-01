import { sveltePreprocess } from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    }),
};
