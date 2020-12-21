import { getCommunity } from "./instance";
import { getConfirmationKey, time } from "steam-totp";
import { getMainAccount } from "../store/access";

enum ConfirmationTag {
    GetAll = "conf",
    GetDetails = "details",
    Accept = "allow",
    Cancel = "cancel"
}

enum ConfirmationType {
    Trade = 2,
    MarketListing = 3
}


export function getAllConfirmations() {
    return new Promise((resolve) => {
        getCommunity().then((community) => {
            const identitySecret = getMainAccount().secrets.identity_secret;
            community.getConfirmations(time(), getConfirmationKey(identitySecret, time(), ConfirmationTag.GetAll), async (err, confirmations) => {
                const _confirmations = [];

                // Populate trade confirmations with additional trade information
                for (const confirmation of confirmations) {
                    _confirmations.push((confirmation.type == ConfirmationType.Trade) ? await _populateConfirmation(confirmation, identitySecret) : confirmation);
                }
                resolve(_confirmations);
            });
        });
    });
}

function _populateConfirmation(confirmation: any, identity_secret: string) {
    return new Promise((resolve) => {
        confirmation.getOfferID(time(), getConfirmationKey(identity_secret, time()), (err, offerID) => {
            if (err) return resolve(confirmation);
            resolve({...confirmation, offerID});
        });
    })
}