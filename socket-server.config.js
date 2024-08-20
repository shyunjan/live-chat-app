import http from 'http';
// import { Server } from 'socket.io';
import WebSocket, { WebSocketServer } from 'ws';

/**
 * @param {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} server
 */
// export function configureSocketIOServer(server) {
//   const io = new Server(server ?? undefined);
//   addSocketIOEventListener(io);
// }

/**
 * @param {{ on: (arg0: string, arg1: (socket: any) => void) => void; emit: (arg0: string, arg1: { from: string; message: any; time: string; }) => void; }} socket
 */
// export function addSocketIOEventListener(socket) {
//   /* 소켓서버에 익명의 클라이언트가 처음 접속했을 때 발생하는 'connection' 이벤트 */
//   socket.on('connection', (socket) => {
//     const username = `User ${Math.round(Math.random() * 999999)}`; // 새로운 유저명을 생성해서 클라이언트에 발송
//     socket.emit('name', username);

//     /* 이 클라이언트 소켓(socket)으로부터 어떤 메시지를 전송받는 이벤트('message')가 발생되면, 이 서버에 연결된 모든 소켓에 해당 메시지를 일괄 발송 */
//     socket.on('message', (/** @type {any} */ message) => {
//       socket.emit('message', {
//         from: username,
//         message: message,
//         time: new Date().toLocaleString()
//       });
//     });

//     socket.on('disconnect', () => {
//       console.debug('user disconnected');
//       socket = null;
//     });
//   });

//   console.info('SocketIO Server injected');
// }

/**
 * @param {number} port
 */
export function configureWebSocketServer(port) {
  /* WebSocket은 ws:// 프로토콜을 사용하기 때문에 웹서버 포트와 다른 포트번호를 사용해야 함 */
  const wss = new WebSocketServer({ port });
  addWebSocketEventListener(wss);
}

/**
 * @param {WebSocketServer} wss
 */
export function addWebSocketEventListener(wss) {
  /* 소켓서버에 익명의 클라이언트가 처음 접속했을 때 발생하는 'connection' 이벤트 */
  wss.on('connection', (ws) => {
    const username = `User ${Math.round(Math.random() * 999999)}`; // 새로운 유저명을 생성해서 클라이언트에 발송
    // ws.emit('name', username);
    ws.send(JSON.stringify({ event: 'name', payload: username }));

    /* 이 클라이언트 소켓(ws)으로부터 어떤 메시지를 전송받는 이벤트('message')가 발생되면, 이 서버에 연결된 모든 소켓에 해당 메시지를 일괄 발송 */
    ws.on('message', (data, isBinary) => {
      /* WebSocket에서는 string을 data로 받으면 isBinary가 false가 되고 {"type":"Buffer","data":number[]} 형태로 data가 들어온다 */
      const message = isBinary ? data : data.toString();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
          client.send(
            JSON.stringify({
              event: 'message',
              payload: { from: username, message, time: new Date().toLocaleString() }
            })
          );
      });
    });

    ws.on('disconnect', () => {
      console.debug('user disconnected');
      ws.terminate();
    });
  });

  console.info('WebSocket Server injected');
}
