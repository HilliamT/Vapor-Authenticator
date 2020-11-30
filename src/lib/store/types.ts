export interface VaporCache {
    main: string; // Main account, an account_name, to index
    settings: VaporSettings;
    accounts: {
        [account_name: string]: AccountStore
    }
}

export interface VaporSettings {
    
}

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
    }
}