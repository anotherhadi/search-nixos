<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { onNavigate } from "$app/navigation";
  import { Github } from "@lucide/svelte";

  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Toaster />
<ModeWatcher />
<div class="flex flex-col min-h-screen">
  <div class="flex-1 flex flex-col">
    {@render children?.()}
  </div>
  <footer
    class="w-full h-24 border-t px-8 py-4 justify-center md:justify-between items-center flex md:flex-row flex-col"
  >
    <p class="flex gap-2 items-center">
      <Github size={16} class="mr-2" /> Open Source app, check the
      <a href="https://github.com/anotherhadi/search-nixos">code here</a>
    </p>
    <p class="flex gap-4 items-center text-center justify-center">
      <a href="https://github.com/anotherhadi/search-nixos-api" target="_blank">
        API
      </a>
      <a href="https://github.com/anotherhadi/search-nixos" target="_blank">
        Documentation
      </a>
      <a href="https://ko-fi.com/anotherhadi" target="_blank"> Donate </a>
    </p>
  </footer>
</div>
