import { getRemoteCommunity } from "./remote-instance";

/**
 * Attach own-defined event listeners to run any 'backend' functions to fetch for profile data
 * @param ipcMain IPC Router to attach event listeners to
 */
export default function attachProfileFunctions(ipcMain) {

    // Get Trade URL of current logged-in user
    ipcMain.on("getTradeURL", async (event, details) => {
        const url = await new Promise<void>((resolve, reject) => {
            getRemoteCommunity(details).then(community => {
                community.getTradeURL((err, url) => {
                    if (err) return reject(err);
                    resolve(url);
                });
            });
        });

        event.reply("getTradeURLResponse", url);
    });
}