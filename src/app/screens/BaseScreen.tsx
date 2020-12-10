import React, { useState } from "react";
import AuthSetup from "../components/AuthSetup";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Confirmations from "../components/Confirmations";
import Home from "../components/Home";

const CurrentPage = {
    Home: "/",
    Confirmations: "/confirmations",
    Authenticator: "/authenticator"
}

export default function BaseScreen(props) {
    const [accountsIdling, setAccountsIdling] = useState({});
    const [currentPage, setCurrentPage] = useState(CurrentPage.Home);

    return (<div className="fixed z-0 w-screen h-screen flex" style={{WebkitAppRegion: "drag"}}>
        <HashRouter>
            {/* Leading Sidebar */}
            <div id="Sidebar" className="w-40 h-screen flex flex-wrap content-start flex-none" style={{backgroundColor: "#111225"}}>
                <div className="w-full h-10"></div>
                <div className="w-full h-20">
                    <div className="flex p-3 justify-center items-center">
                        <img className="h-12 w-12 rounded-full" src={getAvatarURL(props.user.avatarHash)}/>
                        <div className="text-white font-bold text-sm ml-4 align-middle">
                            {props.user.name}<br />
                            <span className="font-thin text-xs">{props.user.stateMessage}</span>
                        </div>
                    </div>
                </div>
                <Link className="text-sm w-full" to="/">
                    <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Home == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                        setCurrentPage(CurrentPage.Home);
                    }}>Home</div>
                </Link>
                <br />
                <div className="text-sm w-full cursor-pointer" onClick={() => window["electron"].window.loadURL(`https://steamcommunity.com/profiles/${props.user.steamid}`)}>
                    <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Profile</div>
                </div>
                <br />
                <div className="text-sm w-full cursor-pointer" onClick={() => window["electron"].currentUser.openSteam(`/chat/`)}>
                    <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Chat</div>
                </div>
                <br />
                <div className="text-sm w-full cursor-pointer" onClick={() => window["electron"].currentUser.openSteam(`/profiles/${props.user.steamid}/tradeoffers/`)}>
                    <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Trades</div>
                </div>
                <br />
                <div className="text-sm w-full cursor-pointer" onClick={() => window["electron"].currentUser.openSteam(`/profiles/${props.user.steamid}/inventory/`)}>
                    <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Inventory</div>
                </div>
                <br />
                <Link className="text-sm w-full cursor-pointer" to="/confirmations">
                    <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Confirmations == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                        setCurrentPage(CurrentPage.Confirmations);
                    }}>Confirmations</div>
                </Link>
                <br />
                <Link className="text-sm w-full cursor-pointer" to="/authenticator">
                    <div className={`font-bold text-md p-2 pl-4 ${CurrentPage.Authenticator == currentPage ? "text-white" : "text-gray-400"} hover:text-white`} onClick={() => {
                        setCurrentPage(CurrentPage.Authenticator);
                    }}>Authenticator</div>
                </Link>
                <br />
                <div className="text-sm w-full cursor-pointer" onClick={() => { props.setSwitchingAccounts(true) }}>
                    <div className="font-bold text-gray-400 text-md p-2 pl-4 hover:text-white">Switch Accounts</div>
                </div>
                <br />
            </div>

            <div id="Main" className="w-full overflow-hidden h-screen flex flex-wrap" style={{backgroundColor: "#0e0d1c"}}>
                    {/* Main body of the Desktop app, acting as SPA with components being swapped out inside here */}
                    <div id="MainContent" className="w-full h-full">
                        <Switch>
                            <Route exact path="/">
                                <Home user={props.user} accountsIdling={accountsIdling} setAccountsIdling={setAccountsIdling}/>
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
    </div>);
}

function getAvatarURL(hash) {
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash?.substr(0, 2) + "/" + hash + "_full.jpg";
}