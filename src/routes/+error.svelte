<script>
  import { page } from '$app/state'

  // All images are from @SAWARATSUKI

</script>

{#if page.error}
  <main
    class="flex h-screen w-screen justify-center items-center flex-col gap-10"
  >
    {#if page.status === 404}
      <div class="w-1/2 md:w-1/3">
        <img
          alt="404"
          src="/errors/404.png"
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
          src="/errors/403.png"
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
          src="/errors/418.png"
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
          src="/errors/500.png"
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
          src="/errors/503.png"
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
