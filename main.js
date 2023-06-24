// main process as backend. renderer.js as front end
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin'; // win32, linux
let mainWindow;
let statsWindow;

// create stats window no currently being used but this is how you'd do it. 
function createStatsWindow() {
    statsWindow = new BrowserWindow({
        title: "client stats",
        width: isDev ? 1000 : 600,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false,
        autoHideMenuBar: true,
        icon: "/renderer/images/icons/icon.png"
    });

    statsWindow.loadFile(path.join(__dirname, './renderer/stats.html'));
}

// create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "frameless app",
        width: isDev ? 1000 : 600,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false,
        autoHideMenuBar: true,
        icon: "images/icons/icon.png"
    });

    // open dev tools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/html/index.html'));
}


app.whenReady().then(() => {
    createMainWindow();

    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

/**
 * load files/index html into main window
 */
ipcMain.on('load-files-window', () => {
    // this opens a new window
    // createStatsWindow;

    // this loads the current window with stats.html
    mainWindow.loadFile(path.join(__dirname, './renderer/html/index.html'));
});

/**
 * load stats html into main window
 */
ipcMain.on('load-stats-window', () => {
    // this opens a new window
    // createStatsWindow;

    // this loads the current window with stats.html
    mainWindow.loadFile(path.join(__dirname, './renderer/html/stats.html'));
});

/**
 * load files/index html into main window
 */
ipcMain.on('load-settings-window', () => {
    // this opens a new window
    // createStatsWindow;

    // this loads the current window with stats.html
    mainWindow.loadFile(path.join(__dirname, './renderer/html/settings.html'));
});
/**
 * reload the mainWindow
 */
ipcMain.on('reload-window', () => {
    // app.relaunch();
    mainWindow.webContents.reloadIgnoringCache()
});
/**
 * minimize window
 */
ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
});
/**
 * close application
 */
ipcMain.on('close-window', () => {
    app.quit();
});


