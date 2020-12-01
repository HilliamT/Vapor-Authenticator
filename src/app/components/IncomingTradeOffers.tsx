import React, { useEffect, useState } from "react";

export default function IncomingTradeOffers(props) {
    const [tradeOffers, setTradeOffers] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            updateTradeOffers();
        }, 10 * 1000);
        (async () => {
            updateTradeOffers();
        })();
        return () => clearInterval(interval);
    }, [props.user]);

    async function updateTradeOffers() {
        setTradeOffers(await window["electron"].trading.getIncomingTradeOffers());
    }

    function renderTradeOffers() {
        if (tradeOffers.length == 0) return (<div>None.</div>);
        return tradeOffers.map((offer) => {
            return (<div className="m-2 rounded p-2 border">
                {offer.id}
                <br />
                {offer.created.toString()}
                <br />
                <div className="bg-blue-500 text-white cursor-pointer m-1 p-1 inline-block rounded" onClick={() => {
                    window["electron"].trading.acceptIncomingOffer(offer.id).then(updateTradeOffers);
                }}>Accept</div>
                <div className="bg-purple-500 text-white cursor-pointer m-1 p-1 inline-block rounded" onClick={() => {
                    window["electron"].trading.declineIncomingOffer(offer.id).then(updateTradeOffers);
                }}>Decline</div>
            </div>);
        });
    }

    return (<div className="p-4">
        Your Incoming Trade Offers
        {renderTradeOffers()}
    </div>);
}