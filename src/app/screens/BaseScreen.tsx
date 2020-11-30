import React, { useEffect, useState } from "react";
import AuthSetup from "../components/AuthSetup";
import IncomingTradeOffers from "../components/IncomingTradeOffers";

export default function BaseScreen(props) {
    const [accounts, setAccounts] = useState({});

    useEffect(() => {
        (async () => setAccounts(await window["electron"].getAllAccounts()))();
    }, []);

    function renderAccounts() {
        const elems = [];
        for (let account_name in accounts) {
            elems.push(<div className="h-20 w-20 flex hover:bg-black hover:bg-opacity-20" key={account_name} onClick={async () => {
                await window["electron"].setCurrentUser(account_name);
                props.updateUser();
            }}>
                <img className="m-auto h-16 w-16 rounded bg-black" src={getAvatarURL(accounts[account_name].avatarHash)}/>
            </div>);
        }
        return elems;
    }

    return (<div>
        <div className="flex w-full">

            {/* Leading Sidebar */}
            <div id="Sidebar" className="w-20 h-screen bg-indigo-500">     
                <div className="w-full h-20"></div>           
            </div>

            <div id="Main" className="flex flex-grow flex-wrap">
                {/* Secondary Sidebar */}
                <div id="Topbar" className="w-full h-20 bg-indigo-400 flex">
                    {renderAccounts()}
                </div>
                <div id="MainContent" className="w-full h-full">
                    <IncomingTradeOffers user={props.user}/>
                    <AuthSetup user={props.user} updateUser={props.updateUser} />
                </div>
            </div>
        </div>
    </div>);
}

function getAvatarURL(hash) {
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash.substr(0, 2) + "/" + hash + "_full.jpg";
}