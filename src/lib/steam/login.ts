import ElectronStore from "electron-store";
import store from "../store/account";
import community from "./instance";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./types";

export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve, reject) => {
        community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

            // Gracefully handle our error
            if (error) return resolve({error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain});
            console.log(community.steamID);
            store.set("user", community.steamID);
            store.set("steamguard", steamguard);
            store.set("oAuthToken", oAuthToken);
            resolve({});
        });
    });
}