<script lang="ts">
  import Badge from './ui/badge/badge.svelte'

  let { name = '' } = $props()

  let color: string = $state('')

  $effect(() => {
    // depending on the name, set color
    if (name === 'nixpkgs') {
      color = '#f97316' // orange-500
    } else if (name === 'nixos') {
      color = '#eab308' // yellow-500
    } else if (name === 'darwin') {
      color = '#ec4899' // pink-500
    } else if (name === 'home-manager') {
      color = '#3b82f6' // blue-500
    } else if (name === 'nur') {
      color = '#22c55e' // green-500
    } else if (name === 'package') {
      color = '#f43f5e' // rose-500
    } else if (name === 'option') {
      color = '#a855f7' // purple-500
    }
  })
</script>

<Badge variant="outline" style="color: {color}; border-color: {color};">
  {name}
</Badge>
