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
        if (!props.user.usingVapor) return (<div>You're not using Vapor - can't get your confirmations</div>);
        if (confirmations.length == 0) return (<div>None.</div>)
        return confirmations.map((conf) => {
            return (<div>
                <span>{conf.id}</span>
                <div>{conf.title}</div>
                <div>{conf.time}</div>
                {conf.icon != "" && <img src={conf.icon} />}
            </div>);
        });
    }

    return (<div>
        Confirmations
        {renderConfirmations()}
    </div>);
}