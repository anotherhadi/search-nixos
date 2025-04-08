<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button/index.js'
  import { resetMode, setMode, mode } from 'mode-watcher'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
  import Sun from '@lucide/svelte/icons/sun'
  import Moon from '@lucide/svelte/icons/moon'
  import {
    searchText,
    expertMode,
    searchHistory,
    isSearchHistoryActive,
  } from '$lib/stores/search'
  import Switch from '$lib/components/ui/switch/switch.svelte'
  import Navigation from '$lib/components/navigation.svelte'
  import { replaceState } from '$app/navigation'
  import Button from '$lib/components/ui/button/button.svelte'
  import { toast } from 'svelte-sonner'
  import { ChevronsUpDown, Expand } from '@lucide/svelte'
  import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
  import Label from '$lib/components/ui/label/label.svelte'
</script>

<Navigation
  onSend={() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('q', $searchText)
    replaceState('/search?' + urlParams.toString(), '')
  }}
/>
<main class="gap-0">
  <h1 class="font-bold text-muted-foreground">Settings</h1>

  <div>
    <h2>Theme</h2>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class={buttonVariants({ variant: 'outline', class: 'w-min' })}
      >
        <Sun class="h-[1.2rem] w-[1.2rem] block dark:hidden" />
        <Moon class="h-[1.2rem] w-[1.2rem] hidden dark:block" />
        {$mode}
        <ChevronsUpDown class="ml-4" />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onclick={() => setMode('light')}
          >Light</DropdownMenu.Item
        >
        <DropdownMenu.Item onclick={() => setMode('dark')}
          >Dark</DropdownMenu.Item
        >
        <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item
        >
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  <div>
    <h2>History</h2>
    <div class="flex gap-2 items-center">
      <Checkbox
        id="history"
        aria-labelledby="history-label"
        bind:checked={$isSearchHistoryActive}
      />
      <Label for="history" class="text-md">Enable search history</Label>
    </div>
    <p class="text-muted-foreground text-sm ml-7 mb-5">
      Enable search history to store your searches in the local storage of your
      browser. This is useful to quickly access your previous searches.
    </p>
    <Button
      class="w-min"
      variant="outline"
      size="sm"
      onclick={() => {
        searchHistory.set([])
        toast.success('History cleared')
      }}>Reset history</Button
    >
  </div>

  <div>
    <h2>Expert Mode</h2>
    <div class="flex gap-2 items-center">
      <Checkbox
        id="expert-mode"
        aria-labelledby="expert-mode-label"
        bind:checked={$expertMode}
      />
      <Label for="expert-mode" class="text-md">Enable expert mode</Label>
    </div>
    <p class="text-muted-foreground text-sm ml-7 mb-5">
      Enable expert mode to show advanced options and settings. This is
      recommended for advanced users only.
    </p>
  </div>
</main>
