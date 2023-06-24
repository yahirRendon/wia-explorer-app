const { ipcRenderer } = require("electron");
const filesButton = document.querySelector('.nav-files');
const statsButton = document.querySelector('.nav-stats');
const settingsButton = document.querySelector('.nav-settings');
const reloadButton = document.querySelector('.nav-reload');
const minimizeButton = document.querySelector('.nav-min');
const closeAppButton = document.querySelector('.nav-close');

/**
 * Run once the docuemnt has loaded
 */
document.addEventListener('DOMContentLoaded', function () {

}, false);

/**
 * fload files window
 */
filesButton.addEventListener('click', function () {
   ipcRenderer.send('load-files-window');
});
/**
 * load stats window
 */
statsButton.addEventListener('click', function () {
    ipcRenderer.send('load-stats-window');
 });
 /**
 * load settings window
 */
 settingsButton.addEventListener('click', function () {
    ipcRenderer.send('load-settings-window');
 });
 /**
 * reload the program on click
 */
reloadButton.addEventListener('click', function () {
    ipcRenderer.send('reload-window')
 });
/**
 * minize the window on click
 */
minimizeButton.addEventListener('click', function () {
   ipcRenderer.send('minimize-window');
});

/**
 * close / quite the program on click
 */
closeAppButton.addEventListener('click', function () {
   ipcRenderer.send('close-window');
});



