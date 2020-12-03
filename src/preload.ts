import { contextBridge } from "electron";
import { getCommunity, getSteamUser, getStoredSteamUsers } from "./lib/steam/instance";
import { attemptLogin, finaliseTwoFactor, generateAuthCode, revokeTwoFactor, turnOnTwoFactor } from "./lib/steam/authenticate";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./lib/steam/types";
import { setMainAccount } from "./lib/store/access";
import { acceptOffer, declineOffer, getActiveIncomingOffers, getTradeOfferManager } from "./lib/steam/trade-manager";
import { getAllConfirmations } from "./lib/steam/confirmations";
import { getCurrentSteamUser, playGames } from "./lib/steam/user-instance";

contextBridge.exposeInMainWorld("electron", {
    steamLoginErrors: SteamLoginErrors,
    setCurrentUser: async function(account_name) {
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
        }
    },
    trading: {
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