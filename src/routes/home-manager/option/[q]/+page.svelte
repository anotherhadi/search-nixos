<script lang="ts">
  import SquareCode from "@lucide/svelte/icons/square-code";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import axios from "axios";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import Navigation from "../../../navigation.svelte";
  import { searchText, excludeSource } from "$lib/stores/search";
  import { replaceState } from "$app/navigation";
  import Codeblock from "$lib/components/codeblock.svelte";

  let loading: any = $state(true);
  let opt: any = $state(null);
  let prefix: string = $state("");
  let q: string = $state("");

  onMount(async () => {
    const path = window.location.pathname.split("/");
    [prefix, q] = [path.slice(1, 3).join("/"), path[3]];

    try {
      const { data, status } = await axios.get(
        `https://search-nixos-api.hadi.diy/${prefix}/${q}`,
      );
      if (status === 200) {
        opt = data;
        loading = false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error}`);
    }
  });
</script>

<Navigation
  onSend={() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", $searchText);
    if ($excludeSource.length > 0) {
      urlParams.set("exclude", $excludeSource.join(","));
    }
    replaceState("/search?" + urlParams.toString(), "");
  }}
/>
<main>
  <div>
    <header class="mb-6 flex flex-col gap-1">
      <div>
        <Badge variant="outline" class="text-primary">option</Badge>
      </div>
      <div class="flex justify-start items-center flex-wrap gap-2">
        <h2 class="text-muted-foreground select-none m-0 font-normal">
          {prefix}/
        </h2>
        <h1 class="m-0 font-medium">{q}</h1>
      </div>
    </header>

    {#if loading === false && opt}
      <div class="rounded border p-4 col-span-6 md:col-span-4">
        <div class="flex flex-col gap-4">
          {#if opt.description}
            <div>
              <p class="text-lg">
                {opt.description}
              </p>
            </div>
          {/if}

          {#if opt.declarations.length}
            {#if prefix === "home-manager/option"}
              <div>
                <h4>Declarations</h4>
                <p class="flex gap-2 flex-col ml-4">
                  {#each opt.declarations as declaration}
                    <a
                      href={declaration.url}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"
                    >
                      <SquareCode size={16} />
                      {declaration.name}
                    </a>
                  {/each}
                </p>
              </div>
            {:else}
              <div>
                <h4>Declarations</h4>
                <p class="flex gap-2 flex-col ml-4">
                  {#each opt.declarations as declaration}
                    <a
                      href={`https://github.com/NixOS/nixpkgs/blob/nixos-unstable/${declaration}`}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"
                    >
                      <SquareCode size={16} />
                      {declaration}
                    </a>
                  {/each}
                </p>
              </div>
            {/if}
          {/if}

          {#if opt.type}
            <div class="flex gap-2 items-stretch">
              <h4 class="w-24">Type</h4>
              <Codeblock text={opt.type} showCopy={false} />
            </div>
          {/if}

          {#if opt.default}
            <div class="flex gap-2 items-stretch">
              <h4 class="w-24">Default</h4>
              <Codeblock text={opt.default.text} />
            </div>
          {/if}

          <!-- TODO: Check `` (ex in services.tailscale.extraUpFlags) -->
          {#if opt.example.text !== ""}
            <div class="flex gap-2 items-stretch">
              <h4 class="w-24">Example</h4>
              <Codeblock text={opt.example.text} />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>
