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
    

    return (<div className="p-4">

        {/* SMS authentication flow whilst a user isn't using Vapor as their authenticator */}
        {!props.user.usingVapor && <div> 
            {!receivedSMS && <button onClick={async () => { 
                const response = await setupDesktopAuth();
                ((response.error == null) ? setReceivedSMS(true) : "");
            }}>Set up authentication</button>}

            {receivedSMS && <div>
                <div>SMS from Steam sent! Please enter the code you receive to complete the setup.</div>
                <br />
                <input name="" placeholder="SMS" onChange={(e) => setSMSCode(e.target.value)}/>
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
        {props.user.usingVapor && <div>
            <div>You are now using Vapor!</div>
            <br />
            <div>
                Your auth code is:
                <span className="font-bold">{authCode}</span>
                <br />
                {30 - seconds}s left
            </div>
            <br />
            
            <div onClick={async () => {
                const response = await revokeDesktopAuth();
                ((response.error == null) ? props.updateUser() : "");
            }} className="text-red-600">Revoke</div>
        </div>}
    </div>)
}