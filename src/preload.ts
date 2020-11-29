import { ipcRenderer, contextBridge } from "electron";
import { getCommunity } from "./lib/steam/instance";
import { attemptLogin } from "./lib/steam/login";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./lib/steam/types";
import store from "./lib/store/account";

contextBridge.exposeInMainWorld("electron", {
    notificationApi: {
    sendNotification(message: string) {
            ipcRenderer.send("notify", message);
        }
    },
    tryLogin: function(details: SteamLoginDetails): Promise<SteamLoginResponse> {
        return attemptLogin(details);
    },
    steamLoginErrors: SteamLoginErrors,
    getUser: function() {
        return getCommunity().then(community => {
            console.log(community.steamID);
            return community.steamID;
        });
    }
})