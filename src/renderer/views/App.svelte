<script>
    let sceneUrl = "http://127.0.0.1:5005/api/v1/bg2scene/2/scene.vitscnj";
    let dstSceneName = "test-scene";
    let statusMessage = "";

    const downloadScene = async () => {
        try {
            await window.fsAPI.downloadScene(sceneUrl,dstSceneName);
            console.log("Scene downloaded");
            statusMessage = "Scene downloaded";
        }
        catch(err) {
            statusMessage = "Error downloading scene. Check the scene URL";
            console.error(err);
        }
    }
</script>

<h1>bg2 enginie scene download</h1>
<p>Use this tool to download a bg2 scene <span>.vitscnj</span> scene from a HTTP server</p>
<input type="text" bind:value={sceneUrl} />
<input type="text" bind:value={dstSceneName} />
<button on:click={async () => await downloadScene()}>Download scene</button>
<p>{statusMessage}</p>
<style>
    h1 {
        font-family: sans-serif;
    }

    input {
        width: 100%;
        display: block;
    }

</style>
