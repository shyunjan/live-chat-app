import ioClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:5172';

const socket = ioClient(ENDPOINT);

export const io = socket;
