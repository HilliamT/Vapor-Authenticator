import SteamCommunity from "steamcommunity";

/**
 * Access a logged-in SteamCommunity instance here in the 'backend'
 * @param details Login details
 */
export function getRemoteCommunity(details): Promise<any> {
    return new Promise((resolve, reject) => {

        // Get a dud SteamCommunity instance
        const community = new SteamCommunity();

        // Check if we have our Steam Guard on, assuming we have saved an oAuthToken from this
        if (details.steamguard) {
            // Perform an oAuth login i.e passwordless login
            community.oAuthLogin(details.steamguard, details.oAuthToken, (err, sessionID, cookies) => {
                if (err) return reject(err);

                // Update cookies
                community.setCookies(cookies);
                community.oAuthToken = details.oAuthToken;
                resolve(community);
            });
        } else {

            // Perform a normal login using username, password and generated 2FA code from shared secret
            community.login(details, (err, sessionID, cookies, steamguard, oAuthToken) => {
                community.setCookies(cookies);
                community.oAuthToken = oAuthToken;
                resolve(community);
            });
        }
    });
}