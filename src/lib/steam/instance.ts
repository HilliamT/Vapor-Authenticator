import SteamCommunity from "steamcommunity";
import store from "../store/account";
const community = new SteamCommunity();

export function getCommunity(): Promise<any> {
    return new Promise((resolve, reject) => {
        if (store.has("oAuthToken") && store.has("steamguard")) {
            community.oAuthLogin(store.get("steamguard"), store.get("oAuthToken"), (err) => {
                if (err) return reject(err);
                resolve(community);
            })
        } else {
            resolve(community);
        }
    });
}

export function getSteamUser(steamid: any = community.steamID): Promise<any> {
    return new Promise((resolve, reject) => {
        if (steamid == null) return resolve(null);
        community.getSteamUser(steamid, (err, user) => {
            if (err) return reject(err);
            resolve(user);
        });
    });
}