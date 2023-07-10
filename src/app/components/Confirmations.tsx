import React, { useEffect, useState } from "react";

export default function Confirmations(props) {
    const [confirmations, setConfirmations] = useState([]);

    const [confirmationError, setConfirmationError] = useState({} as {id:string,error:string});
    useEffect(() => {
        if (!props.user.usingVapor) return;

        // Poll for new market listing or trade confirmations every 10 seconds
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
            return (<div className="m-4 mt-2 p-4 rounded bg-yellow-300 shadow flex w-full justify-center font-bold">
                You're not using Vapor as your authenticator - can't get your confirmations
            </div>);
        if (confirmations.length == 0)
            return (<div className="m-4 mt-2 p-4 rounded bg-white shadow flex w-full justify-center">
                No confirmations found
            </div>)

        return confirmations.map((conf) => {
            return (<div className="m-4 mt-2 p-4 rounded bg-white shadow flex flex-wrap w-full justify-center">
                <div className="w-full flex">
                    <div className="h-12">
                        {conf.icon != "" && <img className="h-12" src={conf.icon} />}
                    </div>
                    <div className="ml-3 flex-grow">
                        <div className="font-bold">{conf.title}</div>
                        <div>{conf.time}</div>
                    </div>
                </div>
                
                <div className="w-full flex">
                    {["Accept", "Cancel"].map((action,i) => (
                        <div key={i} className={`rounded bg-${i?"red":"blue"}-400 p-2 m-1 cursor-pointer`} onClick={
                            async () => await window["electron"].confirmations.actOnConfirmation(!i, conf.id, conf.key)
                                .then(()=>setConfirmations(confirmations.filter(f => f.id!==conf.id)))
                                .catch(err => setConfirmationError({ id: conf.id, error: err.message.replace(/(Error: )|(Uncaught )/g, "").trim() }))
                       }>{action}</div>
                    ))}
                </div>
                {confirmationError && confirmationError.id === conf.id &&
                    <p className="text-red-400 text-sm w-full text-left">&nbsp;{confirmationError.error}</p>}
            </div>);
        });
    }

    return (<div className="m-2 flex flex-wrap">
        <div className="mx-4 font-bold text-2xl w-full text-white">Confirmations</div>
        {renderConfirmations()}
    </div>);
}