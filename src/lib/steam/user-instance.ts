import SteamUser from "steam-user";
import { getCommunity } from "./instance";
const user = new SteamUser({enablePicsCache: true});

export async function getCurrentSteamUser(): Promise<any> {
    return new Promise((resolve) => {
        getCommunity().then(community => {

            // If no logged in user set
            if (community.steamID == null) return resolve(user);

            // Use already existing user instance
            if (user.steamID && user.steamID.accountid == community.steamID.accountid) return resolve(user);
            
            // Gets main account client login token    
            community.getClientLogonToken((err, details) => {
                if (err) return resolve(user);
                if (user.steamID != null) {

                    // If a user account is already using this SteamUser instance, ensure that we log off first
                    user.logOff();
                    user.on("disconnected", () => {
                        user.logOn(details);
                        user.on("loggedOn", () => {
                            user.on("appOwnershipCached", () => {
                                resolve(user);
                            });
                        });
                    });
                } else {
                    user.logOn(details);
                    user.on("loggedOn", () => {
                        user.on("appOwnershipCached", () => {
                            resolve(user);
                        });
                    });
                }
                
            });
        });
    });
}

export async function playGames(appids: any[]): Promise<void> {
    return new Promise((resolve) => {
        getCurrentSteamUser().then(user => {
            user.setPersona(SteamUser.EPersonaState.Online);
            user.gamesPlayed(["Idling with Vapor...", ...(appids != null ? appids : user.getOwnedApps())]);
            return resolve();
        });
    });
}