<script lang="ts">
  import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
  import Package from "@lucide/svelte/icons/package";
  import SquareCode from "@lucide/svelte/icons/square-code";
  import Globe from "@lucide/svelte/icons/globe";
  import Github from "@lucide/svelte/icons/github";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import axios from "axios";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import Navigation from "./navigation.svelte";
  import { searchText, excludeSource } from "$lib/stores/search";
  import { replaceState } from "$app/navigation";
  import Codeblock from "./codeblock.svelte";
  import Button from "./ui/button/button.svelte";
  import { Link, Share } from "@lucide/svelte";

  let loading: any = $state(true);
  let opt: any = $state(null);
  let prefix: string = $state("");
  let q: string = $state("");
  let platform: string[] = $state([]);
  let licenses_badges: { label: string, variant: string }[] = $state([]);
  let broken: boolean = $state(false);

  onMount(async () => {
    const path = window.location.pathname.split("/");
    [prefix, q] = [path.slice(1, 3).join("/"), path[3]];

    try {
      const { data, status } = await axios.get(
        `https://search-nixos-api.hadi.diy/${prefix}/${q}`,
      );
      if (status === 200) {
        opt = data;

        if (Array.isArray(opt.meta.platforms)) {
          const platformMap: any = {
            Darwin: "darwin",
            Linux: "linux",
            Windows: "windows",
            FreeBSD: "freebsd",
            Cygwin: "cygwin",
          };

          platform = Object.keys(platformMap).filter((p) =>
            opt.meta.platforms!.some((item: string) =>
              item.endsWith(platformMap[p]),
            ),
          );
        } else {
          platform = [];
        }

        broken = opt.meta?.broken;
        licenses_badges = [
          opt.meta?.unfree && { label: "Unfree", variant: "destructive" },
          ...(Array.isArray(opt.meta?.license)
            ? opt.meta.license
              .filter(({ spdxId }) => spdxId && spdxId.length)
              .map(({ spdxId }) => ({
                label: spdxId,
                variant: "outline",
              }))
          : []),
        ].filter(Boolean);

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
      {#if loading}
        <div>
          <Badge variant="outline" class="text-primary">package</Badge>
        </div>
        <div class="flex items-center justify-between flex-wrap gap-5">
          <div class="flex justify-start items-center flex-wrap gap-2">
            <span class="bg-muted animate-pulse rounded-md w-12 h-8"></span>
            /
            <span class="bg-muted animate-pulse rounded-md w-24 h-8"></span>
            /
            <span class="bg-muted animate-pulse rounded-md w-28 h-10"></span>
          </div>
          <Button variant="ghost"><Link /></Button>
        </div>
      {:else}
        <div>
          <Badge variant="outline" class="text-primary">package</Badge>
        </div>
        <div class="flex items-center justify-between flex-wrap gap-5">
          <div class="flex justify-start items-center flex-wrap gap-2">
            <h2 class="text-muted-foreground select-none m-0 font-normal">
              {prefix}/
            </h2>
            <h1 class="m-0 font-medium">{q}</h1>
          </div>
          <Button
            variant="ghost"
            onclick={() => {
              navigator.clipboard.writeText(window.location.href).then(
                () => {
                  toast.success("Copied to clipboard");
                },
                (err) => {
                  console.error("Could not copy text: ", err);
                  toast.error("Error copying text: " + err);
                },
              );
            }}><Link /></Button
          >
        </div>
      {/if}
    </header>

    {#if loading === false && opt}
      <div class="grid grid-cols-1 md:grid-cols-6 gap-2">
        <!-- Left Box -->
        <div class="rounded border p-4 col-span-6 md:col-span-4">
          <p class="font-bold text-muted-foreground mb-4">Informations</p>

          <div class="flex flex-col gap-4">
            {#if broken}
              <div class="border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert"> 
                <p class="block">This package has been reported as broken.</p>
              </div>
            {/if}
            {#if opt.meta.longDescription || opt.meta.description}
              <div>
                <h4>Description</h4>
                <p class="ml-4">
                  {opt.meta.longDescription || opt.meta.description}
                </p>
              </div>
            {/if}

            {#if opt.meta.homepage.length}
              <div>
                <h4>Homepage</h4>
                <p class="ml-4">
                  {#each opt.meta.homepage as item}
                    <a
                      href={item}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"><Globe size={16} /> {item}</a
                    >
                  {/each}
                </p>
              </div>
            {/if}

            {#if opt.meta.position}
              <div>
                <h4>Source</h4>
                <p class="flex gap-2 flex-col ml-4">
                  {#if prefix === "nur/package"}
                    <a
                      href={opt.meta.position}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"
                    >
                      <SquareCode size={16} />
                      {opt.meta.position}
                    </a>
                  {:else}
                    <a
                      href={`https://github.com/NixOS/nixpkgs/blob/nixos-unstable/${opt.meta.position.replace(":", "#L")}`}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"
                    >
                      <SquareCode size={16} />
                      {opt.meta.position.split(":")[0]}
                    </a>
                  {/if}
                </p>
              </div>
            {/if}

            <div>
              <h4>Nix Shell</h4>
              <div class="h-8 flex items-stretch">
                <Codeblock text={`nix-shell -p ${q}`} />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Box -->
        <div class="rounded border p-4 col-span-6 md:col-span-2">
          <p class="font-bold text-muted-foreground mb-4">Meta</p>

          <div class="flex flex-col gap-4">
            {#if licenses_badges.length}
              <div class="flex gap-2 flex-wrap">
                <span class="block inline">License{licenses_badges.length > 1 ? 's' : ''}</span>
                {#each licenses_badges as { label, variant }}
                  <Badge variant={variant}>{label}</Badge>
                {/each}
              </div>
            {/if}

            {#if opt.version}
              <div>
                <h4>Version</h4>
                <p class="ml-4">v{opt.version}</p>
              </div>
            {/if}

            {#if Array.isArray(opt.meta.maintainers) && opt.meta.maintainers.length}
              <div>
                <h4>Maintainers</h4>
                <p class="flex flex-col gap-1 ml-4">
                  {#each opt.meta.maintainers as { github, name }}
                    <a
                      href={`https://github.com/${github}`}
                      target="_blank"
                      class="flex gap-2 items-center"
                      rel="noopener noreferrer"><Github size={16} /> {name}</a
                    >
                  {/each}
                </p>
              </div>
            {:else}
              <div>
                <h4>Maintainers</h4>
                <p class="ml-4 text-sm text-gray-500 italic">No maintainers listed.</p>
              </div>
            {/if}

            {#if platform.length > 0}
              <div>
                <h4>Platforms</h4>
                <div class="flex flex-wrap gap-2 ml-4">
                  <p class="flex flex-col gap-1">
                    {#each platform as item}
                      <span class="flex gap-2 items-center"
                        ><Package size={16} /> {item}</span
                      >
                    {/each}
                  </p>
                </div>
                <Collapsible.Root class="mt-4 ml-4">
                  <Collapsible.Trigger
                    class="flex gap-1 items-center text-muted-foreground"
                  >
                    <ChevronsUpDown size={16} />
                    Show all</Collapsible.Trigger
                  >

                  <Collapsible.Content>
                    <div class="flex flex-col gap-1 ml-4">
                      {#each opt.meta.platforms as item}
                        <p>{item}</p>
                      {/each}
                    </div>
                 </Collapsible.Content>
               </Collapsible.Root>
              </div>
            {:else}
              <p class="ml-4 text-sm text-gray-500 italic">No platforms listed.</p>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-6 gap-2">
        <!-- Left Box -->
        <div class="rounded border p-4 col-span-6 md:col-span-4">
          <p class="font-bold text-muted-foreground mb-4">Informations</p>

          <div class="flex flex-col gap-4">
            <span class="bg-muted animate-pulse rounded-md w-24 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-48 h-4 ml-2 mb-4"
            ></span>

            <span class="bg-muted animate-pulse rounded-md w-32 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-72 h-4 ml-2 mb-4"
            ></span>

            <span class="bg-muted animate-pulse rounded-md w-24 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-48 h-4 ml-2"
            ></span>
          </div>
        </div>

        <!-- Right Box -->
        <div class="rounded border p-4 col-span-6 md:col-span-2">
          <p class="font-bold text-muted-foreground mb-4">Meta</p>

          <div class="flex flex-col gap-4">
            <div class="flex gap-2 flex-wrap mb-4">
              <span class="bg-muted animate-pulse rounded-md w-24 h-5"></span>
              <span class="bg-muted animate-pulse rounded-md w-48 h-5 ml-2"
              ></span>
            </div>
            <span class="bg-muted animate-pulse rounded-md w-24 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-48 h-4 ml-2"
            ></span>
            <span class="bg-muted animate-pulse rounded-md w-32 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-10 h-4 ml-2"
            ></span>
            <span class="bg-muted animate-pulse rounded-md w-24 h-5"></span>
            <span class="bg-muted animate-pulse rounded-md w-48 h-4 ml-2"
            ></span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>
