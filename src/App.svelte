<script>
  import { prevent_default } from "svelte/internal";
  import "./app.css";
  import "./classes.scss";

  let lists = getLists();

  function getLists() {
    return fetch("/api/all").then((res) => res.json());
  }

  async function addList(list) {
    const listItems = await fetch(`/api/list/${list}`).then((res) =>
      res.json()
    );
    const filtered = listItems.filter(
      (li) => !items.find((i) => i.name === li)
    );
    items = [...items, ...filtered.map((name) => ({ name, needed: "idk" }))];
  }

  let listName = "";
  let items = [];

  async function saveList() {
    await fetch(
      "/api/put?" +
        new URLSearchParams({
          key: listName,
          value: JSON.stringify(
            items.filter((i) => i.needed === "need").map((i) => i.name)
          ),
        })
    );
    lists = getLists();
  }

  function addItemFromForm(form, needLevel) {
    const newItem = new FormData(form).get("newItem");
    if (!newItem) return;
    items = [
      ...items,
      { name: newItem, needed: needLevel },
    ];
    form.reset();
  }
</script>

<main
  class="flex flex-col overflow-auto items-center gap-6 p-6 h-screen w-screen bg-slate-200">
  <div class="bg-rose-200 rounded p-3">
    <h3>Lists:</h3>
    {#await lists}
      <p>loading...</p>
    {:then lists}
      <ul class="list-disc list-inside">
        {#each lists as list}
          <li><button on:click={() => addList(list)}>{list}</button></li>
        {/each}
      </ul>
    {/await}
  </div>

  <div class="flex gap-5">

    <div class="bg-rose-200 rounded p-3 w-48 flex flex-col">
      <h3>need</h3>
      <ul class="list-disc list-inside h-full">
        {#each items.filter((i) => i.needed === "need") as item}
          <li>
            {item.name}
            <button on:click={() => (item.needed = "idk")}>&gt;</button>
          </li>
        {/each}
      </ul>
      <form
        on:submit|preventDefault={(e) => addItemFromForm(e.target, "need")}
        class="justify-self-end bg-rose-200 rounded p-3">
        <input class="w-full" name="newItem" />
      </form>
    </div>

    <div class="bg-rose-200 rounded p-3 w-48 flex flex-col">
      <h3>idk</h3>
      <ul class="list-disc list-inside h-full">
        {#each items.filter((i) => i.needed === "idk") as item}
          <li>
            <button on:click={() => (item.needed = "need")}>&lt;</button>
            {item.name}
            <button on:click={() => (item.needed = "dont")}>&gt;</button>
          </li>
        {/each}
      </ul>
      <form
        on:submit|preventDefault={(e) => addItemFromForm(e.target, "idk")}
        class="justify-self-end bg-rose-200 rounded p-3">
        <input class="w-full" name="newItem" />
      </form>
    </div>

    <div class="bg-rose-200 rounded p-3 w-48 flex flex-col">
      <h3>dont</h3>
      <ul class="list-disc list-inside h-full">
        {#each items.filter((i) => i.needed === "dont") as item}
          <li>
            <button on:click={() => (item.needed = "idk")}>&lt;</button>
            {item.name}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <form
    on:submit|preventDefault={() => (listName = "")}
    class="flex gap-3 bg-rose-200 rounded p-3">
    <input bind:value={listName} />
    <button type="submit" on:click={saveList} class="btn">Save need</button>
  </form>
</main>

<style>
</style>
