import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import configureWebSocketServer from './web-socket.config';
import type http from 'http';

export default defineConfig({
  server: {
    port: 5172
  },
  preview: {
    port: 5172
  },
  plugins: [
    sveltekit(),
    {
      name: 'socket-io-server',
      configureServer(server: ViteDevServer) {
        configureWebSocketServer(server.httpServer as http.Server);
      }
    }
  ]
});
