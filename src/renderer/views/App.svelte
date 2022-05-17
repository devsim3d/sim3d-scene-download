<script>
    import {onMount} from 'svelte';

    let dstSceneName = "test-scene";
    let statusMessage = "";
    let statusClass = "progress";
    let lastScenePath = "";
    let sim3dServerUrl = "https://demo.sim3d.es";
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

<div class="environment-list">
    <table>
        <tr class="table-header">
            <th><h1>Entorno</h1></th>
            <th><h1>Miniatura</h1></th>
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

<input type="text" bind:value={sim3dServerUrl} />
<button on:click={async () => await loadScenes()}>Listar Escenas</button>
<div class="scene-list">
    <table>
        <tr class="table-header">
            <th><h1>Escena</h1></th>
            <th><h1>Nombre</h1></th>
            <th><h1>Vista Previa</h1></th>
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



<p class={statusClass}>{statusMessage}
    {#if lastScenePath !== ""}
        <button on:click={() => launchEnvironment()}>Abrir</button>
    {/if}

</p>


<style>
	
   h1{
  font-size: 15px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 300;
  text-align: left;
  margin-bottom: 0px;
}
	.tbl-header{
  background-color: #27589c;
 }
	
	
	th{
        padding: 15px 15px;
        text-align: left;
        font-weight: 500;
        font-size: 12px;
        /*color: #fff;*/
        text-transform: uppercase;
		
    }
	
    td{
        padding: 15px;
        text-align: left;
        vertical-align:middle;
        font-weight: 300;
        font-size: 12px;
        color: #fff;
        border-bottom: solid 1px rgba(255,255,255,0.1);		
    }
	
	tr {
		color: black;
	}
	

    input {
				margin:10px 0px 10px 0px;
        width: 50%;
        display: block;
				border: 1px solid #1b3258;
			border-radius: 5px;
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
        width: 100%;
        border: 1px solid #1b3258;
        height: 300px;
        overflow: auto;
				border-radius: 5px;
    }

    div.scene-list table {
        width: 100%;
        border-spacing: 0px;
			
			
    }

    div.scene-list table tr.table-header {
        background-image: linear-gradient(#36a9e1, #27589c);
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
        width: 100%;
        border: 1px solid #1b3258;
        height: 300px;
        overflow: auto;
				border-radius: 5px;
    }

    div.environment-list table {
        width: 100%;
        border-spacing: 0px;
			
    }

    div.environment-list table tr.table-header {
        background-image: linear-gradient(#36a9e1, #27589c);
        color: white;
    }

    div.environment-list table tr {
        background-color: #e8f2f5;
    }

    div.environment-list table tr.current {
        background-color: #36a9e1;
        color: white;
    }

    div.environment-list table img {
        width: 100px;
    }
	
		::-webkit-scrollbar {
				width: 6px;
		} 
		::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
		} 
		::-webkit-scrollbar-thumb {
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
		}

button {
  background-image: linear-gradient(#36a9e1, #27589c);
  border: 1px solid #36a9e1;
  border-radius: 4px;
	margin-bottom:10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  direction: ltr;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -.022em;
  line-height: 1.47059;
  min-width: 30px;
  overflow: visible;
  padding: 4px 15px;
  text-align: center;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

button:disabled {
  cursor: default;
  opacity: .3;
}

button:hover {
  background-image: linear-gradient(#36a9e1, #36a9e1);
  border-color: #1482D0;
  text-decoration: none;
}

button:active {
  background-image: linear-gradient(#3D94D9, #0067B9);
  border-color: #006DBC;
  outline: none;
}

	
</style>
