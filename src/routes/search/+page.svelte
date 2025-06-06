<script lang="ts">
  import Clipboard from '@lucide/svelte/icons/clipboard'
  import { toast } from 'svelte-sonner'
  import { onMount } from 'svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import {
    searchHistory,
    searchText,
    isSearchHistoryActive,
  } from '$lib/stores/search'
  import { goto, pushState, replaceState } from '$app/navigation'
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
  import SkeletonText from '$lib/components/skeleton-text.svelte'
  import axios from '$lib/api'
  import { formatTextSafely } from '$lib/components/formatText'
  import { IsMobile } from '$lib/hooks/is-mobile.svelte'

  let results: any[] = $state([])
  let page: number = $state(1)
  let perPage: number = $state(20)
  let total: number = $state(0)
  let totalPages: number = $state(0)
  let loading: boolean = $state(true)
  let confirmedSearchText: string = $state('')

  function highlightSegments(
    text: string,
    query: string,
  ): { text: string; highlight: boolean }[] {
    if (!query) return [{ text, highlight: false }]

    text = text.replaceAll('<', '&lt;')
    text = text.replaceAll('>', '&gt;')

    const words = query
      .replace('^', '')
      .replace('$', '')
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
    loading = true
    if ($searchText === '') {
      loading = false
      return
    }
    if ($searchText.length < 1) {
      loading = false
      toast.error('Query must be at least 1 characters long')
      return
    }
    confirmedSearchText = $searchText
    if ($isSearchHistoryActive) {
      searchHistory.update((searchHistory) => {
        // remove duplicates
        searchHistory = searchHistory.filter((item) => item !== $searchText)
        const updated = [$searchText, ...searchHistory]
        return updated.slice(0, 100)
      })
    }
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        toast.error('Error fetching data: ' + error)
      })
    loading = false

    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('q', $searchText)
      pushState('/search?' + urlParams.toString(), {})
    }, 100)
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

  onMount(async () => {
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

    await OnSend()
  })
</script>

<Navigation onSend={OnSend} />

<main>
  <div>
    {#if !loading && results.length === 0}
      <div class="w-full h-full flex justify-center items-center">
        <p class="text-muted-foreground">No results found</p>
      </div>
    {:else}
      <div
        class="w-full my-2 px-2 grid grid-cols-1 sm:grid-cols-2 justify-between sm:justify-center items-center gap-2"
      >
        <p class="text-muted-foreground text-center sm:text-left">
          {#if !loading}
            {results.length} of
            {total}
            {total <= 1 ? 'result' : 'results'}
          {:else}
            <SkeletonText>20 of 30 results</SkeletonText>
          {/if}
        </p>
        {#if totalPages > 1}
          <div
            class="justify-center sm:justify-end items-center gap-2 sm:flex hidden"
          >
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
        {/if}
      </div>
      <div class="border rounded">
        {#if !loading}
          {#each results as result}
            <div
              class=""
              role="tooltip"
              onmouseenter={() => (result.hovered = true)}
              onmouseleave={() => (result.hovered = false)}
            >
              <div class="px-4 py-4 border-b flex flex-col gap-1">
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
                        <a
                          href="/{result.Source}/{result.Type}/{result.Key}"
                          class="hover:no-underline hover:opacity-70"
                        >
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
                    <div class="flex gap-2">
                      <BadgeCustom name={result.Source} />
                      <BadgeCustom name={result.Type} />
                    </div>
                  </div>
                </div>
                <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
                  {@html formatTextSafely(result.Description, true)}
                </p>
              </div>
            </div>
          {/each}
        {:else}
          {#each Array.from({ length: 20 }) as _}
            <div class="" role="tooltip">
              <div class="px-4 py-4 border-b flex flex-col gap-1">
                <div class="flex justify-start items-center gap-2">
                  <div
                    class="flex w-full justify-between flex-wrap flex-col md:flex-row gap-1"
                  >
                    <div class="flex gap-2 items-center">
                      <p
                        class="text-xl flex gap-1 items-center text-primary font-semibold p-0 m-0 break-all [overflow-wrap:anywhere]"
                      >
                        <SkeletonText>kitty-themes</SkeletonText>
                      </p>
                    </div>
                    <div>
                      <BadgeCustom name="----" />
                      <BadgeCustom name="----" />
                    </div>
                  </div>
                </div>
                <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
                  <SkeletonText>
                    Themes for the kitty terminal emulator
                  </SkeletonText>
                </p>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <div
        class="w-full my-2 px-2 grid grid-cols-1 sm:grid-cols-2 justify-between sm:justify-center items-center gap-2"
      >
        <p class="text-muted-foreground text-center sm:text-left">
          {#if !loading}
            {results.length} of
            {total}
            {total <= 1 ? 'result' : 'results'}
          {:else}
            <SkeletonText>20 of 30 results</SkeletonText>
          {/if}
        </p>
        {#if totalPages > 1}
          <div class="justify-center sm:justify-end items-center gap-2 flex">
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
        {/if}
      </div>
    {/if}
  </div>
</main>
