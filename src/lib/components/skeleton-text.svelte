<script lang="ts">
  let { children } = $props()
</script>

<span
  class="bg-muted inline-block animate-pulse rounded"
  style="color: #00000000;"
>
  {@render children({})}
</span>
