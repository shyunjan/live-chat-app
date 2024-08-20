<script lang="ts">
  import { SOCKET_SERVER_ENDPOINT } from '$lib';
  import { onMount } from 'svelte';

  const socket = new WebSocket(`ws://${SOCKET_SERVER_ENDPOINT}`); // Websocket을 사용하는 경우

  let username = 'username',
    textfield = '',
    messages: { message: string; from: string; time: number }[] = [];

  onMount(() => {
    /**
     * 1. Socket.io를 사용하는 경우. 현재 사용하지 않음. 다른 프로젝트에서 사용할 수도 있으므로 남겨둠.
     **/
    // socket.on('name', (name) => {
    //   username = name;
    // });
    // socket.on('message', (message) => {
    //   messages = [...messages, message];
    // });
    /**
     * 2. WebSocket을 사용하는 경우
     **/
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const eventType = data.event;
      const payload = data.payload;

      if (eventType === 'name') {
        username = payload;
      } else if (eventType === 'message') {
        messages = [...messages, payload];
      }
    };
  });

  function sendMessage() {
    const message = textfield.trim();
    if (!message) return;

    textfield = '';
    // socket.emit('message', message); // Socket.IO를 사용하는 경우
    socket.send(message); // WebSocket을 사용하는 경우
  }
</script>

<div class="h-screen w-screen bg-zinc-800">
  <div class="mx-auto flex h-full w-full max-w-md flex-col bg-zinc-500">
    <header
      class="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-700 px-6 py-4 text-white"
    >
      <span class="text-xl font-bold">My Chat app</span>
      <span>{username}</span>
    </header>

    <div class="h-full w-full p-4">
      {#each messages as message}
        <div class="my-4 w-fit rounded-xl rounded-tl-none bg-zinc-300 px-4 py-3">
          <span class="space-between flex items-center gap-4">
            <!-- Is "space-between" a tailwindCSS class? -->
            <b>{message.from}</b>
            <i>{message.time}</i>
          </span>
          {message.message}
        </div>
      {/each}
    </div>

    <form
      action="#"
      on:submit|preventDefault={sendMessage}
      class="flex shrink-0 items-center border-t border-zinc-800 bg-zinc-700 px-6 py-4 text-white"
    >
      <input
        type="text"
        bind:value={textfield}
        placeholder="Type something..."
        class="w-full border-none bg-transparent px-4 py-3"
      />
      <button type="submit" class="shrink-0 rounded-lg border border-white px-4 py-3">Send</button>
    </form>
  </div>
</div>
