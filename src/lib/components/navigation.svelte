<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import Search from "@lucide/svelte/icons/search";
  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import Button from "$lib/components/ui/button/button.svelte";
  import { searchText } from "$lib/stores/search";
  import NavigationExcludeFilter from "$lib/components/navigationExcludeFilter.svelte";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  let { onSend = $bindable() } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const input = document.querySelector("#search-input") as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<nav
  class="sticky top-0
    px-8 py-2 bg-background/70 border-b backdrop-blur-lg z-10 h-24"
>
  <div
    class="w-full mx-auto max-w-7xl flex items-center flex-col justify-around h-full"
  >
    <div class="w-full flex items-center gap-4">
      <Button href="/" variant="link" size="icon" class="p-0 [&_svg]:size-8">
        <svg
          class="fill-current text-foreground"
          viewBox="0 0 282 282"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M94.9299 116.376L149.16 209.781L124.238 210.014L109.76 184.919L95.1783 209.88L82.7954 209.875L76.4531 198.98L97.2274 163.462L82.4803 137.946L94.9299 116.376Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M114.504 77.9009L60.2639 171.301L47.6002 149.957L62.2182 124.943L33.1871 124.867L27 114.201L33.318 103.293L74.6407 103.422L89.4918 77.9655L114.504 77.9009Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M118.666 152.564L227.136 152.569L214.878 174.146L185.781 174.065L255.001 253.872L248.805 264.532L236.145 264.546L160.826 174.129L131.228 174.069L118.666 152.564Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M181.799 111.638L127.568 18.2325L152.491 18L166.969 43.0946L181.55 18.1341L193.933 18.1389L200.276 29.0337L179.501 64.5515L194.248 90.0681L181.799 111.638Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M94.9299 116.376L149.16 209.781L124.238 210.014L109.76 184.919L95.1783 209.88L82.7954 209.875L76.4531 198.98L97.2274 163.462L82.4803 137.946L94.9299 116.376Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M157.919 75.214L49.4492 75.2087L61.7079 53.6321L90.8041 53.7122L76.3546 28.6759L82.5504 18.0155L95.2107 18.0016L115.759 53.6491L145.357 53.7088L157.919 75.214Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M162.15 150.093L216.39 56.6926L229.054 78.0367L214.436 103.051L243.467 103.127L249.654 113.792L243.336 124.701L202.013 124.571L187.162 150.028L162.15 150.093Z"
          />
        </svg>
      </Button>
      <div class="flex gap-5 justify-center items-center w-full">
        <div class="flex gap-2 w-full">
          <form onsubmit={onSend} class="w-full relative">
            <div class="flex justify-center items-center absolute h-10 w-10">
              <Search size={16} class="text-muted-foreground" />
            </div>
            <Input
              id="search-input"
              bind:value={$searchText}
              class="w-full pl-10"
              placeholder="Search ..."
              autofocus
            />

            <div
              class="absolute right-0 top-0 w-10 h-10 flex justify-center items-center"
            >
              <HoverCard.Root>
                <HoverCard.Trigger>?</HoverCard.Trigger>
                <HoverCard.Content class="w-64 md:w-96">
                  <p class="font-bold">Example Queries</p>
                  <p>
                    <code>kitty</code> - Search for kitty<br />
                    <code>package kitty</code> - Search for the package kitty<br
                    />
                    <code>option services.xserver</code> - Search for the
                    xserver option<br />
                    <code>^tailscale</code> - Search for everything starting
                    with tailscale<br />
                    <code>option enable$</code> - Search for every option ending
                    with enable<br />
                    <code>kitty themes</code> - Search for everything containing
                    kitty and themes<br />
                  </p>
                </HoverCard.Content>
              </HoverCard.Root>
            </div>
          </form>
        </div>
      </div>

      <Button onclick={toggleMode} variant="link" size="icon">
        <Sun
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>

    <div class="w-full flex justify-start pl-12 gap-5 items-center">
      <NavigationExcludeFilter {onSend} />
    </div>
  </div>
</nav>
