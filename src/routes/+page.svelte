<script lang="ts">
  import { searchHistory, searchText } from '$lib/stores/search'
  import { replaceState } from '$app/navigation'
  import { History, Search, TestTube } from '@lucide/svelte'
  import Input from '$lib/components/ui/input/input.svelte'
  import Button from '$lib/components/ui/button/button.svelte'

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      const input = document.querySelector(
        '#search-input-home',
      ) as HTMLInputElement
      if (input) {
        input.focus()
      }
    }
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<nav class="w-full h-24 border-b px-8 py-4 flex justify-between items-center">
  <div class="w-10">
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
  </div>
  <p class="flex gap-4 items-center text-sm md:text-base">
    <a href="/info"> Informations </a>
    <a href="/settings"> Settings </a>
  </p>
</nav>

<main class="w-full h-full flex-1 flex justify-center items-center max-w-xl">
  <h1 class="mb-1">Search NixOS</h1>
  <p class="text-center mb-2 text-sm">
    A simple search engine for <strong>NixOS</strong>, <strong>Nixpkgs</strong>,
    <strong>Home Manager</strong>, <strong>NUR</strong> (Nix User Repository)
    and <strong>Nix-Darwin</strong>. Find options, packages, modules, and more
    effortlessly.
  </p>
  <form
    onsubmit={() => {
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('q', $searchText)
      replaceState('/search?' + urlParams.toString(), '')
    }}
    class="w-full relative flex justify-center flex-col gap-5"
  >
    <div class="flex gap-5">
      <div class="flex justify-center items-center absolute h-10 w-10">
        <Search size={16} class="text-muted-foreground" />
      </div>
      <Input
        id="search-input-home"
        bind:value={$searchText}
        class="w-full pl-10"
        placeholder="Search ..."
        autofocus
      />
      <div class="m-auto">
        <Button type="submit">Search</Button>
      </div>
    </div>
    <div class="w-full border rounded overflow-y-auto max-h-52">
      {#if $searchHistory.length == 0}
        <Button
          class="w-full justify-start items-center"
          variant="ghost"
          onclick={() => {
            searchText.set('kitty themes')
          }}
        >
          <TestTube class="text-muted-foreground" />
          kitty themes
        </Button>
        <Button
          class="w-full justify-start items-center"
          variant="ghost"
          onclick={() => {
            searchText.set('^programs.kitty')
          }}
        >
          <TestTube class="text-muted-foreground" />
          ^programs.kitty
        </Button>
        <Button
          class="w-full justify-start items-center"
          variant="ghost"
          onclick={() => {
            searchText.set('option tailscale')
          }}
        >
          <TestTube class="text-muted-foreground" />
          option tailscale
        </Button>
        <Button
          class="w-full justify-start items-center"
          variant="ghost"
          onclick={() => {
            searchText.set('package ?broken ?maintainer=sigmanificient')
          }}
        >
          <TestTube class="text-muted-foreground" />
          package ?broken ?maintainer=sigmanificient
        </Button>
      {:else}
        {#each $searchHistory as item}
          <Button
            class="w-full justify-start items-center"
            variant="ghost"
            onclick={() => {
              searchText.set(item)
            }}
          >
            <History class="text-muted-foreground" />
            {item}
          </Button>
        {/each}
      {/if}
    </div>
  </form>
</main>
