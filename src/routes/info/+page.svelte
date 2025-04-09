<script lang="ts">
  import { replaceState } from '$app/navigation'
  import Navigation from '$lib/components/navigation.svelte'
  import * as Accordion from '$lib/components/ui/accordion/index.js'
  import SkeletonText from '$lib/components/skeleton-text.svelte'
  import * as Table from '$lib/components/ui/table/index.js'
  import { searchText } from '$lib/stores/search'
  import { API_URL, DEBUG } from '$lib/vars'
  import { onMount } from 'svelte'
  import axios from '$lib/api'

  let nOptions: number = $state(0)
  let nPackages: number = $state(0)
  let lastUpdated: string = $state('')
  let version: string = $state('')

  onMount(async () => {
    axios
      .get(`${API_URL}/stats`)
      .then((response) => {
        if (response.status === 200) {
          if (DEBUG) {
            console.log('Response data:', response.data)
          }
          nOptions =
            parseInt(response.data['nixos-length']) +
            parseInt(response.data['homemanager-length']) +
            parseInt(response.data['darwin-length'])
          nPackages =
            parseInt(response.data['nixpkgs-length']) +
            parseInt(response.data['nur-length'])
          lastUpdated = response.data['last-updated']
          version = response.data['version']
        } else {
          console.error('Error fetching data:', response.statusText)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  })
</script>

<Navigation
  onSend={() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('q', $searchText)
    replaceState('/search?' + urlParams.toString(), '')
  }}
/>
<main class="gap-0">
  <h1 class="font-bold text-muted-foreground">Informations</h1>

  <div class="flex flex-col gap-5">
    <div>
      <h2 class="mt-2" id="version">Version</h2>
      {#if version}
        <p class="pl-4">{version}</p>
      {:else}
        <SkeletonText
          >nixos/unstable/nixos-25.05pre779115.42a1c966be22</SkeletonText
        >
      {/if}
    </div>

    <div>
      <h2 id="last-version">Last updated</h2>
      {#if lastUpdated}
        <p class="pl-4">{lastUpdated}</p>
      {:else}
        <SkeletonText>2025-04-07T20:32:26+02:00</SkeletonText>
      {/if}
    </div>

    <div>
      <h2 id="query">Queries</h2>
      <div class="pl-4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-[200px]">Query/Field</Table.Head>
              <Table.Head class="w-[200px]">Example</Table.Head>
              <Table.Head>Description</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell class="font-medium">Multi-field search</Table.Cell>
              <Table.Cell>kitty theme</Table.Cell>
              <Table.Cell
                >Matches entries that contain <strong>all</strong> words.</Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Package prefix</Table.Cell>
              <Table.Cell>package kitty</Table.Cell>
              <Table.Cell
                >Only search for packages. <i>(nixpkgs, nur)</i></Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Option prefix</Table.Cell>
              <Table.Cell>option tailscale</Table.Cell>
              <Table.Cell
                >Only search for options. <i>(nixos, home-manager, darwin)</i
                ></Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Starts with</Table.Cell>
              <Table.Cell>^kitty</Table.Cell>
              <Table.Cell>Matches entries that start with the field.</Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Ends with</Table.Cell>
              <Table.Cell>theme$</Table.Cell>
              <Table.Cell>Matches entries that end with the field.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Source include</Table.Cell>
              <Table.Cell>home-manager kitty</Table.Cell>
              <Table.Cell
                >Restrict search to a specific source. <sup
                  class="text-muted-foreground">[1]</sup
                ></Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Source exclude</Table.Cell>
              <Table.Cell>!home-manager kitty</Table.Cell>
              <Table.Cell
                >Exclude results from that source.<sup
                  class="text-muted-foreground">[1]</sup
                ></Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Broken packages</Table.Cell>
              <Table.Cell>?broken</Table.Cell>
              <Table.Cell
                >Only show packages marked as broken. See <sup
                  class="text-muted-foreground">[2]</sup
                ></Table.Cell
              >
            </Table.Row>
            <Table.Row>
              <Table.Cell class="font-medium">Maintainer filter</Table.Cell>
              <Table.Cell>?maintainer=tux</Table.Cell>
              <Table.Cell
                >Only show packages maintained by the given user.</Table.Cell
              >
            </Table.Row>
          </Table.Body>
        </Table.Root>
        <p class="text-muted-foreground text-sm">
          <sup>[1]</sup> Available sources are: nixpkgs, nur, nixos,
          home-manager, darwin<br />
          <sup>[2]</sup> Available special queries are: ?broken, ?vulnerable, ?maintainer=username
        </p>
      </div>
    </div>
  </div>

  <div>
    <h2 id="misc">Misc</h2>
    <Accordion.Root type="single" class="max-w-xl pl-4">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Add to the browser's search engine</Accordion.Trigger
        >
        <Accordion.Content>
          Add <code>https://search-nixos.hadi.diy/search?q=%s </code>
          to your browser's search engines. Replace <code>%s</code> with your browser's
          search query placeholder.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
</main>
