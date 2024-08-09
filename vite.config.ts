import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import { configureSocketIOServer } from './socket-server.config';
import type http from 'http';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
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
          configureSocketIOServer(server.httpServer as http.Server);
        }
      }
    ],
    define: { 'process.env': env }
  };
});
