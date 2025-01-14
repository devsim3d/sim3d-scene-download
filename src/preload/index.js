const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const Sim3DAPI = require('./Sim3DAPI');

const exec = require('child_process').exec;


let g_appParams = null;
ipcRenderer.on('app-params', (event,params) => g_appParams = params);


const getEnvironments = async () => {
    const environmentsFilePath = path.join(g_appParams.paths.packagePath, "environments");
    const elements = fs.readdirSync(environmentsFilePath)
        .filter(dir => {
            return fs.statSync(path.join(environmentsFilePath,dir)).isDirectory()
        })
        .map(dir => {
            const appPath = path.join(environmentsFilePath,dir);
            const exec = path.join(appPath,fs.readdirSync(appPath).find(item => {
                if (path.extname(item) === '.exe') {
                    return true;
                }
            }))
            return {
                name: dir,
                exec,
                thumb: path.join(appPath,'thumb.png')
            }
        });
    return elements;
}

let g_environmentName = null;

const getCurrentEnvironment = async () => {
    if (!g_environmentName) {
        const envs = await getEnvironments();
        if (envs.length>0) {
            g_environmentName = envs[0].name;
        }
    }
    return g_environmentName;
}

contextBridge.exposeInMainWorld('fsAPI', {
    async writeFile(path, content, options) {
        return await fs.promises.writeFile(path, content, options);
    },

    getAppParams() {
        return g_appParams;
    },

    async getCurrentEnvironment() {
        return await getCurrentEnvironment();
    },

    async getEnvironments() {
        return await getEnvironments();
    },

    async setCurrentEnvironment(name) {
        const envs = await getEnvironments();
        if (envs.find(e => e.name === name)) {
            g_environmentName = name;
            return g_environmentName;
        }
        else {
            throw new Error("Environment not found");
        }
    },

    async launchEnvironment() {
        const currentEnvName = await getCurrentEnvironment();
        const envData = (await getEnvironments()).find(env => {
            console.log(env);
            if (env.name === currentEnvName) {
                return true;
            }
        });
        console.log('Launching environment ' + envData.exec);
        exec(`"${envData.exec}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
            }
            console.log(stdout);
            console.log(stderr);
        });
    },

    downloadScene(sceneFileUrl) {
        return new Promise(async (resolve, reject) => {
            
            const env = await getCurrentEnvironment();

            const scenePath = path.join(g_appParams.paths.packagePath, 'scene');
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

    async getAvailableScenes(serverUrl, clientId) {
        const sim3dApi = new Sim3DAPI(serverUrl, path.join(g_appParams.paths.temp,'scene-lists'));
        const scenes = await sim3dApi.getSceneList(clientId);
        return scenes;
    },

    getDependencyVersion(name) {
        return process.versions[name];
    },

    revealInFileExplorer(path) {
        ipcRenderer.send('show-in-file-explorer', path);
    }
});
