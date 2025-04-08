<script lang="ts">
  import Clipboard from '@lucide/svelte/icons/clipboard'
  import axios from 'axios'
  import { toast } from 'svelte-sonner'
  import { onMount } from 'svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
  import { searchText } from '$lib/stores/search'
  import { replaceState } from '$app/navigation'
  import Navigation from '$lib/components/navigation.svelte'
  import {
    Bug,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ShieldAlert,
    TriangleAlert,
  } from '@lucide/svelte'
  import { API_URL, DEBUG } from '$lib/vars'
  import BadgeCustom from '$lib/components/badge-custom.svelte'

  let results: any[] = $state([])
  let page: number = $state(1)
  let perPage: number = $state(20)
  let total: number = $state(0)
  let totalPages: number = $state(0)
  let loading: boolean = $state(false)
  let confirmedSearchText: string = $state('')

  function highlightSegments(
    text: string,
    query: string,
  ): { text: string; highlight: boolean }[] {
    if (!query) return [{ text, highlight: false }]

    const words = query
      .split(/\s+/)
      .filter((word) => word !== 'package' && word !== 'option')
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex chars

    if (words.length === 0) return [{ text, highlight: false }]

    const regex = new RegExp(`(${words.join('|')})`, 'gi')
    const segments: { text: string; highlight: boolean }[] = []

    let lastIndex = 0
    for (const match of text.matchAll(regex)) {
      const index = match.index ?? 0
      if (index > lastIndex) {
        segments.push({ text: text.slice(lastIndex, index), highlight: false })
      }
      segments.push({ text: match[0], highlight: true })
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), highlight: false })
    }

    return segments
  }

  async function OnSend({ resetPage = true }: { resetPage?: boolean } = {}) {
    confirmedSearchText = $searchText
    if ($searchText === '') {
      return
    }
    if ($searchText.length < 1) {
      toast.error('Query must be at least 1 characters long')
      return
    }
    loading = true
    let url = `${API_URL}/search?q=` + encodeURIComponent($searchText)
    if (!isNaN(page) && page > 1) {
      url += '&page=' + page
    }
    if (!isNaN(perPage) && perPage !== 20) {
      url += '&perPage=' + perPage
    }
    if (resetPage) {
      page = 1
    }
    await axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          results = Array.isArray(response.data.results)
            ? response.data.results
            : []
          total = response.data.total
          page = response.data.page
          totalPages = response.data.totalPages
          perPage = response.data.perPage
          if (DEBUG) {
            console.log('Response data:', response.data)
          }
        } else {
          console.error('Error fetching data:', response.statusText)
          toast.error('Error fetching data: ' + response.statusText)
        }
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('q', $searchText)
        replaceState('/search?' + urlParams.toString(), '')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        toast.error('Error fetching data: ' + error)
      })
    loading = false
  }

  function CopyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard')
      },
      (err) => {
        console.error('Could not copy text: ', err)
        toast.error('Error copying text: ' + err)
      },
    )
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    let query = urlParams.get('q') || ''
    if (query.length > 0) {
      searchText.update(() => query)
    }

    let perPageParam = urlParams.get('perPage') || ''
    if (perPageParam.length > 0) {
      if (!isNaN(parseInt(perPageParam))) {
        perPage = parseInt(perPageParam)
      }
    }

    let pageParam = urlParams.get('page') || ''
    if (pageParam.length > 0) {
      if (!isNaN(parseInt(pageParam))) {
        page = parseInt(pageParam)
      }
    }

    OnSend()
  })
</script>

<Navigation onSend={OnSend} />

<main>
  <div>
    {#if loading}
      <Skeleton class="w-32 h-4 ml-4 mb-2" />
      <div class="border rounded">
        {#each [...Array(10)] as _}
          <div class="px-4 py-4 border-b">
            <Skeleton class="w-52 h-4 mb-2" />
            <Skeleton class="w-2/3 h-4" />
          </div>
        {/each}
      </div>
    {:else if results.length === 0}
      <div class="w-full h-full flex justify-center items-center">
        <p class="text-muted-foreground">No results found</p>
      </div>
    {:else}
      <div
        class="w-full my-2 flex justify-between items-center flex-wrap gap-2"
      >
        <p class="text-muted-foreground ml-4">
          {results.length} of
          {total}
          {total <= 1 ? 'result' : 'results'}
        </p>
        <div class="justify-center items-center gap-2 mr-4 md:flex hidden">
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === 1}
            onclick={() => {
              page = 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === 1}
            onclick={() => {
              page -= 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronLeft />
          </Button>

          <p class="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === totalPages}
            onclick={() => {
              page += 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === totalPages}
            onclick={() => {
              page = totalPages
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
      <div class="border rounded">
        {#each results as result}
          <div
            class=""
            role="tooltip"
            onmouseenter={() => (result.hovered = true)}
            onmouseleave={() => (result.hovered = false)}
          >
            <div class="px-4 py-4 border-b">
              <div class="flex justify-start items-center gap-2">
                <div
                  class="flex w-full justify-between flex-wrap flex-col md:flex-row gap-1"
                >
                  <div class="flex gap-2 items-center">
                    <p
                      class="text-xl flex gap-1 items-center text-primary font-semibold p-0 m-0 break-all [overflow-wrap:anywhere]"
                    >
                      {#if result.Broken}
                        <TriangleAlert class="size-5 text-destructive" />
                      {/if}
                      {#if result.Insecure}
                        <ShieldAlert class="size-5 text-yellow-500" />
                      {/if}
                      {#if result.Vulnerable}
                        <Bug class="size-5 text-orange-500" />
                      {/if}
                      <a href="/{result.Source}/{result.Type}/{result.Key}">
                        {@html highlightSegments(
                          result.Key,
                          confirmedSearchText,
                        )
                          .map((seg) =>
                            seg.highlight
                              ? `<span class="underline">${seg.text}</span>`
                              : seg.text,
                          )
                          .join('')}
                      </a>
                    </p>

                    {#if result.hovered}
                      <Button
                        variant="ghost"
                        size="icon"
                        class="text-sm text-muted-foreground h-7 w-7"
                        onclick={() => CopyToClipboard(result.Key)}
                      >
                        <Clipboard />
                      </Button>
                    {/if}
                  </div>
                  <div>
                    <BadgeCustom name={result.Source} />
                    <BadgeCustom name={result.Type} />
                  </div>
                </div>
              </div>
              <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
                {result.Description}
              </p>
            </div>
          </div>
        {/each}
      </div>

      <div
        class="w-full my-2 flex justify-between items-center flex-wrap gap-2"
      >
        <p class="text-muted-foreground ml-4">
          {results.length} of
          {total}
          {total <= 1 ? 'result' : 'results'}
        </p>
        <div class="justify-center items-center gap-2 mr-4 flex">
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === 1}
            onclick={() => {
              page = 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === 1}
            onclick={() => {
              page -= 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronLeft />
          </Button>

          <p class="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === totalPages}
            onclick={() => {
              page += 1
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            disabled={page === totalPages}
            onclick={() => {
              page = totalPages
              OnSend({
                resetPage: false,
              })
            }}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    {/if}
  </div>
</main>
