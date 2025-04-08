<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button/index.js'
  import { resetMode, setMode, mode } from 'mode-watcher'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
  import Sun from '@lucide/svelte/icons/sun'
  import Moon from '@lucide/svelte/icons/moon'
  import { searchText, expertMode, searchHistory, isSearchHistoryActive } from '$lib/stores/search'
  import Switch from '$lib/components/ui/switch/switch.svelte'
  import Navigation from '$lib/components/navigation.svelte'
  import { replaceState } from '$app/navigation'
  import Button from '$lib/components/ui/button/button.svelte'
</script>

<Navigation
  onSend={() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('q', $searchText)
    replaceState('/search?' + urlParams.toString(), '')
  }}
/>
<main class="gap-0">
  <h1 class="mb-0">Search NixOS - Settings</h1>
  <div class="flex flex-col gap-5 my-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium leading-none">Theme</p>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class={buttonVariants({ variant: 'outline', class: 'w-min' })}
        >
          <Sun class="h-[1.2rem] w-[1.2rem] block dark:hidden" />
          <Moon class="h-[1.2rem] w-[1.2rem] hidden dark:block" />
          {$mode}
          <span class="sr-only">Toggle theme</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onclick={() => setMode('light')}
            >Light</DropdownMenu.Item
          >
          <DropdownMenu.Item onclick={() => setMode('dark')}
            >Dark</DropdownMenu.Item
          >
          <DropdownMenu.Item onclick={() => resetMode()}
            >System</DropdownMenu.Item
          >
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>

    <div
      class="rounded border px-4 py-2 my-4 flex flex-wrap justify-between gap-5 items-center"
    >
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium leading-none">History</p>
        <p class="text-muted-foreground text-sm">
          History of your searches are stored in the local storage of your
          browser. You can clear the history by clicking the button below or
          disable it by unchecking the switch.
        </p>

        <Button
          class="w-min"
          variant="link"
          onclick={() => {
            searchHistory.set([])
          }}>Reset history</Button
        >
      </div>
      <Switch id="disable-history" bind:checked={$isSearchHistoryActive} />
    </div>

    <div
      class="rounded border px-4 py-2 my-4 flex flex-wrap justify-between gap-5 items-center"
    >
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium leading-none">Expert Mode</p>
        <p class="text-muted-foreground text-sm">
          Enable expert mode to show advanced options and settings. This is
          recommended for advanced users only.
        </p>
      </div>
      <Switch id="expert-mode" bind:checked={$expertMode} />
    </div>
  </div>
</main>
