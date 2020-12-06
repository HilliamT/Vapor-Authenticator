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
    },
    password?: string; // Will only be set for if a user doesn't have any steamguard
}