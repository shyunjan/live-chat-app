import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
// import { configureSocketIOServer } from './socket-server.config';
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
        name: 'socket-server',
        /**
         * 1. Socket.IO를 사용하는 경우. 현재 사용하지 않음. 사유는 아래 2번 참조.
         * 다른 프로젝트에서 사용할 수도 있으므로 남겨둠.
         **/
        // configureServer(server: ViteDevServer) {
        //   configureSocketIOServer(server.httpServer as http.Server);
        // }
        /**
         * 2. WebSocket을 사용하는 경우
         * 사유: https://stackoverflow.com/questions/77049816/fastify-socket-io-server-client-doesnt-connect
         **/
        configureServer() {
          configureWebSocketServer(Number(env.SOCKET_PORT));
        }
      }
    ],
    define: { 'process.env': env }
  };
});
