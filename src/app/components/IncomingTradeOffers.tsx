import React, { useEffect, useState } from "react";

export default function IncomingTradeOffers(props) {
    const [tradeOffers, setTradeOffers] = useState([]);

    useEffect(() => {

        // Poll for new incoming trade offers every 10 seconds
        const interval = setInterval(() => {
            updateTradeOffers();
        }, 10 * 1000);
        (async () => {
            updateTradeOffers();
        })();
        return () => clearInterval(interval);
    }, [props.user]);

    // Perform fetch to get new incoming trade offers
    async function updateTradeOffers() {
        setTradeOffers(await window["electron"].trading.getIncomingTradeOffers());
    }

    function renderTradeOffers() {
        if (tradeOffers.length == 0) return (<div className="m-4 p-2 rounded bg-white shadow w-full flex justify-center">None</div>);
        return tradeOffers.map((offer) => {
            return (<div className="m-4 p-2 rounded bg-white shadow w-full" key={offer.id}>
                <span className="font-bold">Trade #{offer.id}</span>
                <br />
                {offer.created.toString()}
                <br />

                {/* Accept or decline trade offer */}
                <div className="bg-blue-500 text-white cursor-pointer m-1 p-1 inline-block rounded" onClick={() => {
                    window["electron"].trading.acceptIncomingOffer(offer.id).then(updateTradeOffers);
                }}>Accept</div>
                <div className="bg-purple-500 text-white cursor-pointer m-1 p-1 inline-block rounded" onClick={() => {
                    window["electron"].trading.declineIncomingOffer(offer.id).then(updateTradeOffers);
                }}>Decline</div>
            </div>);
        });
    }

    return (<div className="m-2 flex flex-wrap">
        <div className="mx-4 font-bold text-2xl w-full">Incoming Trades</div>
        {renderTradeOffers()}
    </div>);
}