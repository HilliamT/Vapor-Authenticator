import React, { useState } from "react";

export default function LoginScreen(props) {
    const electron = window["electron"];

    // Login Form user responses
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [authMethod, setAuthMethod] = useState({method: "", value: ""});

    // Login response
    const [loginResponse, setLoginResponse] = useState({});

    return (
        <div className="flex h-screen w-screen">
            <div className="m-auto">
                <div className="text-3xl font-semibold">Vapor</div>
                <span className="text-xl">Desktop Authenticator for Steam</span>
                <br /><br />
                <div>
                    <input id="accountName" name="username" placeholder="Username" onChange={(e) => setAccountName(e.target.value)}/>
                    <input id="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>

                    {Object.keys(loginResponse).length !== 0 && showCodePrompt(loginResponse)}

                    {<button className="bg-black text-white rounded px-3 py-1" onClick={() => {
                        const details = {accountName, password, captcha};
                        details[authMethod.method] = authMethod.value;
                        electron.tryLogin(details).then(response => {
                            if (Object.keys(response).length == 0) return props.updateUser();
                            setLoginResponse(response)
                        })
                    }}>
                        Login</button>}
                </div>
            </div>
        
        </div>
    )

    function showCodePrompt(response) {
        const {error, captchaurl} = response;
        const SteamLoginErrors = window["electron"].steamLoginErrors;
    
        switch(error) {
            case SteamLoginErrors.IncorrectDetails:
                return (
                    <div>
                        <div className="text-sm text-red-300">Your username or password is incorrect. Please try again.</div>
                    </div>
                )
                break;
            case SteamLoginErrors.SteamGuardMobile:
                return (
                    <div>
                        <input name="steamguardmobile" placeholder="SteamGuardMobile" onChange={(e) => setAuthMethod({
                            method: "twoFactorCode",
                            value: e.target.value
                        })}/>
                    </div>
                )
            case SteamLoginErrors.SteamGuard:
                return (
                    <div>
                        <input name="steamguard" placeholder="SteamGuard" onChange={(e) => setAuthMethod({
                            method: "authCode",
                            value: e.target.value
                        })} />
                    </div>
                )
                break;
            case SteamLoginErrors.Captcha:
                return (
                    <div>
                        <div className="">Please fill in this captcha</div>
                        <img src={captchaurl} />
                        <input name="captcha" placeholder="Captcha" onChange={(e) => setCaptcha(e.target.value)}/>
                    </div>
                )
                break;
            default:
                return (
                    <div className="text-sm text-red-300">
                        You have been timed out temporarily. Please try again later.
                    </div>
                )
        }
    }
}

