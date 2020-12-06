import React, { useState } from "react";
import Logo from "../screens/vapor.svg";

export default function Home(props) {
    
    let [value, setValue] = useState(0); // Dud state to force update after making an account idle / de-idle
    function rerenderComponent() { setValue(++value) };

    const playingGames = props.accountsIdling[props.user.steamid] || false;

    return (<div className="m-2 flex flex-wrap">
        <div className="mx-4 font-bold text-2xl w-full">Home</div>
        <div className="m-4 mt-2 p-4 rounded bg-white shadow flex w-full justify-center">
            <img src={Logo} className="h-36 w-36" />
        </div>

        {/* Steam Profile Button */}
        <div className="m-2 ml-4 p-2 rounded bg-white shadow font-bold cursor-pointer" onClick={() => {
            window["electron"].window.loadURL(`https://steamcommunity.com/profiles/${props.user.steamid}`);
        }}>Profile</div>

        {/* Idle games button */}
        <div className={`m-2 ml-4 p-2 rounded bg-white shadow font-bold cursor-pointer ${playingGames ? "bg-yellow-500" : "bg-green-500"}`} onClick={() => {
            window["electron"].currentUser.playGames((playingGames) ? [] : null).then(() => {
                props.accountsIdling[props.user.steamid] = !playingGames;
                props.setAccountsIdling(props.accountsIdling);
                rerenderComponent();
            });
        }}>{playingGames ? "Stop Idling" : "Play All Games"}</div>

        <div className="m-2 ml-4 p-2 rounded bg-white shadow font-bold cursor-pointer" onClick={() => window["electron"].currentUser.openSteam()}>Proxy Window</div>
    </div>)
}