import { getRemoteCommunity } from "./remote-instance";

export default function attachProfileFunctions(ipcMain) {
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