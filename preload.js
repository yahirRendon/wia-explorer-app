const { contextBridge, ipcRenderer } = require('electron')

/**
 * create api that connects the main.js and all front end js files (index.js, stats.js, settings.js)
 */
contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  openFilesWindow: () => ipcRenderer.send('load-files-window'),
  openStatsWindow: () => ipcRenderer.send('load-stats-window'),
  openSettingsWindow: () => ipcRenderer.send('load-settings-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  sendPath: (message) => ipcRenderer.send('send-path', message),
  getPath: () => ipcRenderer.invoke('get-path'),
  getData: () => ipcRenderer.invoke('get-data'),
  openSitch: (message) => ipcRenderer.send('open-sitch', message),
  openFolder: (message) => ipcRenderer.send('open-folder', message)
});

