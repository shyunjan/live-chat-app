import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import { configureWebSocketServer } from './socket-server.config';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: Number(env.PORT)
    },
    preview: {
      port: Number(env.PORT)
    },
    plugins: [
      sveltekit(),
      {
        name: 'socket-io-server',
        configureServer(server: ViteDevServer) {
          // configureSocketIOServer(server.httpServer as http.Server);
          configureWebSocketServer(Number(env.SOCKET_PORT));
        }
      }
    ],
    define: { 'process.env': env }
  };
});
