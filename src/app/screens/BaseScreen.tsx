import React from "react";
import AuthSetup from "../components/AuthSetup";

export default function BaseScreen(props) {
    return (
        <div>
            <div className="flex w-full">
                <div id="Sidebar" className="w-20 h-screen bg-indigo-500">
                    <div className="cursor-pointer" onClick={window["electron"].window.close}>Close</div>
                    <div onClick={window["electron"].window.minimize}>Minimise</div>
                    <div onClick={window["electron"].window.maximize}>Fullscreen</div>
                </div>
                <div id="Main" className="flex flex-grow flex-wrap">
                    <div id="Topbar" className="w-full h-20 bg-indigo-400">
                        <div className="h-20 w-20 flex">
                            <img src={getAvatarURL(props.user.avatarHash)} className="m-auto h-16 w-16 rounded" />
                        </div>
                    </div>
                    <div id="MainContent" className="w-full h-full">
                        <AuthSetup user={props.user} updateUser={props.updateUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function getAvatarURL(hash) {
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash.substr(0, 2) + "/" + hash + "_full.jpg";
}