import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { configureSocketServer } from './socket-server.config';
import type http from 'http';

export default defineConfig({
  server: {
    port: 5282
  },
  preview: {
    port: 5282
  },
  plugins: [
    sveltekit(),
    {
      name: 'socket-io-server',
      configureServer(server: ViteDevServer) {
        configureSocketServer(server.httpServer as http.Server);
      }
    }
  ]
});
