const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const exec = require('child_process').exec;


let g_appParams = null;
ipcRenderer.on('app-params', (event,params) => g_appParams = params);

contextBridge.exposeInMainWorld('fsAPI', {
    async writeFile(path, content, options) {
        return await fs.promises.writeFile(path, content, options);
    },

    getAppParams() {
        return g_appParams;
    },

    downloadScene(sceneFileUrl, dstPath) {
        return new Promise((resolve, reject) => {
            console.log(g_appParams);

            const scenePath = path.join(path.join(g_appParams.paths.packagePath, 'scenes'), dstPath);
            const command = 'node "' + __dirname + `/scene-download.mjs" ${sceneFileUrl} "${scenePath}"`;
            exec(command,
            {},
            (error, stdout, stderr) => {
                console.log(error);
                console.log(stdout);
                console.log(stderr);
            })
            .on('exit', code => {
                if (code !== 0) {
                    reject(`Error downloading scene. Code: ${code}`)
                }
                else {
                    resolve(scenePath);
                }
            })
        })
    },

    getDependencyVersion(name) {
        return process.versions[name];
    },

    revealInFileExplorer(path) {
        ipcRenderer.send('show-in-file-explorer', path);
    }
});
