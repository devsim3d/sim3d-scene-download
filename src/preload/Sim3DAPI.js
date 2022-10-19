const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');

const downloadFile = async (fileUrl,dstPath,downloadProtocol) => {
    return new Promise((resolve,reject) => {
        const fileName = path.basename(url.parse(fileUrl).pathname);
        const dstFilePath = path.join(dstPath,fileName);
        const file = fs.createWriteStream(dstFilePath);
        downloadProtocol.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                const err = new Error(response.statusMessage);
                err.code = response.statusCode;
                file.close(() => {
                    fs.unlink(dstFilePath, () => reject(err));
                })
            }
            else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        resolve(dstFilePath);
                    })
                })
            }
        }).on('error', err => {
            file.close(() => {
                fs.unlink(dstFilePath, () => reject(err));
            })
        });
    })
}

const createDstPath = async (dstPath) => {
    if (!fs.existsSync(dstPath)) {
        await fs.promises.mkdir(dstPath, { recursive: true });
    }
}

class Sim3DAPI {
    constructor(serverAddress,tmpPath) {
        this._tmpPath = tmpPath;

        this._downloadProtocol = /https\:/i.test(serverAddress) ? https : (/http\:/i.test(serverAddress) ? http : null);
        if (!this._downloadProtocol) {
            throw new Error("Unsupported URL protocol. Accepted protocols are http or https");
        }

        this._serverAddress = serverAddress;
        if (this._serverAddress[this._serverAddress.length - 1] !== '/') {
            this._serverAddress += '/';
        }
    }

    async getSceneList(clientId = "") {
        const endpoint = this._serverAddress + 'api/v1/scenes?clientId=' + clientId;
        const dstPath = path.join(this._tmpPath,'sim3d-scene-download');
        await createDstPath(dstPath);
        const dstFilePath = await downloadFile(endpoint, dstPath, this._downloadProtocol);
        const fileContent = await fs.promises.readFile(dstFilePath, {encoding: 'utf-8'});
        return JSON.parse(fileContent);
    }
}

module.exports = Sim3DAPI;