<script lang="ts">
  import { toast } from 'svelte-sonner'
  import Button from './ui/button/button.svelte'
  import { Check, ExternalLink } from '@lucide/svelte'

  let clicked = $state(false)
</script>

<Button
  variant="ghost"
  size="icon"
  onclick={async () => {
    clicked = true
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        toast.success('Copied to clipboard')
      },
      (err) => {
        toast.error('Error copying text: ' + err)
      },
    )
    setTimeout(() => {
      clicked = false
    }, 2000)
  }}
>
  {#if clicked}
    <Check />
  {:else}
    <ExternalLink />
  {/if}
</Button>
