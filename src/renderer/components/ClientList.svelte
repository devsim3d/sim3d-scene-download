<script>
    
    import { onMount } from 'svelte';

    let clientList = [];

    export let selectedClient = -1;

    onMount(async () => {
        setTimeout(() => {
            clientList = [
                {
                    id: 1,
                    name: "Muebles Paco"
                },
                {
                    id: 2,
                    name: "Muebles Antonio"
                },
                {
                    id: 3,
                    name: "Muebles Beatriz"
                },
                {
                    id: 4,
                    name: "Muebles Luca"
                }
            ];

            if (clientList.length) {
                selectedClient = clientList[0].id;
            }
        }, 1000);
    })
</script>

<select>
    {#each clientList as client }
        <option value={client.id}>{client.name}</option>
    {/each}
</select>