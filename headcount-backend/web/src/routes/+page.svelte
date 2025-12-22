<script lang="ts">
  import { enhance } from "$app/forms";

  import Tooltip from "sv-tooltip";

  import { Trash2 } from "@lucide/svelte";

  let applistScreen = $state(true);
  let formError = $state(false);

  let { data, form }: Props = $props();

</script>

<main class="flex flex-col items-center w-screen h-screen p-12 font-jost">
  <section class="flex flex-col w-[50%]">
    <div>
      <div class="flex flex-row items-center pb-6 cursor-default">
        <h1 class="text-4xl">app list</h1>
        <button
          class="ml-auto hover:text-[#FF7F50] hover:underline hover:cursor-pointer"
          onclick={() => applistScreen = !applistScreen}>
        {applistScreen ? "add new app" : "back"}
      </button>
      </div>

    </div>

    {#if applistScreen}
      <div class="flex flex-col w-auto items-start gap-1">
        {#each data.data as item}
          <div class="flex flex-row gap-4 items-center justify-center">
            <form
              method="POST"
              action="?/delete"
              use:enhance={() => {
                return async ({ update }) => {
                  await update();
                };
              }}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit">
                <Trash2 class="size-6 hover:text-red-600 hover:cursor-pointer transition-all ease-in-out" />
              </button>
            </form>
            <Tooltip
              tip={`Chrome: ${item.usercountChrome} | Firefox: ${item.usercountFirefox} | Edge: ${item.usercountEdge}`}
              color="coral"
              right>
              <p class="text-lg hover:cursor-default">{`${item.name} (${item.usercountChrome + item.usercountEdge + item.usercountFirefox} total users)`}</p>
            </Tooltip>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center">
        <form
          method="POST"
          action="?/add"
          class="flex flex-col w-[50%]"
          use:enhance={() => {

            return async ({ result, update }) => {
              if (result.type === 'success') {
                applistScreen = true;
                await update();
              } else if (result.type === 'failure') {
                formError = true;
                await update();
              }
            }

          }}
        >
          <p class="text-lg pb-1">new app name</p>
          <input
            name="name"
            placeholder="enter app name"
          />
          <p class="text-lg pb-1 pt-4">new shortname</p>
          <input
            name="shortname"
            placeholder="enter app shortname"
          />
          <button type="submit" class="mt-4 mr-auto text-[#FF7F50] hover:cursor-pointer hover:underline">submit</button>
        </form>
        {#if form?.error && formError}
          <p class="mt-4 text-red-500">{form.error}</p>
        {/if}
      </div>
    {/if}

  </section>
</main>
