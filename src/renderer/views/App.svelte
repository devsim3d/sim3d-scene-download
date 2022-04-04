<script>
    let sceneUrl = "http://127.0.0.1:5005/api/v1/bg2scene/2/scene.vitscnj";
    let dstSceneName = "test-scene";
    let statusMessage = "";
    let statusClass = "progress";
    let lastScenePath = "";

    const downloadScene = async () => {
        try {
            statusMessage = "Downloading scene";
            statusClass = "progress"
            const scenePath = await window.fsAPI.downloadScene(sceneUrl,dstSceneName);
            statusClass = "success";
            statusMessage = `Scene downloaded at ${scenePath}`;
            lastScenePath = scenePath;
            
        }
        catch(err) {
            statusClass = "fail"
            statusMessage = "Error downloading scene. Check the scene URL";
            console.error(err);
        }
    }

    const openScenePath = () => {
        window.fsAPI.revealInFileExplorer(lastScenePath);
    }
</script>

<h1>bg2 enginie scene download</h1>
<p>Use this tool to download a bg2 scene <span>.vitscnj</span> scene from a HTTP server</p>
<input type="text" bind:value={sceneUrl} />
<input type="text" bind:value={dstSceneName} />
<button on:click={async () => await downloadScene()}>Download scene</button>
<p class={statusClass}>{statusMessage}
    {#if lastScenePath !== ""}
        <button on:click={() => openScenePath()}>Reveal in file explorer</button>
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

</style>
