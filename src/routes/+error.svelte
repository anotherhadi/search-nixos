<script>
  import { page } from "$app/state";
</script>

{#if page.error}
  <main
    class="flex h-screen w-screen justify-center items-center flex-col gap-10"
  >
    {#if page.status === 404}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="404"
          src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png?raw=true"
        />
      </div>
      <div>
        <h1 class="mb-2 text-center">{page.status}: {page.error.message}</h1>
        <p class="text-xl text-center">(^-^*)</p>
      </div>
    {:else if page.status === 403}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="403"
          src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/403%20Forbidden.png?raw=true"
        />
      </div>
      <div>
        <h1 class="mb-2 text-center">{page.status}: {page.error.message}</h1>
        <p class="text-xl text-center">(^-^*)</p>
      </div>
    {:else if page.status === 418}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="418"
          src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/418%20I'm%20a%20teapot.png?raw=true"
        />
      </div>
      <div>
        <h1 class="mb-2 text-center">{page.status}: {page.error.message}</h1>
        <p class="text-xl text-center">(^-^*)</p>
      </div>
    {:else if page.status === 500}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="500"
          src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/500%20InternalServerError.png?raw=true"
        />
      </div>
      <div>
        <h1 class="mb-2 text-center">{page.status}: {page.error.message}</h1>
        <p class="text-xl text-center">(^-^*)</p>
      </div>
    {:else if page.status === 503}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="503"
          src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/503%20ServiceUnavailable.png?raw=true"
        />
      </div>
      <div>
        <h1 class="mb-2 text-center">{page.status}: {page.error.message}</h1>
        <p class="text-xl text-center">(^-^*)</p>
      </div>
    {:else}
      <h1>{page.status}: {page.error.message}</h1>
    {/if}
  </main>
{/if}
