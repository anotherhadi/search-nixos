<script lang="ts">
  import Github from '@lucide/svelte/icons/github'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import Navigation from './navigation.svelte'
  import { searchText } from '$lib/stores/search'
  import { replaceState } from '$app/navigation'
  import Codeblock from './codeblock.svelte'
  import { API_URL, DEBUG } from '$lib/vars'
  import SkeletonText from './skeleton-text.svelte'
  import BadgeCustom from './badge-custom.svelte'
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
  import CopyUrl from './copy-url.svelte'
  import axios from '$lib/api'
  import { formatTextSafely } from './formatText'

  let prefix: string = $state('') // nixpkgs/package
  let q: string = $state('') // kitty

  let pkg: any = $state(null)

  onMount(async () => {
    const path = window.location.pathname.split('/')
    ;[prefix, q] = [path.slice(1, 3).join('/'), path[3]]

    try {
      const { data, status } = await axios.get(`${API_URL}/${prefix}/${q}`)
      if (status === 200) {
        pkg = data
        if (DEBUG) {
          console.log(data)
        }
      } else {
        console.log(data)
        throw new Error('status code: ' + status)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(`Error fetching data: ${error}`)
    }
  })
</script>

<Navigation
  onSend={() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('q', $searchText)
    replaceState('/search?' + urlParams.toString(), '')
  }}
/>

<main>
  <header class="flex flex-col gap-5">
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {#each q.split('.') as option, i}
          {#if i !== q.split('.').length - 1}
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href={`/search?q=^${q
                  .split('.')
                  .slice(0, i + 1)
                  .join('.')}.`}>{option}</Breadcrumb.Link
              >
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          {:else}
            <Breadcrumb.Item>
              <Breadcrumb.Page>{option}</Breadcrumb.Page>
            </Breadcrumb.Item>
          {/if}
        {/each}
      </Breadcrumb.List>
    </Breadcrumb.Root>

    <div class="flex gap-2 items-center">
      {#if pkg}
        <BadgeCustom name={pkg.source} />
      {:else}
        <BadgeCustom name="-----" />
      {/if}
      <BadgeCustom name="option" />
    </div>

    <div class="flex items-center justify-between flex-wrap gap-5 w-full">
      <h1
        class="text-2xl m-0 mb-2 font-semibold break-all [overflow-wrap:anywhere]"
      >
        {#if q}
          {q}
        {:else}
          <SkeletonText>programs.kitty.enable</SkeletonText>
        {/if}
      </h1>

      <CopyUrl />
    </div>
  </header>

  <div class="rounded border col-span-6 md:col-span-4 px-6 py-4">
    <div class="flex flex-col gap-4">
      <p class="font-bold text-muted-foreground">Informations</p>

      {#if pkg && (pkg.longDescription || pkg.description)}
        <div>
          <h4>Description</h4>
          <p class="pl-4">
            {@html formatTextSafely(pkg.longDescription || pkg.description)}
          </p>
        </div>
      {:else}
        <div>
          <h4>Description</h4>
          <p class="pl-4">
            <SkeletonText
              >Node agent for Tailscale, a mesh VPN built on WireGuard.</SkeletonText
            >
          </p>
        </div>
      {/if}

      {#if pkg && pkg.declarations.length}
        <div>
          <h4>Declarations</h4>
          <p class="pl-4  break-all [overflow-wrap:anywhere]">
            {#each pkg.declarations as item}
              <a
                href={item}
                target="_blank"
                class="flex gap-2 items-center flex-wrap"
                rel="noopener noreferrer"
                ><Github size={16} />
                {item.replace('https://', '').replace('github.com/', '')}</a
              >
            {/each}
          </p>
        </div>
      {:else}
        <div>
          <h4>Declarations</h4>
          <p class="pl-4 flex gap-2 items-center">
            <Github size={16} />
            <SkeletonText
              >https://github.com/nix-community/home-manager/blob/master/modules/programs/kitty.nix</SkeletonText
            >
          </p>
        </div>
      {/if}

      {#if pkg && pkg.type}
        <div class="flex gap-2 items-stretch flex-col md:flex-row">
          <h4 class="w-24">Type</h4>
          <Codeblock text={pkg.type} showCopy={false} />
        </div>
      {/if}

      {#if pkg && pkg.default}
        <div class="flex gap-2 items-stretch flex-col md:flex-row">
          <h4 class="w-24">Default</h4>
          <Codeblock text={pkg.default} />
        </div>
      {/if}

      {#if pkg && pkg.example}
        <div class="flex gap-2 items-stretch flex-col md:flex-row">
          <h4 class="w-24">Example</h4>
          <Codeblock text={pkg.example} />
        </div>
      {/if}
    </div>
  </div>
</main>
