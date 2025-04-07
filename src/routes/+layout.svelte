<script lang="ts">
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  import { Toaster } from '$lib/components/ui/sonner/index.js'
  import { onNavigate } from '$app/navigation'
  import { Github } from '@lucide/svelte'

  let { children } = $props()

  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<svelte:head>
  <title>Search NixOS - Find Options &amp; Packages</title>
  <meta
    name="description"
    content="A simple search engine for NixOS, Nixpkgs, Home Manager, NUR (Nix User Repository) and Nix-Darwin. Find options, packages, modules, and more effortlessly."
  />

  <meta
    property="og:image"
    content="https://search-nixos.hadi.diy/og-banner.png"
  />
  <meta property="og:url" content="https://search-nixos.hadi.diy" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Search NixOS - Find Options & Packages" />
  <meta
    name="twitter:description"
    content="Find options, packages, modules, and more effortlessly."
  />
  <meta
    name="twitter:image"
    content="https://search-nixos.hadi.diy/og-banner.png"
  />
</svelte:head>

<Toaster />
<ModeWatcher />
<div class="flex flex-col min-h-screen">
  <div class="flex-1 flex flex-col">
    {@render children?.()}
  </div>
  <footer
    class="w-full h-24 border-t px-8 py-4 justify-center md:justify-between items-center flex md:flex-row flex-col gap-2"
  >
    <p class="flex gap-1 items-center text-sm md:text-base">
      <Github size={16} class="mr-2" /> Open Source app, check the
      <a href="https://github.com/anotherhadi/search-nixos">code here</a>
    </p>
    <p
      class="flex gap-4 items-center text-center justify-center text-sm md:text-base"
    >
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
