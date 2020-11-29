import React, { useState } from "react";

export default function AuthSetup(props) {
    const [receivedSMS, setReceivedSMS] = useState(false);
    const [SMSCode, setSMSCode] = useState("");

    console.log(props.user);

    return (
        <div className="p-4">
            {!props.user.usingVapor && <div> {!receivedSMS && <button onClick={() => {
                window["electron"].authenticate.setupDesktopAuth().then((response) => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setReceivedSMS(true);
                    }
                    });
                }}>Set up authentication</button>}

                {receivedSMS && <div>
                    <input name="" placeholder="SMS" onChange={(e) => setSMSCode(e.target.value)}/>
                    <button onClick={
                        () => window["electron"].authenticate.finishDesktopAuth(SMSCode)
                        .then((response) => {
                            if (response.error) {
                                console.log(response.error);
                            } else {
                                setReceivedSMS(false);
                                props.updateUser();
                            }
                        })
                        .catch(() => {})
                    }>Finish Setup</button>
                </div>}
            </div>}

            {props.user.usingVapor && <div>
                <div>You are now using Vapor!</div>
                <div onClick={() => 
                    window["electron"].authenticate.revokeDesktopAuth().then((response) => {
                        console.log(response);
                        if (response.error) {
                            console.log(response.error);
                        } else {
                            props.updateUser();
                        }
                    }).catch(() => {})
                }>Revoke</div>
            </div>}
        </div>
    )
}