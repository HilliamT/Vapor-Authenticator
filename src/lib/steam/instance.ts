import SteamCommunity from "steamcommunity";
import store from "../store/account";
const community = new SteamCommunity();

export function getCommunity(): Promise<any> {
    return new Promise((resolve, reject) => {
        if (community.steamID == null) return resolve(community);

        const steamid = community.steamID.accountid;

        // Check if we can use a passwordless session to login automatically
        if (!(store.has(`${steamid}.oAuthToken`) && store.has(`${steamid}.steamguard`) && store.has(`${steamid}.cookies`))) {
            return resolve(community);
        }

        community.oAuthLogin(store.get(`${steamid}.steamguard`), store.get(`${steamid}.oAuthToken`), (err) => {
            if (err) return reject(err);
            community.setCookies(store.get(`${steamid}.cookies`));
            community.oAuthToken = store.get(`${steamid}.oAuthToken`);
            resolve(community);
        });
    });
}

export function getSteamUser(steamid: any = community.steamID): Promise<any> {
    return new Promise((resolve, reject) => {
        if (steamid == null) return resolve(null);
        community.getSteamUser(steamid, (err, user) => {
            if (err) return reject(err);
            const vaporDetails: any = store.get(`${community.steamID.accountid}`) || {};
            resolve({...user, ...vaporDetails});
        });
    });
}