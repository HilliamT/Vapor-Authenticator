import { BrowserWindow } from "electron";

export default function atachSteamWindowFunctions(ipcMain) {
    ipcMain.on("openSteamWindow", async (event, {path, cookies}) => {
        const child = new BrowserWindow({ show: true, width: 1000, height: 800 });

        cookies.map((cookie) => {
            const [name, value] = cookie.split("=");
            child.webContents.session.cookies.set({url: "https://store.steampowered.com/", name, value});
            child.webContents.session.cookies.set({url: "https://steamcommunity.com/", name, value});
        });
    
        child.loadURL(`https://steamcommunity.com${path}`);
    });
}