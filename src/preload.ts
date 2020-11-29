import { ipcRenderer, contextBridge } from "electron";
import { getCommunity, getSteamUser } from "./lib/steam/instance";
import { attemptLogin, finaliseTwoFactor, revokeTwoFactor, turnOnTwoFactor } from "./lib/steam/authenticate";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./lib/steam/types";

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
    getUser: async function() {
        await getCommunity(); // Ensure that the user's details from store are gathered first
        const user = await getSteamUser();
        return user;
    },
    authenticate: {
        setupDesktopAuth: function() {
            return turnOnTwoFactor();
        },
        finishDesktopAuth: function(activationCode: string) {
            return finaliseTwoFactor(activationCode);
        },
        revokeDesktopAuth: function() {
            return revokeTwoFactor();
        }
    },
    window: {
        close: function() {
            require("electron").remote.getCurrentWindow().close();
        },
        minimize: function() {
            require("electron").remote.getCurrentWindow().minimize();
        },
        maximize: function() {
            require("electron").remote.getCurrentWindow().maximize();
        }
    }
})