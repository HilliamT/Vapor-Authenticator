import React, { useEffect, useState } from "react";
import AuthSetup from "../components/AuthSetup";
import IncomingTradeOffers from "../components/IncomingTradeOffers";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Confirmations from "../components/Confirmations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faHome, faPeopleArrows, faPlus, faStopwatch } from "@fortawesome/free-solid-svg-icons"; 
import Home from "../components/Home";

export default function BaseScreen(props) {
    const [accounts, setAccounts] = useState({});

    useEffect(() => {
        (async () => setAccounts(await window["electron"].getAllAccounts()))();
    }, []);

    function renderAccounts() {
        const elems = [];
        for (const account_name in accounts) {
            elems.push(<div className={`h-20 w-20 flex-none flex cursor-pointer hover:bg-black hover:bg-opacity-20 ${(props.user.steamid == accounts[account_name].steamid) ? "bg-black bg-opacity-20" : ""}`}
                key={account_name} onClick={async () => {
                    await window["electron"].setCurrentUser(account_name);
                    props.updateUser();
                }}>
                    <img className="m-auto h-16 w-16 rounded" src={getAvatarURL(accounts[account_name].avatarHash)}/>
            </div>);
        }
        elems.push(<div className="h-20 w-20 flex-none flex cursor-pointer hover:bg-black hover:bg-opacity-20"
        key="add" onClick={() => {
            props.setAddNewAccount(true);
        }}>
            <div className="m-auto h-16 w-16 rounded bg-black bg-opacity-10 justify-center content-center flex">
                <FontAwesomeIcon icon={faPlus} className="m-auto h-16 w-16" color="white" opacity="20%" />
            </div>
        </div>);

        return elems;
    }

    return (<div>
        <div className="w-screen flex">
            <HashRouter>
                {/* Leading Sidebar */}
                <div id="Sidebar" className="w-20 h-screen bg-indigo-500 flex flex-wrap content-start flex-none">
                    <div className="w-full h-20"></div>
                    <Link className="text-sm w-full text-center h-20 group" to="/">
                        <FontAwesomeIcon icon={faHome} size="2x" className="opacity-30 group-hover:opacity-80"/>
                    </Link>
                    <br />
                    <Link className="text-sm w-full text-center h-20 group" to="/offers/incoming">
                        <FontAwesomeIcon icon={faPeopleArrows} size="2x" className="opacity-30 group-hover:opacity-80" />
                    </Link>
                    <br />
                    <Link className="text-sm w-full text-center h-20 group" to="/confirmations">
                        <FontAwesomeIcon icon={faCheckSquare} size="2x" className="opacity-30 group-hover:opacity-80" />
                        </Link>
                    <br />
                    <Link className="text-sm w-full text-center h-20 group" to="/authenticator">
                        <FontAwesomeIcon icon={faStopwatch} size="2x" className="opacity-30 group-hover:opacity-60" />
                    </Link>
                </div>

                <div id="Main" className="w-auto overflow-hidden h-screen flex flex-wrap">
                        {/* Secondary Sidebar */}
                        <div id="Topbar" className="w-full h-20 bg-indigo-400 flex overflow-x-scroll whitespace-nowrap">
                            {renderAccounts()}
                        </div>
                        <div id="MainContent" className="w-full h-full bg-gray-100">
                            <Switch>
                                <Route exact path="/">
                                    <Home />
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