import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { Server } from 'socket.io';

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: 'socket-io-server',
      configureServer(server: ViteDevServer) {
        const io = new Server(server.httpServer ?? undefined);
        console.info('SocketIO Server injected');
      }
    }
  ]
});
