/**
 * Structure of on-disk AppData used by Vapor
 */
export interface VaporCache {
    main: string; // An account_name
    settings: VaporSettings;
    accounts: {
        [account_name: string]: AccountStore
    },
    id_to_name: {
        [accountid: string]: string // accountid -> account_name
    }
}

/**
 * User settings to allow for users to choose how to customise Vapor design-wise to their liking
 */
export interface VaporSettings {
    
}

/**
 * Sensitive account information for users to be able to login to the app
 * NOTE: Users will not need to have Vapor as their authenticator, but we do keep track of user cookies and oAuthToken
 * to allow for them to login into a Steamcommunity.com or Steampowered.com session passwordless. It also means that
 * we can fetch the data we need to show them.
 * 
 * NOTE 2: Secrets will only be set if the user chooses to use Vapor as their Steam authenticator. This is very
 * sensitive information that we unfortunately do need to save and keep track of as your authenticator. It allows us
 * to allow you to confirm trades, provide you Steam Guard codes etc.
 */
export interface AccountStore {
    steamid: string;
    usingVapor: boolean;
    oAuthToken?: string;
    cookies?: any;
    steamguard?: any;
    secrets?: {
        account_name: string;
        shared_secret: string;
        serial_number: string;
        revocation_code: string;
        uri: string;
        server_time: string;
        token: string;
        token_gid: string;
        identity_secret: string;
        secret_1: string;
        status: number;
    },
    password?: string; // Will only be set for if a user doesn't have any steamguard
}