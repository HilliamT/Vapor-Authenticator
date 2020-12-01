import { addAccount, editStore, getAccount, getMainAccount, setMainAccount } from "../store/access";
import { getCommunity } from "./instance";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./types";
import { getAuthCode } from "steam-totp";

export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {

            // Check if we have their account and last session details on disk to login via oAuth
            const account = getAccount(details.accountName);
            if (account && account.steamguard && account.oAuthToken) {

                community.oAuthLogin(account.steamguard, account.oAuthToken, (err) => {
                    if (err) {

                        // Chuck out old session data. They'll need to attempt a normal login.
                        editStore(_store => {
                            delete account.steamguard;
                            delete account.oAuthToken;
                            delete account.cookies;
                            _store.accounts[details.accountName] = account;
                            return _store;
                        });
                        return resolve({error: SteamLoginErrors.OldSession});
                    }

                    // Successful login
                    setMainAccount(details.accountName);
                    resolve({});
                });
            } else {

                // If not, divert to using general login method
                community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

                    // Gracefully handle our error, asking the user to provide more login information
                    if (error) return resolve({error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain});
    
                    // Save the user's details on disk for future usage
                    if (getAccount(details.accountName) == null) {
                        addAccount(details.accountName, {steamid: community.steamID.getSteamID64(), usingVapor: false});
                    }
    
                    // Save their cookies and oAuthToken for future passwordless access
                    editStore(_store => {
                        _store.accounts[details.accountName] = {..._store.accounts[details.accountName], cookies, steamguard, oAuthToken};
                        _store.id_to_name[community.steamID.accountid] = details.accountName; 
                        _store.main = details.accountName;
                        return _store;
                    });
                    resolve({});
                });
            }
        });
    });
}

export async function turnOnTwoFactor(): Promise<any> {
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.enableTwoFactor((err, response) => {
                if (err) return resolve({error: err.message});
                
                // Write user's secrets to disk
                editStore(_store => {
                    const account = getMainAccount();
                    account.secrets = response;
                    account.usingVapor = false;
                    _store.accounts[_store.main] = account;
                    return _store;
                });
                resolve({});
            });
        });
    });
}

export async function finaliseTwoFactor(activationCode: string): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.finalizeTwoFactor(getMainAccount().secrets.shared_secret, activationCode, (err) => {
                if (err) return resolve({error: err.message});

                // User is using Vapor as their Steam authenticator
                editStore(_store => {
                    _store.accounts[_store.main].usingVapor = true;
                    return _store;
                });
                resolve({});
            });
        });
    });
}

export async function revokeTwoFactor(): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.disableTwoFactor(getMainAccount().secrets.revocation_code, (err) => {
                if (err) return resolve({error: err.message});
                
                // User is no longer using Vapor as their authenticator - secrets are no longer applicable
                editStore(_store => {
                    _store.accounts[_store.main].usingVapor = false;
                    delete _store.accounts[_store.main].secrets;
                    return _store;
                });
                resolve({});
            });
        });
    });
}

export function generateAuthCode() {
    return getAuthCode(getMainAccount().secrets.shared_secret);
}