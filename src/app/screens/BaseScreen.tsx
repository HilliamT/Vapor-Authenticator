import React, { useEffect, useState } from "react";
import AuthSetup from "../components/AuthSetup";
import IncomingTradeOffers from "../components/IncomingTradeOffers";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Confirmations from "../components/Confirmations";

export default function BaseScreen(props) {
    const [accounts, setAccounts] = useState({});

    useEffect(() => {
        (async () => setAccounts(await window["electron"].getAllAccounts()))();
    }, []);

    function renderAccounts() {
        const elems = [];
        for (const account_name in accounts) {
            elems.push(<div className={`h-20 w-20 flex hover:bg-black hover:bg-opacity-20 ${(props.user.steamid == accounts[account_name].steamid) ? "bg-black bg-opacity-20" : ""}`}
                key={account_name} onClick={async () => {
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
            <HashRouter>
                {/* Leading Sidebar */}
                <div id="Sidebar" className="w-20 h-screen bg-indigo-500">     
                    <div className="w-full h-20"></div>
                    <Link className="text-sm" to="/">Home</Link>
                    <br />
                    <Link className="text-sm" to="/offers/incoming">Trade Offers</Link>
                    <br />
                    <Link className="text-sm" to="/confirmations">Confirmations</Link>
                    <br />
                    <Link className="text-sm" to="/authenticator">Authenticator</Link>
                </div>

                <div id="Main" className="flex flex-grow flex-wrap">
                    {/* Secondary Sidebar */}
                    <div id="Topbar" className="w-full h-20 bg-indigo-400 flex">
                        {renderAccounts()}
                    </div>
                    <div id="MainContent" className="w-full h-full">
                        
                        <Switch>
                            <Route exact path="/">
                                <div>Hi</div>
                            </Route>
                            <Route path="/offers/incoming">
                                <IncomingTradeOffers user={props.user}/>
                            </Route>
                            <Route path="/confirmations">
                                <Confirmations user={props.user} />
                            </Route>
                            <Route path="/authenticator">
                                <AuthSetup user={props.user} updateUser={props.updateUser} />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        </div>
    </div>);
}

function getAvatarURL(hash) {
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash.substr(0, 2) + "/" + hash + "_full.jpg";
}