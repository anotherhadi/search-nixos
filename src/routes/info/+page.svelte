<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { excludeSource, searchText } from "$lib/stores/search";
  import axios from "axios";
  import { onMount } from "svelte";
  import Navigation from "../navigation.svelte";

  let nOptions: number = $state(0);
  let nPackages: number = $state(0);
  let data: any = $state(null);

  onMount(async () => {
    axios
      .get("https://search-nixos-api.hadi.diy/stats")
      .then((response) => {
        if (response.status === 200) {
          nOptions =
            parseInt(response.data["nixos-length"]) +
            parseInt(response.data["homemanager-length"]);
          nPackages = parseInt(response.data["nixpkgs-length"]);
          data = response.data;
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
<main class="gap-0">
  <h1 class="mb-0">Search NixOS - Informations</h1>
  <p class="text-sm mb-6 text-muted-foreground">
    Version {data && data.version ? data.version : "Loading..."}, last updated
    {data && data.datetime ? data.datetime : "Loading..."}
  </p>
  <p class="text-lg">
    A simple search engine for NixOS, Nixpkgs, Home Manager and more. Find
    options, packages, modules, and more effortlessly.
  </p>

  <p class="flex items-center gap-1">
    Search through
    {#if nOptions > 0}
      <strong>{nOptions}</strong>
    {:else}
      <span class="bg-muted animate-pulse rounded-md w-14 h-4"></span>
    {/if}
    options and
    {#if nPackages > 0}
      <strong>{nPackages}</strong>
    {:else}
      <span class="bg-muted animate-pulse rounded-md w-16 h-4"></span>
    {/if}
    packages.
  </p>

  <h2>Example Queries</h2>
  <p>
    <code>kitty</code> - Search for kitty<br />
    <code>package kitty</code> - Search for the package kitty<br />
    <code>option services.xserver</code> - Search for the xserver option<br />
    <code>^tailscale</code> - Search for everything starting with tailscale<br
    />
    <code>option enable$</code> - Search for every option ending with enable<br
    />
    <code>kitty themes</code> - Search for everything containing kitty and
    themes<br />
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
    <div>
      <h2>Contributing</h2>
      <p>
        This project is open source! If you find a bug or have a suggestion,
        feel free to
        <a
          href="https://github.com/anotherhadi/search-nixos"
          class="text-blue-600 hover:underline">open an issue</a
        > or a pull request on GitHub.
      </p>
    </div>

    <div>
      <h2>Funding</h2>
      <p>
        Support this project by donating on
        <a
          href="https://ko-fi.com/anotherhadi"
          target="_blank"
          class="text-blue-600 hover:underline">Ko-fi</a
        >. Your contribution helps cover server costs and encourages further
        development. Thank you!
      </p>
    </div>
  </div>
</main>
