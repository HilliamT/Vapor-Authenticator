import { contextBridge, ipcRenderer, remote } from "electron";
import { getCommunity, getSteamUser, getStoredSteamUsers } from "./lib/steam/instance";
import { attemptLogin, finaliseTwoFactor, generateAuthCode, revokeTwoFactor, turnOnTwoFactor, importTwoFactor } from "./lib/steam/authenticate";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./lib/steam/types";
import { getMainAccount, setMainAccount } from "./lib/store/access";
import { acceptOffer, declineOffer, getActiveIncomingOffers, getTradeOfferManager } from "./lib/steam/trade-manager";
import { getAllConfirmations } from "./lib/steam/confirmations";
import { getCurrentSteamUser, playGames } from "./lib/steam/user-instance";

contextBridge.exposeInMainWorld("electron", {
    steamLoginErrors: SteamLoginErrors,
    setCurrentUser: async function(account_name) {
        // if the account is null or "" | which is unset don't try to get a community instance it'll just create "":{...prevMainAccount} in the config
        if (!account_name) return;
        setMainAccount(account_name);
        await getCommunity(); // Update community instance
        await getTradeOfferManager(); // Update trade offer manager instance
        await getCurrentSteamUser();
    },
    getUser: async function() {
        await getCommunity(); // Ensure that the user's details from store are gathered first
        const user = await getSteamUser();
        return user;
    },
    getAllAccounts: function() {
        return getStoredSteamUsers();
    },
    authenticate: {
        tryLogin: function(details: SteamLoginDetails): Promise<SteamLoginResponse> {
            return attemptLogin(details);
        },
        setupDesktopAuth: function() {
            return turnOnTwoFactor();
        },
        importMaFile: function () {
            return importTwoFactor(
                remote.dialog.showOpenDialog({
                    properties: ["openFile"],
                    filters: [{ name: "SDA", extensions: ["maFile"] }],
                })
            );
        },
        finishDesktopAuth: function(activationCode: string) {
            return finaliseTwoFactor(activationCode);
        },
        revokeDesktopAuth: function() {
            return revokeTwoFactor();
        },
        getAuthCode: function() {
            return generateAuthCode();
        }
    },
    currentUser: {
        playGames: function(appids: any[]) {
            return playGames(appids);
        },
        openSteam: function(path = "/") {
            ipcRenderer.send("openSteamWindow", {path, cookies: getMainAccount().cookies});
            return new Promise((resolve) => {
                ipcRenderer.on("openSteamWindowResponse", () => resolve(null));
            });
        }
    },
    trading: {
        // TODO: Remove as we just have the user access their trades via proxy web window rather than showing them on app
        getIncomingTradeOffers: function() {
            return getActiveIncomingOffers();
        },
        acceptIncomingOffer: function(offerid) {
            return acceptOffer(offerid);
        },
        declineIncomingOffer: function(offerid) {
            return declineOffer(offerid);
        }
    },
    confirmations: {
        getActiveConfirmations: function() {
            return getAllConfirmations();
        },
        /*
            If ipcRenderer responses return something other than null that means it's an error
        */
        actOnConfirmation: function (accept, confirmationid, confirmationKey) {
            ipcRenderer.send("actOnConfirmation", {details: getMainAccount(), identitySecret: getMainAccount().secrets.identity_secret, accept, confirmationid, confirmationKey});
            return new Promise((resolve,reject) => {
                ipcRenderer.once("actOnConfirmationResponse", (_, err) => err ? reject(err) : resolve(null));
            });
        },
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
        },
        loadURL: function(url) {
            require("electron").shell.openExternal(url);
        }
    }
})