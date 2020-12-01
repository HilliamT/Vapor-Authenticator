import React, { useEffect, useState } from "react";

export default function Confirmations(props) {
    const [confirmations, setConfirmations] = useState([]);

    useEffect(() => {
        if (!props.user.usingVapor) return;
        const interval = setInterval(async () => {
            setConfirmations(await window["electron"].confirmations.getActiveConfirmations());
        }, 10 * 1000);
        (async () => {
            setConfirmations(await window["electron"].confirmations.getActiveConfirmations());
        })();
        return () => clearInterval(interval);
    }, [props.user]);

    function renderConfirmations() {
        if (!props.user.usingVapor)
            return (<div className="m-4 mt-2 p-4 rounded bg-white shadow flex w-full justify-center">
                You're not using Vapor - can't get your confirmations
            </div>);
        if (confirmations.length == 0)
            return (<div className="m-4 mt-2 p-4 rounded bg-white shadow flex w-full justify-center">
                No confirmations found
            </div>)
        return confirmations.map((conf) => {
            return (<div className="m-4 mt-2 p-4 rounded bg-white shadow flex w-full justify-center">
                <span>{conf.id}</span>
                <div>{conf.title}</div>
                <div>{conf.time}</div>
                {conf.icon != "" && <img src={conf.icon} />}
            </div>);
        });
    }

    return (<div className="m-2 flex flex-wrap">
        <div className="mx-4 font-bold text-2xl w-full">Confirmations</div>
        {renderConfirmations()}
    </div>);
}