import io from 'socket.io-client';

let socket = io();
try {
  const port = process.env.PORT || 5282;
  console.debug(`port = ${port}`);
  const ENDPOINT = `http://localhost:${port}`;

  socket = io(ENDPOINT);
} catch (error) {
  console.error(error);
}

export default socket;
