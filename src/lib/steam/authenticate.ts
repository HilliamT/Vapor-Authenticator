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

export async function turnOnTwoFactor(): Promise<any> {
    return await new Promise((resolve, reject) => {
        getCommunity().then(community => {
            community.enableTwoFactor((err, response) => {
                if (err) {
                    switch(err.message) {
                        case Steam2FAErrors.NoMobile:
                            return resolve({error: Steam2FAErrors.NoMobile});
                    }
                    return reject({error: err.message});
                }
                
                require('fs').writeFileSync(PATH_TO_ACCOUNT_SECRETS, JSON.stringify(response));
                store.set(`${community.steamID.accountid}.secrets`, response);
                store.set(`${community.steamID.accountid}.usingVapor`, false);
                resolve({});
            });
        });
    });
}

export async function finaliseTwoFactor(activationCode: string): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            const shared_secret = store.get(`${community.steamID.accountid}.secrets.shared_secret`);
            community.finalizeTwoFactor(shared_secret, activationCode, (err) => {
                if (err) return resolve({error: err.message});

                store.set(`${community.steamID.accountid}.usingVapor`, true);
                resolve({});
            });
        });
    });
}

export async function revokeTwoFactor(): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.disableTwoFactor(store.get(`${community.steamID.accountid}.secrets.revocation_code`), (err) => {
                if (err) return resolve({error: err.message});
                
                store.set(`${community.steamID.accountid}.usingVapor`, false);
                store.delete(`${community.steamID.accountid}.secrets`);
                resolve({});
            });
        });
    });
}