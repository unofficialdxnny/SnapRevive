const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Client: DiscordRPC } = require('discord-rpc');
const fs = require('fs');
const express = require('express');

const clientId = '1064942142692270120'; // Replace with your Discord App Client ID
const startTimestamp = new Date();
let rpc;
let mainWindow;
let snapifyWindow;
let appExpress; // Declare appExpress globally

const auth_key = '';
const server_key = '1250141995243143270';
const user_key = '1262610008848338964';

// Define the port number for Express server
const port = 3000;

function initExpress() {
  appExpress = express(); // Initialize express server
  appExpress.use(bodyParser.json());

  appExpress.post('/checkUser', async (req, res) => {
    const userId = req.body.userId;

    try {
      const response = await axios.get(`https://discord.com/api/v9/guilds/${server_key}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${auth_key}`
        }
      });

      const member = response.data;
      const hasRole = member.roles.includes(user_key);

      if (hasRole) {
        res.status(200).json({ valid: true });
      } else {
        res.status(403).json({ valid: false });
      }
    } catch (error) {
      res.status(404).json({ valid: false });
    }
  });

  appExpress.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Initialize Discord RPC
function initDiscordRPC() {
  rpc = new DiscordRPC({ transport: 'ipc' });

  rpc.on('ready', () => {
    console.log('Discord RPC connected');
    rpc.setActivity({
      details: 'Snapify',
      state: 'Initializing...',
      startTimestamp,
      largeImageKey: 'download', // Replace with your Discord app's large image key
      instance: false,
    });
  });

  rpc.login({ clientId }).catch((err) => {
    console.error('Error connecting to Discord RPC:', err);
  });
}

// Function to read XPaths from file
function readXPathsFromFile() {
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

// Create the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    icon: path.join(__dirname, './icon/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'), // Preload script for interaction with snapifyWindow
    },
  });

  // Set user agent to mimic Chrome
  mainWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
  );

  // Load the HTML file based on existence of xpaths.json
  const xpathsExist = fs.existsSync(path.join(__dirname, 'xpaths.json'));
  const fileToLoad = xpathsExist ? 'validate.html' : 'xpaths.json.doesnt.exist.html';
  mainWindow.loadFile(path.join(__dirname, fileToLoad));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  globalShortcut.register('Alt+F4', () => {
    mainWindow.close();
  });

  ipcMain.on('submit-user-id', (event, userId) => {
    console.log(`Received user ID: ${userId}`);
    createSnapifyWindow();
    mainWindow.close();
  });
}

// Function to click elements by XPath indefinitely
function clickElementsForever(xpaths) {
  let currentIndex = 0;

  function clickNext() {
    if (currentIndex >= xpaths.length) {
      currentIndex = 0; // Reset index to loop through xpaths
    }

    const xpath = xpaths[currentIndex];
    if (xpath && snapifyWindow) {
      snapifyWindow.webContents.executeJavaScript(`
        (async () => {
          const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          
          // Function to click an element using its XPath
          const clickElementByXPath = (xpath) => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
              element.click();
              return true;
            }
            return false;
          };
          
          // Define a list of XPath elements to click on
          const xpaths = ${JSON.stringify(xpaths)}; // Load XPaths from JSON
          
          // Keep track of the current user index
          let currentUserIndex = 0;
          
          // Function to perform the snap sending process for all users
          const sendSnapsToAllUsers = async () => {
            if (currentUserIndex < xpaths.length) {
              const elementClicked = clickElementByXPath(xpaths[currentUserIndex]);
              if (elementClicked) {
                await sleep(100); // Adjust delay as needed
                console.log('Sending snap to user');
                // You may need to add code to navigate back to the list of users
                currentUserIndex++;
                await sendSnapsToAllUsers(); // Continue to the next user
              } else {
                console.log('Element with XPath not found.');
                currentUserIndex++;
                await sendSnapsToAllUsers(); // Continue to the next user
              }
            } else {
              console.log('All snaps sent.');
              currentUserIndex = 0; // Reset the index to start over
              await sleep(100); // Adjust delay as needed
              await sendSnapsToAllUsers(); // Start again after a delay
            }
          };
          
          // Start the process by sending snaps to all users
          await sendSnapsToAllUsers();
        })();
      `);
    }

    currentIndex++;
    setTimeout(clickNext, 100); // Adjust delay as needed
  }

  clickNext(); // Start clicking
}

// Create Snapify window
function createSnapifyWindow() {
  snapifyWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    frame: true,
    autoHideMenuBar: true,
    resizable: false,
    icon: path.join(__dirname, './icon/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Preload script for interaction with snapifyWindow
    },
  });

  // Set user agent to mimic Chrome
  snapifyWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
  );

  snapifyWindow.loadURL('https://web.snapchat.com');

  snapifyWindow.on('closed', () => {
    snapifyWindow = null;
  });

  snapifyWindow.on('close', (event) => {
    event.preventDefault();
    snapifyWindow.hide();
  });

  globalShortcut.register('Alt+F4', () => {
    snapifyWindow.close();
  });

  const xpaths = readXPathsFromFile();
  clickElementsForever(xpaths);
}

app.whenReady().then(() => {
  initDiscordRPC();
  initExpress(); // Initialize express server
  createMainWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (appExpress) {
    appExpress.close(); // Close the express server
  }
});
