export interface SteamLoginDetails {
    accountName: string;
    password: string;
    steamguard?: string; // Steam Guard code for those logging in on Steam Guard Authorisation email
    authCode?: string; // Steam Guard code on first email authentication
    twoFactorCode?: string;
    captcha?: string;
    disableMobile?: boolean;
}

export enum SteamLoginErrors {
    IncorrectDetails = "Error: Uncaught Error: The account name or password that you have entered is incorrect.",
    SteamGuard = "SteamGuard",
    SteamGuardMobile = "SteamGuardMobile",
    Captcha = "CAPTCHA",
    OldSession = "Old Session"
}

export interface SteamLoginResponse {
    error?: SteamLoginErrors,
    emaildomain?: string;
    captchaurl?: string;
}

export enum Steam2FAErrors {
    NoMobile = "Error 2"
}