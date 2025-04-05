<script lang="ts">
  import Clipboard from "@lucide/svelte/icons/clipboard";
  import axios from "axios";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Navigation from "../navigation.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { searchText, excludeSource } from "$lib/stores/search";
  import { replaceState } from "$app/navigation";

  let results: any[] = $state([]);
  let loading: boolean = $state(false);

  async function OnSend() {
    if ($searchText === "") {
      return;
    }
    if ($searchText.length < 3) {
      toast.error("Query must be at least 3 characters long");
      return;
    }
    loading = true;
    let url = "https://search-nixos-api.hadi.diy/search?q=" + $searchText;
    if ($excludeSource.length > 0) {
      url += "&exclude=" + $excludeSource.join(",");
    }
    await axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          results = response.data;
        } else {
          console.error("Error fetching data:", response.statusText);
          toast.error("Error fetching data: " + response.statusText);
        }
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("q", $searchText);
        if ($excludeSource.length > 0) {
          urlParams.set("exclude", $excludeSource.join(","));
        }
        replaceState("/search?" + urlParams.toString(), "");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data: " + error);
      });
    loading = false;
  }

  function CopyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Error copying text: " + err);
      },
    );
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get("q") || "";
    if (query.length > 0) {
      searchText.update(() => query);
    }

    let exclude = urlParams.get("exclude") || "";
    if (exclude.length > 0) {
      excludeSource.update(() => exclude.split(","));
    }

    OnSend();
  });
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
      <p class="text-muted-foreground ml-4">
        {results.length}
        {results.length <= 1 ? "result" : "results"}
      </p>
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
                <p class="text-xl text-primary font-semibold p-0 m-0">
                  <a href="/{result.name}">
                    {result.name}
                  </a>
                </p>

                {#if result.hovered}
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-sm text-muted-foreground h-7 w-7"
                    onclick={() => CopyToClipboard(result.key)}
                  >
                    <Clipboard />
                  </Button>
                {/if}
              </div>
              <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
                {result.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
