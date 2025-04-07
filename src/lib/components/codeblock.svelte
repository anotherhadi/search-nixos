<script>
  import { toast } from 'svelte-sonner'
  import Button from './ui/button/button.svelte'
  import { Check, Clipboard } from '@lucide/svelte'
  import Highlight from 'svelte-highlight'
  import nix from 'svelte-highlight/languages/nix'
  import shell from 'svelte-highlight/languages/bash'
  import { base16Github, githubDark } from 'svelte-highlight/styles'
  import { mode } from 'mode-watcher'

  let { text, showCopy = true, isShell = false } = $props()
  let clicked = $state(false)
</script>

<svelte:head>
  {#if $mode === 'dark'}
    {@html githubDark}
  {:else}
    {@html base16Github}
  {/if}
</svelte:head>

<div class="relative w-full rounded bg-muted items-center flex overflow-auto">
  {#if showCopy}
    <Button
      variant="ghost"
      class="absolute top-0 right-0 w-8 h-8 z-10"
      size="icon"
      onclick={async () => {
        navigator.clipboard.writeText(text)
        clicked = true
        toast.success('Copied to clipboard')
        setTimeout(() => {
          clicked = false
        }, 2000)
      }}
    >
      {#if clicked}
        <Check size={16} />
      {:else}
        <Clipboard size={16} />
      {/if}
    </Button>
  {/if}
  <Highlight
    language={isShell ? shell : nix}
    code={text}
    class="overflow-x-scroll"
  />
</div>
