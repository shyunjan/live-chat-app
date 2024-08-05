<script lang="ts">
  import { io } from '$lib/realtime';
  import { onMount } from 'svelte';

  let username = 'username',
    textfield = '',
    messages: { message: string; from: string; time: number }[] = [];

  onMount(() => {
    io.on('message', (message) => {
      messages = [...messages, message];
    });
    io.on('name', (name) => {
      username = name;
    });
  });

  function sendMessage() {
    const message = textfield.trim();
    if (!message) return;

    textfield = '';
    io.emit('message', message);
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
