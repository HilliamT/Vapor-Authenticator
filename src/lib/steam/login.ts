import store from "../store/account";
import {getCommunity} from "./instance";
import { SteamLoginDetails, SteamLoginResponse } from "./types";

export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

                // Gracefully handle our error
                if (error) return resolve({error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain});
                store.set("steamguard", steamguard);
                store.set("oAuthToken", oAuthToken);
                resolve({});
            });
        });
        
    });
}