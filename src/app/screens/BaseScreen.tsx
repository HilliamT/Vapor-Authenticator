import React, { useEffect, useState } from "react";
import AuthSetup from "../components/AuthSetup";
import IncomingTradeOffers from "../components/IncomingTradeOffers";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Confirmations from "../components/Confirmations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; 
import Home from "../components/Home";

const CurrentPage = {
    Home: "Home",
    Confirmations: "Confirmations",
    Authenticator: "Authenticator"
}

export default function BaseScreen(props) {
    const [accounts, setAccounts] = useState({});
    const [switchingUser, setSwitchingUser] = useState(false);
    const [accountsIdling, setAccountsIdling] = useState({});
    const [currentPage, setCurrentPage] = useState(CurrentPage.Home);

    useEffect(() => {
        (async () => setAccounts(await window["electron"].getAllAccounts()))();
    }, []);

    function renderAccounts() {
        const elems = [];
        for (const account_name in accounts) {
            elems.push(<div className={`h-20 w-20 flex-none flex cursor-pointer hover:bg-black hover:bg-opacity-20 ${(props.user.steamid == accounts[account_name].steamid) ? "bg-black bg-opacity-20" : ""}`}
                key={account_name} onClick={() => {
                    setSwitchingUser(true);
                    window["electron"].setCurrentUser(account_name).then(() => {
                        props.updateUser().then(() => setSwitchingUser(false));
                    });
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
        {switchingUser && <div className="absolute w-screen h-screen bg-black bg-opacity-20 z-10"></div>}
        <div className="w-auto flex">
            <HashRouter>
                {/* Leading Sidebar */}
                <div id="Sidebar" className="w-40 h-screen flex flex-wrap content-start flex-none" style={{backgroundColor: "#111225"}}>
                    <div className="w-full h-20"></div>
                    <Link className="text-sm w-full group" to="/">
                        <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Home == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                            setCurrentPage(CurrentPage.Home);
                        }}>Home</div>
                    </Link>
                    <br />
                    <div className="text-sm w-full group cursor-pointer" onClick={() => window["electron"].window.loadURL(`https://steamcommunity.com/profiles/${props.user.steamid}`)}>
                        <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Profile</div>
                    </div>
                    <br />
                    <div className="text-sm w-full group cursor-pointer" onClick={() => window["electron"].currentUser.openSteam(`/chat/`)}>
                        <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Chat</div>
                    </div>
                    <br />
                    <div className="text-sm w-full group cursor-pointer" onClick={() => window["electron"].currentUser.openSteam(`/profiles/${props.user.steamid}/tradeoffers/`)}>
                        <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Trades</div>
                    </div>
                    <br />
                    <Link className="text-sm w-full group" to="/confirmations">
                        <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Confirmations == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                            setCurrentPage(CurrentPage.Confirmations);
                        }}>Confirmations</div>
                    </Link>
                    <br />
                    <Link className="text-sm w-full group" to="/authenticator">
                        <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Authenticator == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                            setCurrentPage(CurrentPage.Authenticator);
                        }}>Authenticator</div>
                    </Link>
                </div>

                <div id="Main" className="w-full overflow-hidden h-screen flex flex-wrap" style={{backgroundColor: "#0e0d1c"}}>
                        {/* Secondary Sidebar */}
                        <div id="Topbar" className="w-full h-20 flex overflow-x-scroll whitespace-nowrap" style={{backgroundColor: "rgba(255, 255, 255, 0.05)"}}>
                            {renderAccounts()}
                        </div>

                        {/* Main body of the Desktop app, acting as SPA with components being swapped out inside here */}
                        <div id="MainContent" className="w-full h-full">
                            <Switch>
                                <Route exact path="/">
                                    <Home user={props.user} accountsIdling={accountsIdling} setAccountsIdling={setAccountsIdling}/>
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
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash?.substr(0, 2) + "/" + hash + "_full.jpg";
}