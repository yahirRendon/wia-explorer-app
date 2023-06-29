const filesButton = document.querySelector('.nav-files');
const statsButton = document.querySelector('.nav-stats');
const settingsButton = document.querySelector('.nav-settings');
const minimizeButton = document.querySelector('.nav-min');
const closeAppButton = document.querySelector('.nav-close');

const pathDropDiv = document.querySelector('#path-drop');

let pathClientFolder;


const getClientPathFolder = async () => {
    pathClientFolder = await window.api.getPath()
    console.log(pathClientFolder) // should print out path folder
    pathDropDiv.innerHTML = pathClientFolder;
}

/*
 * Run once the docuemnt has loaded
*/
document.addEventListener('DOMContentLoaded', function () {
    settingsButton.style.backgroundColor = "white";
    getClientPathFolder();
    updateClientFolderPath();
    
}, false);

/**
 * control drag and drop of file path
 */

function updateClientFolderPath() {
    const tempPath = async () => {
       pathClientFolder = await window.api.getPath()
    //    console.log(pathClientFolder) // prints out 'pong'
       pathDropDiv.innerHTML = pathClientFolder;
     }
     tempPath();
 
    pathDropDiv.addEventListener('dragover', (e) => {
       e.stopPropagation();
       e.preventDefault();
    });
 
    pathDropDiv.addEventListener('drop', (e) => {
       e.stopPropagation();
       e.preventDefault();
       
       pathClientFolder = e.dataTransfer.files[0].path;
       pathDropDiv.innerHTML = pathClientFolder;
       window.api.sendPath(pathClientFolder);
    });
 }
 






/// basic nav buttons
/**
 * fload files window
 */
filesButton.addEventListener('click', function () {
    // ipcRenderer.send('load-files-window', ['c:yahir/path']);
    
    window.api.openFilesWindow();
    // window.api.sendPath('yo whats up');
   
       
    
    
 });
 /**
  * load stats window
  */
 statsButton.addEventListener('click', function () {
    window.api.openStatsWindow();
  });
  /**
  * load settings window
  */
  settingsButton.addEventListener('click', function () {
    window.api.openSettingsWindow();
  });
 /**
  * minize the window on click
  */
 minimizeButton.addEventListener('click', function () {
    window.api.minimizeWindow();
 });
 
 /**
  * close / quite the program on click
  */
 closeAppButton.addEventListener('click', function () {
    window.api.closeWindow();
 });
 