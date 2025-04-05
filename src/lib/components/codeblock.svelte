<script lang="ts">
  import { toast } from "svelte-sonner";
  import Button from "./ui/button/button.svelte";
  import { Clipboard } from "@lucide/svelte";

  let { text, showCopy = true } = $props();
</script>

<div class="relative w-full rounded bg-muted items-center flex">
  {#if showCopy}
    <Button
      variant="ghost"
      class="absolute top-0 right-0 w-8 h-8 z-10"
      size="icon"
      onclick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      }}
    >
      <Clipboard size={16} />
    </Button>
  {/if}
  <code class="w-full whitespace-pre-wrap px-4">
    {text}
  </code>
</div>
