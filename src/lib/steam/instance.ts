import SteamCommunity from "steamcommunity";
import { editStore, getAccount, getMainAccount, getStore } from "../store/access";
import SteamID from "steamid";
const community = new SteamCommunity();

export function getCommunity(): Promise<any> {
    return new Promise((resolve, reject) => {
        if (community.steamID == null) return resolve(community);

        // See if we are already logged into the current account
        const main = getMainAccount();
        if (community.oAuthToken == main.oAuthToken) return resolve(community);

        // If not, perform an account switch in the community instance.
        if (main.oAuthToken && main.cookies && main.steamguard) {

            // Perform an oAuth login
            community.oAuthLogin(main.steamguard, main.oAuthToken, (err, sessionID, cookies) => {
                if (err) return reject(err);

                // Update cookies
                community.setCookies(cookies);
                editStore(_store => {
                    main.cookies = cookies;
                    _store.accounts[_store.main] = main;
                    return _store;
                });
                community.oAuthToken = main.oAuthToken;
                resolve(community);
            });
        } else {
            // Return a normal userless community instance for now 
            return resolve(community);
        }
    });
}

export function getSteamUser(steamid: any = community.steamID): Promise<any> {
    return new Promise((resolve) => {
        if (steamid == null) return resolve(null);

        community.getSteamUser(steamid, (err, user) => {
            if (err) return resolve(null);

            // Get user, with any details we may have on them from disk
            if (steamid.accountid in getStore().id_to_name) return resolve({...user, ...getAccount(getStore().id_to_name[steamid.accountid])});
            resolve({...user}); 
        });
    });
}

export async function getStoredSteamUsers(): Promise<any> {
    const { accounts } = getStore();

    // Get all stored steam users from disk and get their public user profile information
    for (const account_name in accounts) accounts[account_name] = await getSteamUser(new SteamID(accounts[account_name].steamid));
    return accounts;
}