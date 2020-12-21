import { getRemoteCommunity } from "./remote-instance";
import { getConfirmationKey, time } from "steam-totp";

/**
 * Attach own-defined event listeners to run any 'backend' functions to fetch for doing anything confirmation-related
 * @param ipcMain IPC Router to attach event listeners to
 */
export default function attachConfirmationFunctions(ipcMain) {

    // Accept confirmation for an offer or market listing
    ipcMain.on("acceptConfirmation", async (event, {details, identitySecret, confirmationid}) => {
        const success = await new Promise<void>((resolve, reject) => {
            getRemoteCommunity(details).then((community) => {
                community.acceptConfirmationForObject(identitySecret, confirmationid, (err) => {
                    if (err) return reject(err);
                    resolve(null);
                });
            });
        });

        event.reply("acceptConfirmationResponse", success);
    });

    // Decline confirmation for an offer or market listing
    ipcMain.on("declineConfirmation", async (event, {details, identitySecret, confirmationid}) => {
        const success = await new Promise<void>((resolve, reject) => {
            getRemoteCommunity(details).then((community) => {
                const totpTime = time();
                const confirmationKey = getConfirmationKey(identitySecret, totpTime, "allow");
                const totpKey = getConfirmationKey(identitySecret, totpTime, "conf");

                community.respondToConfirmation(confirmationid, confirmationKey, totpTime, totpKey, false, (err) => {
                    if (err) return reject(err);
                    resolve(null);
                })
            });
        });

        event.reply("declineConfirmationResponse", success);
    });
}