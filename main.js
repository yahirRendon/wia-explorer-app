/**
 * main process as backend. 
 */
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const fs = require('fs');
const { shell } = require('electron') // deconstructing assignment
const os = require('os');

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin'; // win32, linux
let mainWindow;
let statsWindow;

// path to client folder
var regex = /\\/g;
var userHomeDirectory = os.homedir().replace(regex, '/');
let pathClientFolder = userHomeDirectory + "/Dropbox/WIA/Public/WIA L&I Intakes/TERI'S L&I CLIENTS"; // default path to client folder
pathClientFolder = userHomeDirectory + "/OneDrive/Desktop/WIA-Clients"; // for testing and dummy data

/**
 * create stats window not currently being used but this is how you'd do it.
 */
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
        icon: "renderer/images/icons/icon.png"
    });

    statsWindow.loadFile(path.join(__dirname, './renderer/stats.html'));
}

/**
 * create the main window
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "frameless app",
        width: isDev ? 1000 : 600,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
        autoHideMenuBar: true,
        icon: "renderer/images/icons/icon.png"
    });

    // open dev tools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/html/index.html'));
}

/**
 * create the main window when able to
 */
app.whenReady().then(() => {
    createMainWindow();

    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

/**
 * quite the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

/**
 * load files/index html into main window
 */
ipcMain.on('load-files-window', (events, args) => {
    // this opens a new window
    // createStatsWindow;

    // this loads the current window with disired .html file (index.html)
    mainWindow.loadFile(path.join(__dirname, './renderer/html/index.html'));
});

/**
 * load stats html into main window
 */
ipcMain.on('load-stats-window', () => {
    // this opens a new window
    // createStatsWindow;

    // this loads the current window with disired .html file (stats.html)
    mainWindow.loadFile(path.join(__dirname, './renderer/html/stats.html'));
});

/**
 * load settings html into main window
 */
ipcMain.on('load-settings-window', () => {
    // this opens a new window
    // createStatsWindow;

    /// this loads the current window with disired .html file (settings.html)
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
 * minimize the main window
 */
ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
});
/**
 * close the application
 */
ipcMain.on('close-window', () => {
    app.quit();
});


/**
 * receive the path to client folder from a front end
 * js file and set it to the global pathClientFolder variable
 */
ipcMain.on('send-path', (events, data) => {
    pathClientFolder = data;
});

/**
 * send the path to client folder (pathClientFolder vairable) 
 * to front end js file requesting it
 */
ipcMain.handle('get-path', () => pathClientFolder)

/**
 * send the data gathered fromt he getAllClientData() function
 * to the front end js file requesting it
 */
ipcMain.handle('get-data', () => getAllClientData())
/**
 * receive request to open client sitch
 * 
 * @param events    type of event
 * @param data      array with two paths
 *                  [0] is the path to sitch if unable to open
 *                  will attemp to open [1] path to client folder
 */
ipcMain.on('open-sitch', (events, data) => {
      try {
        fs.existsSync(data[0])
        shell.openPath(data[0], { activate: true })
    } catch(err) {
        shell.openExternal(data[1], { activate: true })
    }
    
});

/**
 * receive request to open client folder
 * 
 * @param events    type of event
 * @param data      array with two paths
 *                  [0] is the path to specific client claim folder
 *                  if unable to open will open [1] path to client folder
 */
ipcMain.on('open-folder', (events, data) => {
    shell.openExternal(data[0], { active: true }).then(() => {
        // success handled here
        }).catch((e) => {
        console.log(e.message, data[0], 'Opening', data[1], )
        shell.openExternal(data[1], { active: true });
        });
 
});

/**
 * function that returns the folder names within the folder
 * provided in the parameter
 * @param {String} startPath    the path to folder 
 * @returns {object} names within folder
 */
function getNameOfFoldersAt(startPath) {
    let folderNames;
    try {
        folderNames = fs.readdirSync(startPath);
    } catch(err) {
        console.log("error:", "getNameOfFoldersAt:", startPath)
    }
    return folderNames;
}

/**
 * function that returns the data within the folder provided 
 * in the parameter. 
 * 
 * @param {String} pathFolder the path to folder
 * @returns {object}    the data within the given folder
 */
function getClientDataAt(pathFolder) {
    let folders = getNameOfFoldersAt(pathFolder);
    let data = [];

    // array does not exist, is not an array, or is empty
    if (!Array.isArray(folders) || !folders.length) {
        return data
    }
    
    folders.forEach(folder => {
        // return if not a directory and non client folder
        let isDir = fs.lstatSync( pathFolder + '/' + folder).isDirectory()
        if (!isDir || folder.includes('#')) {
            return;
        }
        
        // try to access client.json and create jsonObj
        try {
            // create json object from json file in client folder
            let fileJSON = pathFolder + '/' + folder + '/client-data.json';
            let json = JSON.parse(fs.readFileSync(fileJSON));
            // let json = JSON.parse(clientData);
            data.push({
                // sometimes you need json[0] other times you don't... weird.
                "id": 0,
                "name": json[0].name,
                "dob": json[0].dob,
                "phone": json[0].phone,
                "claims": json[0].claims,
                "rep": json[0].rep,
                "status": json[0].status
            })
        }
        catch (err) {
            console.log("error", folder, " missing json.");
            // basic data absent json file
            data.push({
                "id": 0,
                "name": folder,
                "dob": "",
                "phone": "",
                "claims": [""],
                "rep": "",
                "status": ""
            })
        }
    });
    return data;    
}
/**
 * function that collects and creates object that contains client data
 * search through clients folder for names and then searches for client-data.json
 * within client folder to obtain data. Also goes into #Dead files
 * 
 * @returns {object}    consists of id, name, phone, dob, claim numbers, dois, rep, status 
 */
function getAllClientData() {
    // get data from main client folder (open clients)
    let data = getClientDataAt(pathClientFolder);
    // add data from #Dead folder (dead clients)
    data = data.concat(getClientDataAt(pathClientFolder + '/#Dead'));
    // sort by client name
    data.sort(compare);
    // update id values based on position in alphabetical order
    let idNum = 0;
    data.forEach(element => {
        element.id = idNum;
        idNum++;
    });
     return data
}

/**
 * function for sorting objects by name
 * 
 * @param {object} a    first object
 * @param {object} b    second object
 * @returns 
 */
function compare(a, b) {
    // to normalize values
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
  
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }