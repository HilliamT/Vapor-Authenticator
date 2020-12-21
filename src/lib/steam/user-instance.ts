import SteamUser from "steam-user";
import { getCommunity } from "./instance";
const users = {};

/**
 * Log into Steam as our current user, allowing us to perform certain user-only functionalities
 */
export async function getCurrentSteamUser(): Promise<any> {
    return new Promise((resolve) => {
        getCommunity().then(community => {

            // If no logged in user set
            if (community.steamID == null) return resolve(new SteamUser({enablePicsCache: true}));

            // Use already existing user instance
            if (community.steamID.accountid && users[community.steamID.accountid])
                return resolve(users[community.steamID.accountid]);
            
            // Gets main account client login token    
            community.getClientLogonToken((err, details) => {
                const user = new SteamUser({enablePicsCache: true});
                if (err) return resolve(user);

                // Ensure that we have logged in properly and that our app information has loaded in
                user.logOn(details);
                user.on("loggedOn", () => {
                    user.on("appOwnershipCached", () => {
                        users[community.steamID.accountid] = user;
                        resolve(user);
                    });
                });
            });
        });
    });
}

/**
 * Play (all the) games!
 * @param appids Optional list of games that we should be forced to play
 */
export async function playGames(appids: any[]): Promise<void> {
    return new Promise((resolve) => {
        getCurrentSteamUser().then(user => {
            user.setPersona(SteamUser.EPersonaState.Online);

            // Play either the games we've been told to play or play everything we have access to
            user.gamesPlayed(appids != null ? appids : ["🎮 Idling with Vapor", ...user.getOwnedApps()]);
            return resolve();
        });
    });
}