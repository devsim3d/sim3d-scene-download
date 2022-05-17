const {app, BrowserWindow, ipcMain, shell, protocol} = require('electron');
const path = require('path');

const exec = app.getPath("exe");
let package = exec.substring(0,exec.lastIndexOf(path.sep));
if (/electron(.exe)?$/.test(exec)) {
    // Debug mode: running the node_modules electron version
    package = path.resolve(path.join(package, '../../../'));
}

const appParams = {
    paths: {
        execPath: exec,
        packagePath: package,
        home: app.getPath("home"),
        cache: app.getPath("cache"),
        temp: app.getPath("temp"),
        appData: app.getPath("appData"),
        userData: app.getPath("userData"),
        documents: app.getPath("documents"),
        downloads: app.getPath("downloads")
    }
};

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        icon:'images/favicon.svg',
        webPreferences: {
            preload: path.join(__dirname, 'src/preload/index.js'),
            webSecurity: false
        }
    });

    win.loadFile('index.html');

    win.webContents.send('app-params', appParams);

    ipcMain.on('show-in-file-explorer', (event, filePath) => {
        shell.showItemInFolder(filePath);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

