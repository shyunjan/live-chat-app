import { Server } from 'socket.io';
import type { HttpServer } from 'vite';

export default function configureWebSocketServer(server: HttpServer | null) {
  const io = new Server(server ?? undefined);

  /* 소켓서버에 익명의 클라이언트가 처음 접속했을 때 발생하는 'connection' 이벤트 */
  io.on('connection', (socket) => {
    let username = `User ${Math.round(Math.random() * 999999)}`; // 새로운 유저명을 생성해서 클라이언트에 발송
    socket.emit('name', username);

    /* 이 클라이언트 소켓(socket)으로부터 어떤 메시지를 전송받는 이벤트('message')가 발생되면, 이 서버에 연결된 모든 소켓에 해당 메시지를 일괄 발송 */
    socket.on('message', (message) => {
      io.emit('message', {
        from: username,
        message: message,
        time: new Date().toLocaleString()
      });
    });
  });

  // io.on('shutdown', () => {
  //   console.info('App is in shutdown...');
  // });

  console.info('SocketIO Server injected');
}
