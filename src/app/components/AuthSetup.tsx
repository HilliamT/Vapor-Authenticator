import React, { useEffect, useState } from "react";

export default function AuthSetup(props) {
    const [receivedSMS, setReceivedSMS] = useState(false); // Capture if user has been sent a SMS to begin authentication
    const [SMSCode, setSMSCode] = useState(""); // Input for user's SMS response
    const [authCode, setAuthCode] = useState("");
    const [seconds, setSeconds] = useState(new Date().getSeconds() % 30);
    const { setupDesktopAuth, finishDesktopAuth, revokeDesktopAuth, getAuthCode } = window["electron"].authenticate;

    // Establish authentication code loop upon context / page switch
    useEffect(() => {
        function generateNewAuthCode() {
            if (!props.user.usingVapor) return;
            const currentDateSeconds = new Date().getSeconds();
            let interval;
            if (currentDateSeconds % 30 == 0) interval = setInterval(() => setAuthCode(getAuthCode()), 30 * 1000);
            if (currentDateSeconds % 30 != 0) interval = setTimeout(generateNewAuthCode, (30 - currentDateSeconds % 30) * 1000);
            setAuthCode(getAuthCode());
            return interval;
        }
        const authInterval = generateNewAuthCode();        
        const secondInterval = setInterval(() => setSeconds(new Date().getSeconds() % 30), 1000);
        return () => {
            clearInterval(authInterval);
            clearInterval(secondInterval);
        }
    }, [props.user]);
    

    return (<div className="m-2 flex flex-wrap">
        <div className="mx-4 font-bold text-2xl w-full">Authenticator</div>

        {/* SMS authentication flow whilst a user isn't using Vapor as their authenticator */}
        {!props.user.usingVapor && <div className="m-4 mt-2 p-4 rounded bg-white shadow w-full"> 
            {!receivedSMS && <button onClick={async () => { 
                const response = await setupDesktopAuth();
                ((response.error == null) ? setReceivedSMS(true) : "");
            }}>Setup Authenticator</button>}

            {receivedSMS && <div>
                <div>SMS from Steam sent! Please enter the code you receive to complete the setup.</div>
                <br />
                <input name="" placeholder="SMS" className="rounded border p-1 m-1" onChange={(e) => setSMSCode(e.target.value)}/>
                <button onClick={async () => {
                    const response = await finishDesktopAuth(SMSCode);
                    if (!response.error) {
                        setReceivedSMS(false);
                        props.updateUser();
                    }
                }}>Finish Setup</button>
            </div>}
        </div>}

        {/* This user is using Vapor! */}
        {props.user.usingVapor && <div className="m-4 mt-2 p-4 rounded bg-white shadow w-full">
            <div className="justify-center text-center w-full">
                <span className="text-gray-400">Your Steam Guard code is</span>
                <br />
                <span className="font-bold text-2xl">{authCode}</span>
            </div>
            <div className="justify-center text-center w-full">
                {30 - seconds}s left
            </div>
        </div>}
        {props.user.usingVapor && <div className="m-4 p-4 rounded bg-white shadow w-full">
            <div onClick={async () => {
                const response = await revokeDesktopAuth();
                ((response.error == null) ? props.updateUser() : "");
            }} className="text-red-600">Revoke Steam Authenticator</div>
        </div>}
    </div>)
}