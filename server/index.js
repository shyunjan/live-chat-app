import { handler } from '../build/handler.js';
import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import { addEventListener } from '../socket-server.config.js';

const app = Fastify({ logger: true });
console.debug(`process.env.PORT = ${process.env.PORT}`);
const port = process.env.PORT || 5282;
const host = process.env.HOST || 'localhost';

app.register(fastifyIO);

/**
 * 출처: https://stackoverflow.com/questions/72317071/how-to-set-up-fastify-correctly-so-that-sveltekit-works-fine
 * 아래 두 라인 코드가 necessary!!! 하다고 나와 있으나 테스트 결과 필요없다.
 **/
// app.removeAllContentTypeParsers();
// app.addContentTypeParser('*', (req, payload, done) => done(null, null));
app.all('/*', (req, res) => handler(req.raw, res.raw, () => {}));

app.ready((err) => {
  if (err) throw err;
  addEventListener(app.io);
});

app.listen({ port, host }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Running on http://localhost:${port}`);
});
