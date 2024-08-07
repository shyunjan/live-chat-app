import http from 'http';
import { Server } from 'socket.io';

/**
 * @param {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} server
 */
export function configureSocketServer(server) {
  const io = new Server(server ?? undefined);

  addEventListener(io);
}

/**
 * @param {{ on: (arg0: string, arg1: (socket: any) => void) => void; emit: (arg0: string, arg1: { from: string; message: any; time: string; }) => void; }} io
 */
export function addEventListener(io) {
  /* 소켓서버에 익명의 클라이언트가 처음 접속했을 때 발생하는 'connection' 이벤트 */
  io.on('connection', (socket) => {
    let username = `User ${Math.round(Math.random() * 999999)}`; // 새로운 유저명을 생성해서 클라이언트에 발송
    socket.emit('name', username);

    /* 이 클라이언트 소켓(socket)으로부터 어떤 메시지를 전송받는 이벤트('message')가 발생되면, 이 서버에 연결된 모든 소켓에 해당 메시지를 일괄 발송 */
    socket.on('message', (/** @type {any} */ message) => {
      io.emit('message', {
        from: username,
        message: message,
        time: new Date().toLocaleString()
      });
    });

    socket.on('disconnect', () => {
      console.debug('user disconnected');
      socket = null;
    });
  });

  console.info('SocketIO Server injected');
}
