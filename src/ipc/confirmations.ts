import { getRemoteCommunity } from "./remote-instance";
import { getConfirmationKey, time } from "steam-totp";

/**
 * Attach own-defined event listeners to run any 'backend' functions to fetch for doing anything confirmation-related
 * @param ipcMain IPC Router to attach event listeners to
 */
export default function attachConfirmationFunctions(ipcMain) {

    // Accept or Cancel/Decline confirmation for an offer or market listing
    ipcMain.on("actOnConfirmation", async (event, { details, identitySecret, accept, confirmationid, confirmationKey }) => {
        event.reply("actOnConfirmationResponse", await new Promise<string>(resolve => {
            getRemoteCommunity(details).then((community) => {
                const totpTime = time();
                const totpKey = getConfirmationKey(identitySecret, totpTime, accept ? "allow" : "cancel");

                community.respondToConfirmation(confirmationid, confirmationKey, totpTime, totpKey, accept, (err) => {
                    resolve(err);
                })
            });
        }))
    })
}