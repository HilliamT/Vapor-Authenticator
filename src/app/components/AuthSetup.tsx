import React, { useEffect, useState } from "react";

export default function AuthSetup(props) {
    const [receivedSMS, setReceivedSMS] = useState(false); // Capture if user has been sent a SMS to begin authentication
    const [SMSCode, setSMSCode] = useState(""); // Input for user's SMS response
    const [authCode, setAuthCode] = useState("");
    const [seconds, setSeconds] = useState(new Date().getSeconds() % 30);
    const [authSetupError, setAuthSetupError] = useState(""); // String to hold any errors regarding setting up authenticator
    const [importAuthError, setImportAuthError] = useState("");

    const {
        setupDesktopAuth,
        finishDesktopAuth,
        revokeDesktopAuth,
        getAuthCode,
        importMaFile,
    } = window["electron"].authenticate;

    // Establish authentication code loop upon context / page switch
    useEffect(() => {
        function generateNewAuthCode() {
            if (!props.user.usingVapor) return;
            const currentDateSeconds = new Date().getSeconds();
            let interval;
            
            // Generate a new code on XX:XX:00 or XX:XX:30
            if (currentDateSeconds % 30 == 0) interval = setInterval(() => setAuthCode(getAuthCode()), 30 * 1000);
            if (currentDateSeconds % 30 != 0) interval = setTimeout(generateNewAuthCode, (30 - currentDateSeconds % 30) * 1000);
            setAuthCode(getAuthCode());
            return interval;
        }
        const authInterval = generateNewAuthCode();        
        const secondInterval = setInterval(() => setSeconds(new Date().getSeconds() % 30), 1000);
        
        // Return cleanup instructions to remove intervals
        return () => {
            clearInterval(authInterval);
            clearInterval(secondInterval);
            setAuthSetupError("");
        }
    }, [props.user]);

    function handleSetupAuthResponse({error}) {
        if (error == "Error 2") return setAuthSetupError("Please add a phone number to this account.");
        if (error == "Error 29") return setAuthSetupError("There is an authenticator already set up on this account. Please remove it first.");
        if (error == null) return setReceivedSMS(true);
        return setAuthSetupError("New error never seen before - reload the application and try again. If this error persists, please make an issue on the GitHub!");
    }


    function handleImportAuthResponse(error: string) {
        if (error == null) return;
        setImportAuthError(error);
        return true;
    }

    return (
        <div className="m-2 flex flex-wrap">
            <div className="mx-4 font-bold text-2xl w-full text-white">
                Authenticator
            </div>

            {/* SMS authentication flow whilst a user isn't using Vapor as their authenticator */}
            {!props.user.usingVapor && <div>
                <div className="m-4 mt-2 p-4 rounded bg-white shadow w-full">
            {!receivedSMS && <button className="font-bold" onClick={async () => {
                handleSetupAuthResponse(await setupDesktopAuth());
            }}>Setup Authenticator</button>}

            <div className="text-red-400 text-sm">
                {authSetupError}
            </div>
            

            {receivedSMS && <div>
                <div>SMS from Steam sent! <br/> Please enter the code you receive to complete the setup.</div>
                <br />
                <input name="" placeholder="SMS" className="rounded border p-1 m-1" onChange={(e) => setSMSCode(e.target.value)}/>
                <button className="p-1 m-1 bg-black text-white rounded" onClick={async () => {
                    const response = await finishDesktopAuth(SMSCode);
                    if (!response.error) {

                        // User has finished SMS verification
                        setReceivedSMS(false);
                        props.updateUser();
                    }
                }}>Finish Setup</button>
            </div>}
            </div>
                <div className="m-4 mt-2 p-4 rounded bg-white shadow w-full">
                    <button
                        className="font-bold"
                        onClick={async () => {
                            const s = handleImportAuthResponse(
                                await importMaFile()
                            );
                            if (s == null) props.updateUser();
                        }}>Import .maFile</button>
                        <div className="text-red-400 text-sm">
                            {importAuthError}
                        </div>
                    </div>
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
        {props.user.usingVapor && <div className="m-4 p-2 rounded bg-red-600 shadow text-white block text-sm" onClick={async () => {
                const response = await revokeDesktopAuth();
                ((response.error == null) ? props.updateUser() : "");
            }}>Revoke Steam Authenticator
        </div>}
    </div>)
}