import store from "../store/account";
import {getCommunity} from "./instance";
import { SteamLoginDetails, SteamLoginResponse } from "./types";

export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

                // Gracefully handle our error
                if (error) return resolve({error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain});
                store.set("cookies", cookies);
                store.set("steamguard", steamguard);
                store.set("oAuthToken", oAuthToken);
                resolve({});
            });
        });
        
    });
}

export async function turnOnTwoFactor(): Promise<void> {
    return await new Promise((resolve, reject) => {
        getCommunity().then(community => {
            console.log(community);
            console.log(community.oAuth);
            community.oAuthToken = store.get("oAuthToken");
            community.enableTwoFactor((err, response) => {
                console.log(err);
                if (err) return reject(err);
                console.log(response);
                console.log(community.steamID);
                
                require('fs').writeFileSync('auth.json', response);
                store.set(community.steamID.accountid, response);
                resolve(null);
            });
        });
    });
}