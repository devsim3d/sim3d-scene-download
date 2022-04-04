const { contextBridge } = require('electron');
const fs = require('fs');

const exec = require('child_process').exec;

contextBridge.exposeInMainWorld('fsAPI', {
    async writeFile(path, content, options) {
        return await fs.promises.writeFile(path, content, options);
    },

    downloadScene(sceneFileUrl, dstPath) {
        return new Promise((resolve, reject) => {
            exec('node ' + __dirname + `/scene-download.mjs "${sceneFileUrl}" "${dstPath}"`,
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
                    resolve();
                }
            })
        })
    },

    getDependencyVersion(name) {
        return process.versions[name];
    }
});
