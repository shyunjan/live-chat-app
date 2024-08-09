import Fastify from 'fastify';
import { handler } from '../build/handler.js';
import { addSocketIOEventListener } from '../socket-server.config.js';

const app = Fastify({ logger: true });
console.debug(`process.env.HOST = ${process.env.HOST}`);
console.debug(`process.env.PORT = ${process.env.PORT}`);
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5282;

/**
 * 1. fastify-socket.io를 사용하는 경우. 현재 사용하지 않음. 사유는 아래 2번 참조.
 * 다른 프로젝트에서 사용할 수도 있으므로 남겨둠.
 **/
app.register((await import('fastify-socket.io')).default);

/**
 * 출처: https://stackoverflow.com/questions/72317071/how-to-set-up-fastify-correctly-so-that-sveltekit-works-fine
 * 아래 두 라인 코드가 necessary!!! 하다고 나와 있으나 테스트 결과 필요없다.
 **/
// app.removeAllContentTypeParsers();
// app.addContentTypeParser('*', (req, payload, done) => done(null, null));
app.all('/*', (req, reply) => {
  // reply.header('Access-Control-Allow-Origin', '*');
  // reply.header('Access-Control-Allow-Headers', '*');
  // reply.header("Access-Control-Allow-Methods", "GET");
  return handler(req.raw, reply.raw, () => {});
});

app.ready((err) => {
  if (err) throw err;
  addSocketIOEventListener(app.io);
});

/**
 * 2. @fastify/websocket을 사용하는 경우
 * 사유: https://stackoverflow.com/questions/77049816/fastify-socket-io-server-client-doesnt-connect
 **/
// app.register(require('@fastify/websocket')).after(() => {
//   app.all('/*', {
//     handler: async (req, reply) => handler(req.raw, reply.raw, () => {}),
//     wsHandler: (socket /* WebSocket */, req /* FastifyRequest */) => {
//       addEventListener(socket);
//     }
//   });
// });

app.listen({ port, host }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Running on http://localhost:${port}`);
});
