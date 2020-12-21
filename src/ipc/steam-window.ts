import { BrowserWindow } from "electron";

/**
 * Attach our own-defined event listeners for accessing a proxied user session in a window
 * @param ipcMain IPC Router to attach event listeners to
 */
export default function atachSteamWindowFunctions(ipcMain) {

    // Open a program window at the Steamcommunity.com 'path' and with the given user 'cookies' to tell Steam that we are this user
    ipcMain.on("openSteamWindow", async (event, {path, cookies}) => {
        const child = new BrowserWindow({ show: true, width: 1000, height: 800 });

        // For each cookie, we enable the user cookies globally across steampowered.com and steamcommunity.com
        // This means we stay logged in as our proxied user when we are navigating and clicking links within the window!
        cookies.map((cookie) => {
            const [name, value] = cookie.split("=");
            child.webContents.session.cookies.set({url: "https://store.steampowered.com/", name, value});
            child.webContents.session.cookies.set({url: "https://steamcommunity.com/", name, value});
        });
    
        // Load the window for the user
        child.loadURL(`https://steamcommunity.com${path}`);
    });
}