import { faSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Icon from "./vapor.svg";

export default function LoginScreen(props) {

    // Login Form user responses
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [authMethod, setAuthMethod] = useState({method: "", value: ""});

    // Login response
    const [loginResponse, setLoginResponse] = useState({});

    return (
        <div className="flex h-screen w-screen">
            <div className="m-auto flex flex-wrap content-center w-full justify-center">
                <div className="w-full flex content-center justify-center items-center">
                    <img className="w-20 h-20 align-middle" src={Icon} />
                    <div className="text-3xl font-semibold ml-3">Vapor</div>
                </div>
                
                <span className="text-xs mt-6 text-gray-400">Desktop Authenticator for Steam</span>
                <div className="w-full content-center justify-center flex flex-wrap mt-10">
                    <input id="accountName" name="username" placeholder="Username" className="rounded border p-1 mx-1" onChange={(e) => setAccountName(e.target.value)}/>
                    <input id="password" name="password" placeholder="Password" className="rounded border p-1 mx-1" onChange={(e) => setPassword(e.target.value)}/>

                    {<button className="bg-black text-white rounded px-3 text-sm inline" onClick={async () => {
                        const details = {accountName, password, captcha};
                        details[authMethod.method] = authMethod.value;
                        const response = await window["electron"].authenticate.tryLogin(details);
                        ((Object.keys(response).length == 0) ? props.updateUser() : setLoginResponse(response));
                    }}>Login</button>}
                </div>
                <div className="w-full justify-center content-center mt-3 text-center">
                    {Object.keys(loginResponse).length !== 0 && displayResponsePrompt(loginResponse)}
                </div>
            </div>
        </div>
    )

    function displayResponsePrompt(response) {
        const {error, captchaurl} = response;
        const SteamLoginErrors = window["electron"].steamLoginErrors;
    
        switch(error) {
            case SteamLoginErrors.MissingDetails:
                return (<div className="text-xs text-red-600">Missing your username or password <FontAwesomeIcon icon={faSadCry} className="opacity-40 align-middle" size="2x" /></div>)
            case SteamLoginErrors.IncorrectDetails:
                return (<div className="text-sm text-red-600">Your username or password is incorrect. Please try again.</div>);
            case SteamLoginErrors.SteamGuardMobile:
                return (<div>
                    <input name="steamguardmobile" placeholder="Mobile Auth Code" className="rounded border p-1 mx-1"  onChange={(e) => setAuthMethod({
                        method: "twoFactorCode",
                        value: e.target.value
                    })}/>
                </div>)
            case SteamLoginErrors.SteamGuard:
                return (<div>
                    <input name="steamguard" placeholder="Email Auth Code" className="rounded border p-1 mx-1" onChange={(e) => setAuthMethod({
                        method: "authCode",
                        value: e.target.value
                    })} />
                </div>)
            case SteamLoginErrors.Captcha:
                return (<div>
                    <div className="">Please fill in this captcha</div>
                    <img src={captchaurl} />
                    <input name="captcha" placeholder="Captcha" className="rounded border p-1 mx-1" onChange={(e) => setCaptcha(e.target.value)}/>
                </div>)
            default:
                return (<div className="text-sm text-red-300">
                    You have been timed out temporarily. Please try again later.
                </div>)
        }
    }
}

