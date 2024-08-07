import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      out: 'build',
      target: '#svelte',
      precompress: true
      // envPrefix: ''
    })
  },

  vitePlugin: {
    // This enables compile-time warnings to be visible in the learn.svelte.dev editor
    onwarn: (warning, defaultHandler) => {
      const warningCode = warning.code.toLowerCase();
      if (warningCode === 'a11y-no-noninteractive-tabindex' || 'a11y-missing-attribute') return;
      console.log('svelte:warnings:%s', JSON.stringify(warning));
      defaultHandler(warning);
    }
  }
};

export default config;
