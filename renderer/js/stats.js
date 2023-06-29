const filesButton = document.querySelector('.nav-files');
const statsButton = document.querySelector('.nav-stats');
const settingsButton = document.querySelector('.nav-settings');
const minimizeButton = document.querySelector('.nav-min');
const closeAppButton = document.querySelector('.nav-close');

let pathClientFolder;


const getClientPathFolder = async () => {
    pathClientFolder = await window.api.getPath()
    console.log(pathClientFolder) // should print out path folder
}

/*
 * Run once the docuemnt has loaded
*/
document.addEventListener('DOMContentLoaded', function () {
    statsButton.style.backgroundColor = "white";
    getClientPathFolder();
    
}, false);






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
 