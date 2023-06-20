import { addAccount, editStore, getAccount, getMainAccount, setMainAccount } from "../store/access";
import { getCommunity, getNewCommunity } from "./instance";
import { SteamLoginDetails, SteamLoginErrors, SteamLoginResponse } from "./types";
import { getAuthCode } from "steam-totp";
import fs from "fs";

// Since we use a new instance of SteamCommunity everytime this needs to be stored.
let _captchaGID = -1;
/**
 * Attempt a login to see if a user's login details are correct
 * @param details Login details
 */
export async function attemptLogin(details: SteamLoginDetails): Promise<SteamLoginResponse> {
    return await new Promise((resolve) => {
        const community = getNewCommunity();

        // Check if we have their account and last session details on disk to login via oAuth
        const account = getAccount(details.accountName);
        if (account && account.steamguard && account.oAuthToken) {

            community.oAuthLogin(account.steamguard, account.oAuthToken, (err, sessionID, cookies) => {
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

                // Update cookies
                editStore(_store => {
                    _store.accounts[details.accountName] = {..._store.accounts[details.accountName], cookies};
                    _store.id_to_name[community.steamID.accountid] = details.accountName; 
                    _store.main = details.accountName;
                    return _store;
                });
                community.setCookies(cookies);
                community.oAuthToken = account.oAuthToken;

                // Successful login
                setMainAccount(details.accountName);
                resolve({});
            });
        } else {
            // If not, divert to using general login method

            // For this, ensure that they have entered both username and password
            if (details.accountName == "" || details.password == "") return resolve({error: SteamLoginErrors.MissingDetails});

            // If we have their shared secret stored on disk, generate mobile auth code to login with
            if (account && account.secrets && account.secrets.shared_secret)
                details.twoFactorCode = getAuthCode(account.secrets.shared_secret);

            community._captchaGid = _captchaGID;
            // Begin login process
            community.login(details, (error, sessionID, cookies, steamguard, oAuthToken) => {

                // If we get into an error, gracefully handle it, asking the user to provide more login information if necessary
                if (error) {
                    _captchaGID = community._captchaGid;
                    return resolve({ error: error.message, captchaurl: error.captchaurl, emaildomain: error.emaildomain });
                }

                // Save the user's details on disk for future usage
                if (getAccount(details.accountName) == null) {
                    addAccount(details.accountName, {steamid: community.steamID.getSteamID64(), usingVapor: false});
                }

                // Save their cookies and oAuthToken for future passwordless access
                editStore(_store => {
                    _store.accounts[details.accountName] = {..._store.accounts[details.accountName], cookies, steamguard, oAuthToken};
                    if (steamguard == null) _store.accounts[details.accountName].password = details.password; // save their password if they don't have steamguard
                    _store.id_to_name[community.steamID.accountid] = details.accountName; 
                    _store.main = details.accountName;
                    return _store;
                });
                
                // Update community instance with new user
                community.setCookies(cookies);
                community.oAuthToken = oAuthToken;
                setMainAccount(details.accountName);

                //Set captcha gid back to -1
                _captchaGID = -1;
                resolve({});
            });
        }
    })
}

/**
 * Tell Steam that this user would like to initiate the 2FA setup process, using Vapor as their authenticator!
 */
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

export async function importTwoFactor(prom: Promise<Electron.OpenDialogReturnValue>): Promise<any> {
    const files = await prom;

    if (files.canceled) return;

    try {
        const data: {
            shared_secret: string;
            serial_number: string;
            revocation_code: string;
            uri: string;
            server_time: number;
            account_name: string;
            token_gid: string;
            identity_secret: string;
            secret_1: string;
            status: number;
            device_id: string;
            fully_enrolled: true;
            Session: {
                SessionID: string;
                SteamLogin: string;
                SteamLoginSecure: string;
                WebCookie: string;
                OAuthToken: string;
                SteamID: string;
            };
        } = JSON.parse(
            //Since js doesn't have enough precision to stre steamid's turn them turn them in to strings
            (await fs.promises.readFile(files.filePaths[0], "utf-8")).replace(/"SteamID":(\d+)/, '"SteamID":"$1"')
        );
        const account = getMainAccount();
        if (!(data.shared_secret && data.revocation_code && data.identity_secret && typeof data.Session == "object"))
            return "Invalid maFile";
        if (data.Session.SteamID !== account.steamid) {
            return "This maFile belongs to another account";
        }
        editStore(_store => {
            const account = getMainAccount();
            account.secrets = {
                account_name: data.account_name,
                identity_secret: data.identity_secret,
                revocation_code: data.revocation_code,
                secret_1: data.secret_1,
                serial_number: data.serial_number,
                server_time: data.server_time.toString(),
                shared_secret: data.shared_secret,
                status: data.status,
                //not sure about this one
                token: "",
                token_gid: data.token_gid,
                uri: data.uri,
            };
            account.usingVapor = true;
            _store.accounts[_store.main] = account;
            return _store;
        });
    } catch (err) {
        switch (err.name) {
            case "SyntaxError":
                return "Invalid maFile";
            default:
                return "Something went wrong: " + err.toString();
        }
    }
}

/**
 * Finalise 2FA setup process to configure Vapor as their authenticator
 * @param activationCode SMS activation code received from user input
 */
export async function finaliseTwoFactor(activationCode: string): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.finalizeTwoFactor(getMainAccount().secrets.shared_secret, activationCode, (err: Error | null) => {
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

/**
 * Oh no :(
 * Tell Steam that this user doesn't wish to use Vapor any more as their authenticator
 */
export async function revokeTwoFactor(): Promise<any>{
    return await new Promise((resolve) => {
        getCommunity().then(community => {
            community.disableTwoFactor(getMainAccount().secrets.revocation_code, (err: Error | null) => {
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

/**
 * Generate a 2FA code for Steam Guard
 */
export function generateAuthCode() {
    return getAuthCode(getMainAccount()?.secrets?.shared_secret);
}