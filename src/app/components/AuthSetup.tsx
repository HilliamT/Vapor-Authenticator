import React, { useState } from "react";

export default function AuthSetup(props) {
    const [receivedSMS, setReceivedSMS] = useState(false); // Capture if user has been sent a SMS to begin authentication
    const [SMSCode, setSMSCode] = useState(""); // Input for user's SMS response
    const { setupDesktopAuth, finishDesktopAuth, revokeDesktopAuth } = window["electron"].authenticate;

    return (<div className="p-4">

        {/* SMS authentication flow whilst a user isn't using Vapor as their authenticator */}
        {!props.user.usingVapor && <div> 
            {!receivedSMS && <button onClick={async () => { 
                const response = await setupDesktopAuth();
                ((response.error == null) ? setReceivedSMS(true) : "");
            }}>Set up authentication</button>}

            {receivedSMS && <div>
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
            <div onClick={async () => {
                const response = await revokeDesktopAuth();
                ((response.error == null) ? props.updateUser() : "");
            }}>Revoke</div>
        </div>}
    </div>)
}