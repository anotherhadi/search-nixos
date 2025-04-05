<script lang="ts">
  import Filter from "./filter.svelte";
  import { excludeSource } from "$lib/stores/search";

  let { onSend } = $props();
  let selectedValues: string[] = $state([]);

  $effect(() => {
    excludeSource.set(selectedValues);
  });
</script>

<Filter
  title="Exclude source"
  bind:selectedValues
  {onSend}
  options={[
    { label: "Home Manager", value: "homemanager" },
    { label: "Nixpkgs", value: "nixpkgs" },
    { label: "Nixos", value: "nixos" },
  ]}
/>
