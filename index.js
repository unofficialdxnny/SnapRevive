const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const RPC = require('discord-rpc');

const clientId = '1064942142692270120'; // Replace this with your Discord App Client ID

// Only needed if you want to refresh presence
const startTimestamp = new Date();

// Initialize Discord RPC
const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
    console.log('Discord RPC connected');

    // Set the initial presence
    rpc.setActivity({
        details: 'Starting Snapify',
        state: 'Initializing...',
        startTimestamp,
        largeImageKey: 'download', // Ensure you have added the image to your Discord app assets

        instance: false,
    });
});

// Connect to Discord
rpc.login({ clientId }).catch(console.error);

function readXPathsFromJson() {
    const xpathsFilePath = path.join(__dirname, 'xpaths.json');
    try {
        const data = fs.readFileSync(xpathsFilePath, 'utf8');
        const xpathsData = JSON.parse(data);
        return xpathsData.xpaths;
    } catch (error) {
        console.error('Error reading xpaths.json:', error);
        return [];
    }
}

function createLoadingWindow() {
    const loadingWindow = new BrowserWindow({
        width: 500,
        height: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    loadingWindow.loadFile('index.html');

    setTimeout(() => {
        loadingWindow.close();
        createMainWindow();
    }, 5000);
}

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.webContents.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
    );

    mainWindow.loadURL('https://web.snapchat.com');

    mainWindow.webContents.on('did-frame-finish-load', () => {
        // Update the Rich Presence status
        rpc.setActivity({
            details: 'Snapify',
            state: 'Sending snaps...',
            startTimestamp,
            largeImageKey: 'download', // Ensure you have added the image to your Discord app assets
            largeImageText: 'Snapscore Botter',
            instance: false,
        });

        // Read XPaths from JSON
        const xpaths = readXPathsFromJson();

        // Inject JavaScript code into the DevTools console
        mainWindow.webContents.executeJavaScript(`
      // Define a function to click an element using its XPath
      function clickElementByXPath(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
          element.click();
          return true;
        } else {
          return false;
        }
      }
      
      // Define a list of XPath elements to click on
      const xpaths = ${JSON.stringify(xpaths)}; // Load XPaths from JSON

      // Keep track of the current user index
      let currentUserIndex = 0;
      
      // Define a function to perform the snap sending process for all users
      function sendSnapsToAllUsers() {
        if (currentUserIndex < xpaths.length) {
          const elementClicked = clickElementByXPath(xpaths[currentUserIndex]);
          if (elementClicked) {
            setTimeout(() => {
              // Capture or send the snap here (You can add your logic)
              console.log('Sending snap to user');
              
              // You may need to add code to navigate back to the list of users
              // and increment the user index to proceed to the next user.
              
              currentUserIndex++;
              sendSnapsToAllUsers(); // Continue to the next user
            }, 100); // Adjust the delay as needed between sending snaps to users
          } else {
            console.log('Element with XPath not found.');
            currentUserIndex++;
            sendSnapsToAllUsers(); // Continue to the next user
          }
        } else {
          console.log('All snaps sent.');
          currentUserIndex = 0; // Reset the index to start over
          setTimeout(sendSnapsToAllUsers, 100); // Start again after a delay
        }
      }
      
      // sendSnapsToAllUsers
      // Start the process by sending snaps to all users
      setTimeout(sendSnapsToAllUsers, 0); // Start again after a delay
      
    `);
    });
}

app.whenReady().then(() => {
    createLoadingWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createLoadingWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
