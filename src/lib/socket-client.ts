/**
 * Vite를 사용할 경우에 클라이언트 측에서는 import.meta.env로 환경변수를 읽어야 함. 그러나
 * vite.config.js 2,24번 라인에서 아래와 같이 process.env 를 별도로 정의:
 * ...
 * const env = loadEnv(mode, process.cwd(), '');
 * ...
 * define: { 'process.env': env }
 *
 **/
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5282;
const socketPort = process.env.SOCKET_PORT || 5283;
// const ENDPOINT = `localhost:${port}`;
const ENDPOINT = `${host}:${socketPort}`;
console.debug(`ENDPOINT = ${ENDPOINT}`);

/**
 * 1. socket.io를 사용하는 경우. 현재 사용하지 않음. 사유는 아래 2번 참조.
 * 다른 프로젝트에서 사용할 수도 있으므로 남겨둠.
 **/
// import { io } from 'socket.io-client';
// const socket = io(); // 프론트 페이지의 서버와 소켓서버가 동일할 경우는 소켓 클라이언트 ENDPOINT를 지정하지 않아도 된다.

/**
 * 2. WebSocket을 사용하는 경우
 * 사유: https://stackoverflow.com/questions/77049816/fastify-socket-io-server-client-doesnt-connect
 **/
// import WebSocket from 'ws';
const socket = new WebSocket(`ws://${ENDPOINT}`);

export default socket;
