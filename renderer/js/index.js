/**
 * front end / renderer
 */

// navigation elements
const filesButton = document.querySelector('.nav-files');
const statsButton = document.querySelector('.nav-stats');
const settingsButton = document.querySelector('.nav-settings');
const minimizeButton = document.querySelector('.nav-min');
const closeAppButton = document.querySelector('.nav-close');

// client template elements
const clientCardTemplate = document.querySelector("[data-client-template]");
const clientCardContainer = document.querySelector("[data-client-container]");

// search elements
const searchTerm = document.querySelector(".search-term");
const searchNotes = document.querySelector(".search-notes");

// footer elements for client totals
const clientCountTotal = document.querySelector(".client-count-total");
const clientCountYahir = document.querySelector(".client-count-yahir");
const clientCountAmber = document.querySelector(".client-count-amber");
const clientCountShirley = document.querySelector(".client-count-shirley");
const clientCountUnassigned = document.querySelector(".client-count-unassigned");

let pathClientFolder;           // the path to folder/directory containing client folders     
let data;                       // holds list of objects made of of client data

// search features
let searchInput = "";       // tracks characters that make up search terms
let indexVisibleArray = 0;      // tracks list of index positions for clients within search term
let indexClient = 0;            // track the current index position of selected client within indexVisibleArray

// count number of clients
let numAmberClients = 0;        // the number of Amber clients found in clients folder
let numShirleyClients = 0;      // the number of Shirley clients found in clients folder 
let numTotalClients = 0;        // the number of total clients found in clients folder
let numUnassignedClients = 0;   // the number of clients with no rep found in clients folder
let numClientsYahir = 0;        // the number of Yahir clients found in clients folder

/**
 * function for getting the path to the folder/directory containing all client folders
 * this is sent to main.js via the preloader.js
 * 
 * @returns {String}    path to clients folder     
 */
const getClientPathFolder = async () => {
    pathClientFolder = await window.api.getPath()
}

/**
 * function for getting all data for clients. This is then assigned to the data variable
 * this is sent to main.js via the preloader.js
 * 
 * @returns {String}    path to clients folder     
 */
const getAllClientData = async () => {
    data = await window.api.getData();
    // generatee client cards based on html template design
    setClientCards();
    // count clients for individual representatives
    clientCount();
}

/**
 * Run once the docuemnt has loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    filesButton.style.backgroundColor = "white";

    getClientPathFolder();
    getAllClientData();
}, false);


/**
 * display index.html when the files button is clicked in nav bar
 */
filesButton.addEventListener('click', function () {
    window.api.openFilesWindow();
});
/**
 * display stats.html when the stats button is clicked in nav bar
 */
statsButton.addEventListener('click', function () {
    window.api.openStatsWindow();
});
/**
 * display settings.html when the files button is clicked in nav bar
 */
settingsButton.addEventListener('click', function () {
    window.api.openSettingsWindow();
});

/**
 * minimize the window when minius button is clicked in nav bar
 */
minimizeButton.addEventListener('click', function () {
    window.api.minimizeWindow();
});
/**
 * close the window when the X button is clicked in nav bar
 */
closeAppButton.addEventListener('click', function () {
    window.api.closeWindow();
});


/**
 * generate individual clients per html template to display and interact with
 * 
 * @returns {object}    object with client information as well as the client card itself
 */
function setClientCards() {
    // array does not exist, is not an array, or is empty
    if (!Array.isArray(data) || !data.length) {
        searchNotes.classList.remove("hide");
        searchNotes.innerHTML = "No clients found within folder:<br>" + pathClientFolder + "<br><br>Update path in settings." 
    }
    clients = data.map(client => {
        // get template elements
        const card = clientCardTemplate.content.cloneNode(true).children[0];
        const clientName = card.querySelector("[data-name]");
        const clientDob = card.querySelector("[data-dob]");
        const clientPhone = card.querySelector("[data-phone]");
        const clientClaims = card.querySelector(".claims-container");

        let expandable = true; // track if cards shows/hide claim details

        // update tempalte fields
        clientName.innerHTML = client.name;
        clientDob.innerHTML = client.dob;
        clientPhone.innerHTML = client.phone;

        // loop through claims, create divs, and handle click events
        for (let i = 0; i < client.claims.length; i++) {
            // create div with class claims
            var divClaim = document.createElement("div");
            divClaim.classList.add("claims");
            // create div to hold claim text and eappend
            var divClaimText = document.createElement("div");
            divClaimText.innerText = client.claims[i][0];
            divClaim.appendChild(divClaimText);
            clientClaims.appendChild(divClaim);

            // create div and append for holding doi text
            var divDoi = document.createElement("div");
            divDoi.innerText = client.claims[i][1];
            divDoi.classList.add("dois");
            clientClaims.appendChild(divDoi);

            /**
             * left click open client folder or claim folder 
             * if more than one claim
             */
            divClaimText.addEventListener('click', function () {
                expandable = false;

                let clientFolder = pathClientFolder + '/' + client.name;
                let clientFolderClaim = clientFolder;
                if (client.claims.length > 1) {
                    clientFolderClaim += '/' + client.claims[i][0];
                }

                if(client.status == "dead") {
                    clientFolder = pathClientFolder + '/%23Dead/' + client.name;
                    clientFolderClaim = clientFolder;
                    if (client.claims.length > 1) {
                        clientFolderClaim += '/' + client.claims[i][0];
                    }
                }
                window.api.openFolder([clientFolderClaim, clientFolder]);
            });

            /**
             * right click copy claim number to clipboard
             */
            divClaimText.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                navigator.clipboard.writeText(client.claims[i][0])
                return false;
            }, false);
        }

        /**
         * left click name to open sitch. takes priority over
         * claim detail expansion
         */
        clientName.addEventListener('click', function () {
            expandable = false;
            let pathToSitch = pathClientFolder + '/' + client.name + '/' + client.name + '.docx';
            let pathToFolder = pathClientFolder + '/' + client.name;
            if(client.status == 'dead') {
                pathToSitch = pathClientFolder + '/#Dead/' + client.name + '/' + client.name + '.docx';
                pathToFolder = pathClientFolder + '/%23Dead/' + client.name;
            }

            window.api.openSitch([pathToSitch, pathToFolder]);
        });

        /**
        * right click dob to copy to clipboard
        */
        clientDob.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            navigator.clipboard.writeText(client.dob)
            return false;
        }, false);

        /**
         * right click on dob doesn't expand claim info
         */
        clientDob.addEventListener('click', function () {
            expandable = false;
        });

        /**
         * right click on phone doesn't expand claim info
         */
        clientPhone.addEventListener('click', function () {
            expandable = false;
        });

        /**
         * left click on card hide/show claim details
         * only if name or claim is no clicked
         */
        card.addEventListener('click', function () {
            if (expandable) {
                let isShowing = clientClaims.classList.contains('hide');
                clientClaims.classList.toggle('hide', !isShowing);
            }
            expandable = true;
        });

        /**
         * only show open claims
         */
        if(client.status == "dead") {
            card.classList.add("hide")
        }

        // update card
        clientCardContainer.append(card)

        // return certain data values
        return {
            id: client.id,
            name: client.name,
            dob: client.dob,
            phone: client.phone,
            claims: client.claims,
            rep: client.rep,
            status: client.status,
            element: card
        }
    });
}

/**
 * on key down prevent arrow and space default behavior
 */
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1 &&
        searchInput.length > 0) {
        e.preventDefault();
    }

    // convert input keys to lowercase for uniformity
    const value = e.key.toLowerCase();

    let enterPressed = false; // track enter pressed
    searchNotes.classList.add("hide");

    if (e.ctrlKey) {
        if (value == 'c') {
            return;
        }
    }

    // allow backspace function
    if (value == "backspace") {
        if (searchInput.length > 0) {
            searchInput = searchInput.substring(0, searchInput.length - 1);
        }
    }
    // allow delete function
    else if (value == 'delete') {
        searchInput = "";
    }
    // allow enter to open sitch
    else if (value == "enter") {
        enterPressed = true;

    }
    else if (value == 'arrowdown') {
        indexVisibleArray++;
    }
    else if (value == 'arrowup') {
        indexVisibleArray--;
    }
    // update search text keyword
    else if (value.length === 1) {
        searchInput += value;
    }

    searchTerm.innerHTML = searchInput;

    // loop through clients to search and toggle visibility
    let visibleArray = [];
    clients.forEach(client => {

        // collect searchable tags
        let searchableTags = "";
        for (let i = 0; i < client.claims.length; i++) {
            searchableTags += client.claims[i][0] + " ";
        }

        // if within search toggle visibility
        const isVisible = client.name.toLowerCase().includes(searchInput) || searchableTags.toLocaleLowerCase().includes(searchInput)
        client.element.classList.toggle("hide", !isVisible)

        // if not searching hide dead files. The appear during search
        if(searchInput.length == 0 && client.status == "dead") {
            client.element.classList.add("hide")
        }

        // generate visible array and update text color
        if (isVisible) {
            visibleArray.push(client.id);
            client.element.children[0].style.color = "black";
        }
    });

    // if search is being used (user is typing)
    if (searchInput.length > 0) {
        // set proper index pos
        if (indexVisibleArray >= visibleArray.length) {
            indexVisibleArray = 0;
        }
        if (indexVisibleArray < 0) {
            indexVisibleArray = visibleArray.length - 1;
        }
        indexClient = visibleArray[indexVisibleArray]

        // update text color based on index position
        try {
            const clientNameDiv = document.getElementsByClassName("client-wrapper")[indexClient].children.item(0)
            clientNameDiv.style.color = "rgb(155, 131, 146)"
        }
        catch (err) {
            searchNotes.classList.remove("hide");
            searchNotes.innerHTML = "No results for: " + searchInput;
        }

        if (enterPressed) {
            if (e.shiftKey) {
                // open folder
                let pathToFolder = pathClientFolder + '/' + clients[indexClient].name;
                let pathToHome = pathClientFolder;
                if(clients[indexClient].status == "dead") {      
                    pathToFolder = pathClientFolder + '/%23Dead/' + clients[indexClient].name;
                    pathToHome = pathClientFolder + + '/%23Dead/';
                }
                window.api.openFolder([pathToFolder, pathToHome]);

    
            } else {
                // try to open sitch if not open folder
                let pathToSitch = pathClientFolder + '/' + clients[indexClient].name + '/' + clients[indexClient].name + '.docx';
                let pathToFolder = pathClientFolder + '/' + clients[indexClient].name;
                if(clients[indexClient].status == "dead") {   
                    pathToSitch = pathClientFolder + '/#Dead/' + clients[indexClient].name + '/' + clients[indexClient].name + '.docx';
                    pathToFolder = pathClientFolder + '/%23Dead/' + clients[indexClient].name;
                }
                window.api.openSitch([pathToSitch, pathToFolder]);
            }
        }
    } else {
        // reset index tracking
        indexVisibleArray = 0;
        indexClient = 0;
    }

    // update counts when searching
    clientCount();
}, false);

/**
 * function for summing the total number of clients for
 * each represenative in the office. The totals update 
 * when searching to show total numbers related to the
 * search results. When search is empty you see full
 * numbers. Italics test indicates numbers are related
 * to search results. 
 */
function clientCount() {
    // set totals to 0 to track number of clients 
    numAmberClients = 0;
    numShirleyClients = 0;
    numUnassignedClients = 0;
    numYahirClients = 0;

    // loop through clients and sum based on representative
    clients.forEach(client => {
        if (client.rep == "Amber" && !client.element.classList.contains("hide")) {
            numAmberClients++;
        }
        if (client.rep == "Shirley" && !client.element.classList.contains("hide")) {
            numShirleyClients++;
        }
        if (client.rep == "" && !client.element.classList.contains("hide")) {
            numUnassignedClients++;
        }
        if (client.rep == "Yahir" && !client.element.classList.contains("hide")) {
            numYahirClients++;
        }
    });

    // set client numbers in DOM
    numTotalClients = numAmberClients + numYahirClients + numShirleyClients + numUnassignedClients;
    clientCountAmber.innerHTML = "amber: " + numAmberClients;
    clientCountShirley.innerHTML = "shirley: " + numShirleyClients;
    clientCountTotal.innerHTML = "total: " + numTotalClients;
    clientCountUnassigned.innerHTML = "unassigned: " + numUnassignedClients
    clientCountYahir.innerHTML = "yahir: " + numYahirClients;

    // set text to italics when searching and normal when not
    if (searchInput.length > 0) {
        clientCountAmber.style.fontStyle = "italic";
        clientCountShirley.style.fontStyle = "italic";
        clientCountTotal.style.fontStyle = "italic";
        clientCountUnassigned.style.fontStyle = "italic";
        clientCountYahir.style.fontStyle = "italic";
    } else {
        clientCountAmber.style.fontStyle = "normal";
        clientCountShirley.style.fontStyle = "normal";
        clientCountTotal.style.fontStyle = "normal";
        clientCountYahir.style.fontStyle = "normal";
        clientCountUnassigned.style.fontStyle = "normal";
    }
}



