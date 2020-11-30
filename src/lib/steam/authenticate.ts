import store from "../store/account";
import {getCommunity} from "./instance";
import { SteamLoginDetails, SteamLoginResponse } from "./types";

const PATH_TO_ACCOUNT_SECRETS = "auth.json";

export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

                // Gracefully handle our error, asking the user to provide more login information
                if (error) return resolve({error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain});

                // Save the user's details on disk for future usage
                const steamid = community.steamID.accountid;
                store.set(`${steamid}.cookies`, cookies);
                store.set(`${steamid}.steamguard`, steamguard);
                store.set(`${steamid}.oAuthToken`, oAuthToken);
                resolve({});
            });
        });
    });
}

export async function turnOnTwoFactor(): Promise<any> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.enableTwoFactor((err, response) => {
                if (err) return resolve({error: err.message});
                
                // Write user's secrets to disk
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
            community.finalizeTwoFactor(store.get(`${community.steamID.accountid}.secrets.shared_secret`), activationCode, (err) => {
                if (err) return resolve({error: err.message});

                // User is using Vapor as their Steam authenticator
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
                
                // User is no longer using Vapor as their authenticator - secrets are no longer applicable
                store.set(`${community.steamID.accountid}.usingVapor`, false);
                store.delete(`${community.steamID.accountid}.secrets`);
                resolve({});
            });
        });
    });
}