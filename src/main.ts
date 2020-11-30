import {app, BrowserWindow } from "electron";
import * as path from "path";

// Create the browser window
function _createWindow(): void {
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        frame: false,

        webPreferences: { // Allows us to load some NodeJS scripts before browser loads
            enableRemoteModule: true,
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true, // Avoid any string injections
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    // Load the index.html of the app
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

// Event is shot when Electron is "ready" to create browser windows
app.on("ready", function() {
    _createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) _createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});