// const { ipcRenderer } = require("electron");


// assign menu elements
const filesButton = document.querySelector('.nav-files');
const statsButton = document.querySelector('.nav-stats');
const settingsButton = document.querySelector('.nav-settings');
const minimizeButton = document.querySelector('.nav-min');
const closeAppButton = document.querySelector('.nav-close');

const pathDropDiv = document.querySelector('#path-drop');

let pathClientFolder;


const getClientPathFolder = async () => {
   pathClientFolder = await window.api.getPath()
   console.log(pathClientFolder) // prints out 'pong'
 }



/**
 * Run once the docuemnt has loaded
 */
document.addEventListener('DOMContentLoaded', function () {

   // check which page user is on to run specific functions
   let page = document.body.id;

   switch(page) {
      case('files-page'):
         filesButton.style.backgroundColor = "white";
         getClientPathFolder()
         // console.log(pathClientFolder);
         
      break;
      case('stats-page'):
         statsButton.style.backgroundColor = "white";
      break;
      case('settings-page'):
         settingsButton.style.backgroundColor = "white";
         
         getClientPathFolder();
         updateClientFolderPath();

      break;
      default:
         console.log('no page known page detected');
      break;
   }

}, false);




/**
 * fload files window
 */
filesButton.addEventListener('click', function () {
   // ipcRenderer.send('load-files-window', ['c:yahir/path']);
   
   window.api.openFiles();
   // window.api.sendPath('yo whats up');

   
});
/**
 * load stats window
 */
statsButton.addEventListener('click', function () {
   //  ipcRenderer.send('load-stats-window');
   window.api.openStats();
   // getClientPathFolder()
 });
 /**
 * load settings window
 */
 settingsButton.addEventListener('click', function () {
   //  ipcRenderer.send('load-settings-window');
   window.api.openSettings();
 });
/**
 * minize the window on click
 */
minimizeButton.addEventListener('click', function () {
   // ipcRenderer.send('minimize-window');
   window.api.minimizeWindow();
});

/**
 * close / quite the program on click
 */
closeAppButton.addEventListener('click', function () {
   // ipcRenderer.send('close-window');
   window.api.closeWindow();
});


function updateClientFolderPath() {
   const tempPath = async () => {
      pathClientFolder = await window.api.getPath()
      console.log(pathClientFolder) // prints out 'pong'
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
