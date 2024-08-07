import { handler } from '../build/handler.js';
import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
// import http, { IncomingMessage, ServerResponse } from 'http';
import http from 'http';
import { configureSocketServer, addEventListener } from '../socket-server.config.js';

const app = Fastify({ logger: true });
console.debug(`process.env.PORT = ${process.env.PORT}`);
const port = process.env.PORT || 5282;

app.register(fastifySocketIO);

//necessary!!!
app.removeAllContentTypeParsers();
app.addContentTypeParser('*', (req, payload, done) => done(null, null));
// await app.register(handler);
app.get('/*', (req, res) => handler(req.raw, res.raw, () => {}));

app.ready((err) => {
  if (err) throw err;

  // const server = http.createServer(app.server);
  // configureSocketServer(server);
  // server.listen(port, 'localhost');

  app.io.on('connection', (socket) => {
    let username = `User ${Math.round(Math.random() * 999999)}`; // 새로운 유저명을 생성해서 클라이언트에 발송
    socket.emit('name', username);
    console.debug(`username = ${username}`);

    /* 이 클라이언트 소켓(socket)으로부터 어떤 메시지를 전송받는 이벤트('message')가 발생되면, 이 서버에 연결된 모든 소켓에 해당 메시지를 일괄 발송 */
    socket.on('message', (message) => {
      app.io.emit('message', {
        from: username,
        message: message,
        time: new Date().toLocaleString()
      });
    });
  });
});

app.listen({ port, host: 'localhost' }, () => {
  console.log(`Running on http://localhost:${port}`);
});
