<script lang="ts">
  import Badge from './ui/badge/badge.svelte'

  let { name = '' } = $props()
  let colors: any = {
    nixpkgs: '#8aadf4',
    darwin: '#ed8796',
    'home-manager': '#b7bdf8',
    nur: '#f5a97f',
    package: '#dec48f',
    option: '#96ca85',
    default: '#8c8fa1',
  }
</script>

<Badge
  variant="outline"
  style="color: {colors[name] || colors['default']}; border-color: {colors[
    name
  ] || colors['default']};"
>
  {name}
</Badge>
