import store from "./account";
import { AccountStore, VaporCache, VaporSettings } from "./types";

/**
 * Helper functions for saving and retrieving on-disk user information
 */

export function getStore(): VaporCache  {
    
    // If user has never used Vapor before, initalise
    if (store.get("vapor") == null) {
        setStore({
            main: null,
            settings: {},
            accounts: {},
            id_to_name: {}
        });
    }

    return (store.get("vapor") as VaporCache);
}

export function setStore(newStore: VaporCache): void {
    store.set("vapor", newStore);
}

export function getVaporSettings(): VaporSettings {
    return getStore().settings;
}

export function editStore(edits: (_store: VaporCache) => VaporCache): void {
    setStore(edits(getStore()));
}

export function getMainAccount(): AccountStore {
    return getAccount(getStore().main);
}

export function setMainAccount(account_name: string): void {
    editStore(_store => ({..._store, main: account_name}));
}

export function getAccount(account_name: string): AccountStore {
    return getStore().accounts[account_name];
}

export function addAccount(account_name: string, account: AccountStore): void {
    editStore(_store => {
        _store.accounts[account_name] = account;
        return _store;
    });
}

export function deleteAccount(account_name): void {
    editStore(_store => {
        delete _store.accounts[account_name];
        return _store;
    });
}