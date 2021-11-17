import SteamCommunity from "steamcommunity";
import { editStore, getAccount, getMainAccount, getStore } from "../store/access";
import SteamID from "steamid";
import { generateAuthCode } from "./authenticate";
let community = new SteamCommunity();

/**
 * Access the current SteamCommunity instance or fetch a new logged-in one if possible
 */
export function getCommunity(): Promise<any> {
    return new Promise((resolve, reject) => {

        // See if we are already logged into the current account
        const main = getMainAccount();
        if (!main) return resolve(getNewCommunity());
        if (community.oAuthToken == main.oAuthToken) return resolve(community);

        // If not, perform an account switch in the community instance.
        if (main.oAuthToken && main.cookies && main.steamguard) {

            // Perform an oAuth login i.e passwordless login
            community.oAuthLogin(main.steamguard, main.oAuthToken, (err, sessionID, cookies) => {
                if (err) return reject(err);

                // Update user cookies
                community.setCookies(cookies);
                editStore(_store => {
                    main.cookies = cookies;
                    _store.accounts[_store.main] = main;
                    return _store;
                });
                community.oAuthToken = main.oAuthToken;
                resolve(community);
            });

        } else if (main.password) {

            // They initially logged into Vapor with a non-2FA account.
            // This may still be the case, but they may have also added 2FA

            let details = {
                accountName: getStore().main,
                password: main.password,
                twoFactorCode: null
            };
            if (main.secrets && main.secrets.shared_secret) details.twoFactorCode = generateAuthCode();

            community.login(details, (err, sessionID, cookies, steamguard, oAuthToken) => {
                if (err) return reject(err);

                // Update user cookies
                community.setCookies(cookies);
                editStore(_store => {

                    // If user has added steamguard to their account, delete their saved password
                    if (steamguard) delete main.password;
                    main.steamguard = steamguard;

                    // Update session data
                    main.cookies = cookies;
                    main.oAuthToken = oAuthToken;
                    _store.accounts[_store.main] = main;
                    return _store;
                });
                community.oAuthToken = main.oAuthToken;
                resolve(community);
            });
        } else {
            // Return a normal userless community instance for now 
            return resolve(getNewCommunity());
        }
    });
}

/**
 * Get a dud non-logged-in Steam community instance
 */
export function getNewCommunity() {
    community = new SteamCommunity();
    return community;
}

/**
 * Fetch profile information on this user e.g if they are "Online" etc.
 * @param steamid Steam user to fetch data on
 */
export function getSteamUser(steamid: any = community.steamID): Promise<any> {
    return new Promise((resolve) => {
        if (steamid == null) return resolve(null);

        getCommunity().then(community => {
            community.getSteamUser(steamid, (err, user) => {
                if (err) return resolve(null);

                // Get user, with any details we may have on them from disk
                if (steamid.accountid in getStore().id_to_name) return resolve({...user, ...getAccount(getStore().id_to_name[steamid.accountid])});
                resolve({...user}); 
            });
        });
    });
}

/**
 * Get all accounts from us that have logged into the authenticator (not just using Vapor as their authenticator)
 */
export async function getStoredSteamUsers(): Promise<any> {
    const { accounts } = getStore();

    // Get all stored steam users from disk and get their public user profile information
    for (const account_name in accounts) accounts[account_name] = await getSteamUser(new SteamID(accounts[account_name].steamid));
    return accounts;
}