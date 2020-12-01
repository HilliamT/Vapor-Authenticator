import React, { useEffect, useState } from "react";

export default function Confirmations(props) {
    const [confirmations, setConfirmations] = useState([]);

    useEffect(() => {
        if (!props.user.usingVapor) return;
        (async () => {
            setConfirmations(await window["electron"].confirmations.getActiveConfirmations());
        })();
    }, [props.user]);

    function renderConfirmations() {
        if (!props.user.usingVapor) return (<div>You're not using Vapor - can't get your confirmations</div>);
        if (confirmations.length == 0) return (<div>None.</div>)
        return confirmations.map((conf) => {
            console.log(conf);
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