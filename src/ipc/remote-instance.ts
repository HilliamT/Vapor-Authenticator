import SteamCommunity from "steamcommunity";

export function getRemoteCommunity(details): Promise<any> {
    return new Promise((resolve, reject) => {
        const community = new SteamCommunity();

        if (details.steamguard) {
            // Perform an oAuth login
            community.oAuthLogin(details.steamguard, details.oAuthToken, (err, sessionID, cookies) => {
                if (err) return reject(err);

                // Update cookies
                community.setCookies(cookies);
                community.oAuthToken = details.oAuthToken;
                resolve(community);
            });
        } else {
            community.login(details, (err, sessionID, cookies, steamguard, oAuthToken) => {
                community.setCookies(cookies);
                community.oAuthToken = oAuthToken;
                resolve(community);
            });
        }
    });
}