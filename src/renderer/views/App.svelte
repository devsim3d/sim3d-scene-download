<script>
    import {onMount} from 'svelte';

    //let sceneUrl = "http://127.0.0.1:5005/api/v1/bg2scene/2/scene.vitscnj";
    let dstSceneName = "test-scene";
    let statusMessage = "";
    let statusClass = "progress";
    let lastScenePath = "";
    let sim3dServerUrl = "http://127.0.0.1:5005";
    let scenes = [];
    let environments = [];
    let currentEnv = "";

    const loadScenes = async () => {
        try {
            statusMessage = "Obteniendo lista de escenas";
            statusClass = "progress";
            const scenesList = await window.fsAPI.getAvailableScenes(sim3dServerUrl);
            scenes = scenesList.scenes;
            statusMessage = "";
            statusClass = "success";
        }
        catch (err) {
            statusMessage = err.message;
            statusClass = "fail";
        }
    }

    const downloadScene = async (identifier) => {
        try {
            statusMessage = "Descargando escena";
            statusClass = "progress"
            const sceneUrl = (sim3dServerUrl[sim3dServerUrl.length - 1] !== '/' ?
                sim3dServerUrl + '/' : sim3dServerUrl) +
                `api/v1/bg2scene/${identifier}/scene.vitscnj`;
            const sceneName = `scene-${identifier}`;
            const scenePath = await window.fsAPI.downloadScene(sceneUrl,sceneName);
            statusClass = "success";
            statusMessage = `Escena descargada en la ruta ${scenePath}. Abriendo entorno...`;
            lastScenePath = scenePath;

            await fsAPI.launchEnvironment();
            
        }
        catch(err) {
            statusClass = "fail"
            statusMessage = "Error descargando la escena. Comprueba la URL del servidor";
            console.error(err);
        }
    }

    const launchEnvironment = async () => {
        await fsAPI.launchEnvironment();
    }

    const openScenePath = () => {
        window.fsAPI.revealInFileExplorer(lastScenePath);
    }

    const setEnvironment = async (name) => {
        currentEnv = await window.fsAPI.setCurrentEnvironment(name);
    }

    onMount(async () => {
        environments = await window.fsAPI.getEnvironments();
        currentEnv = await window.fsAPI.getCurrentEnvironment();
    })

</script>

<input type="text" bind:value={sim3dServerUrl} />
<button on:click={async () => await loadScenes()}>Listar Escenas</button>
<div class="scene-list">
    <table>
        <tr class="table-header">
            <th>Escena</th>
            <th>Nombre</th>
            <th>Vista Previa</th>
        </tr>
        {#each scenes as scene}
            <tr>
                <th>
                    {scene.id}
                    <button on:click={async () => await downloadScene(scene.id)}>Descargar</button>
                </th>
                <th>{scene.name}</th>
                <th><img src={scene.screenshot} alt={scene.name} /></th>
            </tr>
        {/each}
    </table>
</div>

<div class="environment-list">
    <table>
        <tr class="table-header">
            <th>Entorno</th>
            <th>Miniatura</th>
        </tr>
        {#each environments as env}
            <tr class={env.name === currentEnv ? "current" : ""} on:click={async () => await setEnvironment(env.name)}>
                <th>
                    {env.name}
                </th>
                <th><img src={env.thumb} alt={env.thumb} /></th>
            </tr>
        {/each}
    </table>
</div>

<p class={statusClass}>{statusMessage}
    {#if lastScenePath !== ""}
        <button on:click={() => launchEnvironment()}>Abrir</button>
    {/if}

</p>


<style>
    h1 {
        font-family: sans-serif;
    }

    input {
        width: 100%;
        display: block;
    }

    p.progress {
        color: darkgray;
    }

    p.success {
        color: green;
    }
    
    p.fail {
        color: red;
    }

    div.scene-list {
        width: 95%;
        border: 1px solid darkgray;
        height: 200px;
        overflow: auto;
    }

    div.scene-list table {
        width: 100%;
        border-spacing: 0px;
    }

    div.scene-list table tr.table-header {
        background-color: rgb(94, 94, 94);
        color: white;
    }

    div.scene-list table tr {
        background-color: #e8f2f5;
    }

    div.scene-list table img {
        width: 100px;
    }

    div.scene-list {
        margin-bottom: 20px;
    }




    div.environment-list {
        width: 95%;
        border: 1px solid darkgray;
        height: 200px;
        overflow: auto;
    }

    div.environment-list table {
        width: 100%;
        border-spacing: 0px;
    }

    div.environment-list table tr.table-header {
        background-color: rgb(94, 94, 94);
        color: white;
    }

    div.environment-list table tr {
        background-color: #e8f2f5;
    }

    div.environment-list table tr.current {
        background-color: #696d6e;
        color: white;
    }

    div.environment-list table img {
        width: 100px;
    }

</style>
