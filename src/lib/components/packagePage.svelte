<script lang="ts">
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import * as Alert from '$lib/components/ui/alert/index.js'
  import * as Avatar from '$lib/components/ui/avatar/index.js'
  import Package from '@lucide/svelte/icons/package'
  import SquareCode from '@lucide/svelte/icons/square-code'
  import Globe from '@lucide/svelte/icons/globe'
  import Github from '@lucide/svelte/icons/github'
  import Badge from '$lib/components/ui/badge/badge.svelte'
  import * as Collapsible from '$lib/components/ui/collapsible/index.js'
  import axios from 'axios'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import Navigation from './navigation.svelte'
  import { searchText } from '$lib/stores/search'
  import { replaceState } from '$app/navigation'
  import Codeblock from './codeblock.svelte'
  import { CircleAlert } from '@lucide/svelte'
  import { API_URL, DEBUG } from '$lib/vars'
  import { SiApple, SiFreebsd, SiLinux } from '@icons-pack/svelte-simple-icons'
  import SkeletonText from './skeleton-text.svelte'
  import BadgeCustom from './badge-custom.svelte'
  import CopyUrl from './copy-url.svelte'

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
    <div class="flex gap-2 items-center">
      {#if pkg}
        <BadgeCustom name={pkg.source} />
      {:else}
        <BadgeCustom name="-----" />
      {/if}
      <BadgeCustom name="package" />
    </div>

    <div class="flex items-center justify-between flex-wrap gap-5 w-full">
      <h1 class="m-0 mb-2 font-semibold break-all [overflow-wrap:anywhere]">
        {#if q}
          {q}
        {:else}
          <SkeletonText>tailscale</SkeletonText>
        {/if}
      </h1>
      <CopyUrl />
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-6 gap-5">
    <!-- Left Box -->
    <div class="rounded border col-span-6 md:col-span-4 px-6 py-4">
      <div class="flex flex-col gap-4">
        <p class="font-bold text-muted-foreground">Informations</p>

        {#if pkg && pkg.broken}
          <Alert.Root variant="destructive">
            <CircleAlert class="size-4" />
            <Alert.Title>Broken</Alert.Title>
            <Alert.Description
              >This package is currently broken and may not work as expected!
            </Alert.Description>
          </Alert.Root>
        {/if}

        {#if pkg && pkg.insecure}
          <Alert.Root variant="destructive" class="border-orange-500">
            <CircleAlert class="size-4 stroke-orange-500" />
            <Alert.Title class="text-orange-500">Insecure</Alert.Title>
            <Alert.Description class="text-orange-500"
              >This package is currently marked as insecure!
            </Alert.Description>
          </Alert.Root>
        {/if}

        {#if pkg && (pkg.longDescription || pkg.description)}
          <div>
            <h4>Description</h4>
            <p class="pl-4">
              {pkg.longDescription || pkg.description}
            </p>
          </div>
        {:else if !pkg}
          <div>
            <h4>Description</h4>
            <p class="pl-4">
              <SkeletonText
                >Node agent for Tailscale, a mesh VPN built on WireGuard.</SkeletonText
              >
            </p>
          </div>
        {/if}

        {#if pkg && pkg.homepages.length}
          <div>
            <h4>Homepage</h4>
            <p class="pl-4">
              {#each pkg.homepages as item}
                <a
                  href={item}
                  target="_blank"
                  class="flex gap-2 items-center"
                  rel="noopener noreferrer"><Globe size={16} /> {item}</a
                >
              {/each}
            </p>
          </div>
        {:else if !pkg}
          <div>
            <h4>Homepage</h4>
            <p class="pl-4">
              <SkeletonText>https://tailscale.com</SkeletonText>
            </p>
          </div>
        {/if}

        {#if pkg && pkg.position}
          <div>
            <h4>Source</h4>
            <p class="flex gap-2 flex-col pl-4">
              <a
                href={pkg.positionUrl}
                target="_blank"
                class="flex gap-2 items-center"
                rel="noopener noreferrer"
              >
                <SquareCode size={16} />
                {pkg.position}
              </a>
            </p>
          </div>
        {:else if !pkg}
          <div>
            <h4>Source</h4>
            <p class="pl-4">
              <SkeletonText
                >pkgs/by-name/ta/tailscale/package.nix:200</SkeletonText
              >
            </p>
          </div>
        {/if}

        <div>
          <h4>Nix Shell</h4>
          {#if q}
            <div class="flex items-stretch pl-4">
              <Codeblock text={`nix-shell -p ${q}`} isShell />
            </div>
          {:else}
            <div class="flex items-stretch pl-4">
              <Codeblock text={`nix-shell -p ----`} />
            </div>
          {/if}
        </div>

        {#if pkg && pkg.knownVulnerabilities.length}
          <div>
            <h4>Known Vulnerabilities</h4>
            <div>
              {#each pkg.knownVulnerabilities as item}
                <Alert.Root variant="destructive">
                  <CircleAlert class="size-4" />
                  <Alert.Description class="text-wrap">{item}</Alert.Description
                  >
                </Alert.Root>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Right Box -->
    <div class="rounded border col-span-6 md:col-span-2 px-6 py-4">
      <div class="flex flex-col gap-4">
        <p class="font-bold text-muted-foreground">Meta</p>

        {#if pkg && (pkg.unfree || pkg.license)}
          <div class="flex gap-2 flex-wrap">
            {#if pkg.unfree}<Badge variant="destructive">Unfree</Badge>{/if}
            {#each pkg.license as { spdxId }}
              <Badge variant="outline">License: {spdxId}</Badge>
            {/each}
          </div>
        {/if}

        {#if pkg && pkg.version}
          <div>
            <h4>Version</h4>
            <p class="pl-4">v{pkg.version}</p>
          </div>
        {:else if !pkg}
          <div>
            <h4>Version</h4>
            <p class="pl-4">
              <SkeletonText>v1.82.0</SkeletonText>
            </p>
          </div>
        {/if}

        {#if pkg && pkg.maintainers.length}
          <div>
            <h4>Maintainers</h4>
            <div class="flex flex-col gap-1 pl-4">
              {#each pkg.maintainers as { github, name }}
                <p class="flex flex-wrap gap-2 items-center">
                  <Avatar.Root class="w-5 h-5">
                    <Avatar.Image
                      src={`https://github.com/${github}.png`}
                      alt={`@${name}`}
                    />
                    <Avatar.Fallback class="bg-transparent">
                      <Github size={16} />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <a
                    href={`https://github.com/${github}`}
                    target="_blank"
                    class="flex gap-2 items-center"
                    rel="noopener noreferrer">{name}</a
                  >
                </p>
              {/each}
            </div>
          </div>
        {:else}
          <div>
            <h4>Maintainers</h4>
            <p class="pl-4 text-sm text-muted-foreground italic">
              No maintainers listed.
            </p>
          </div>
        {/if}

        {#if pkg && pkg.platforms.length}
          <div>
            <h4>Platforms</h4>
            <div class="flex flex-wrap gap-2 pl-4">
              <p class="flex flex-col gap-1">
                {#each pkg.platformsSimplify as item}
                  <span class="flex gap-2 items-center">
                    {#if item == 'linux'}
                      <SiLinux size={16} />
                      Linux
                    {:else if item == 'darwin'}
                      <SiApple size={16} />
                      Darwin
                    {:else if item == 'freebsd'}
                      <SiFreebsd size={16} />
                      FreeBSD
                    {:else}
                      <Package size={16} />
                      {item}
                    {/if}
                  </span>
                {/each}
              </p>
            </div>
            <Collapsible.Root class="mt-4 pl-4">
              <Collapsible.Trigger
                class="flex gap-1 items-center text-muted-foreground"
              >
                <ChevronsUpDown size={16} />
                Show all</Collapsible.Trigger
              >

              <Collapsible.Content>
                <div class="flex flex-col gap-1 pl-4">
                  {#each pkg.platforms as item}
                    <p>{item}</p>
                  {/each}
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        {:else}
          <div>
            <h4>Platforms</h4>
            <p class="pl-4 text-sm text-muted-foreground italic">
              No platforms listed.
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
