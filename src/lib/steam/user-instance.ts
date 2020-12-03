import SteamUser from "steam-user";
import { getCommunity } from "./instance";
const users = {};

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

export async function playGames(appids: any[]): Promise<void> {
    return new Promise((resolve) => {
        getCurrentSteamUser().then(user => {
            user.setPersona(SteamUser.EPersonaState.Online);
            user.gamesPlayed(appids != null ? appids : ["🎮 Idling with Vapor", ...user.getOwnedApps()]);
            return resolve();
        });
    });
}