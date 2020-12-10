import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

export default function AccountScreen(props) {
    const [accounts, setAccounts] = useState({});
    const [switchingUser, setSwitchingUser] = useState(false);

    useEffect(() => {
        (async () => setAccounts(await window["electron"].getAllAccounts()))();
    }, []);

    function renderAccounts() {
        const elems = [];
        for (const account_name in accounts) {
            elems.push(<div className={`h-32 w-32 flex-none flex cursor-pointer hover:bg-black hover:bg-opacity-20 m-3`}
                key={account_name} onClick={() => {
                    setSwitchingUser(true);
                    window["electron"].setCurrentUser(account_name).then(() => {
                        props.updateUser().then(() => setSwitchingUser(false));
                        props.setSwitchingAccounts(false);
                    });
                }}>
                    <img className="m-auto h-32 w-32 rounded" src={getAvatarURL(accounts[account_name].avatarHash)}/>
            </div>);
        }

        elems.push(<div className="h-32 w-32 flex-none flex cursor-pointer hover:bg-black hover:bg-opacity-50 m-3"
            key="add" onClick={() => {
                props.setAddNewAccount(true);
                props.setSwitchingAccounts(false);
            }}>
                <div className="m-auto h-32 w-32 rounded bg-black bg-opacity-10 justify-center content-center flex">
                    <FontAwesomeIcon icon={faPlus} className="m-auto h-16 w-16" color="white" opacity="20%" />
                </div>
            </div>);

        return elems;
    }

    return (<div>
        {switchingUser && <div className="absolute w-full h-full bg-black bg-opacity-20 z-10"></div>}
        <div style={{backgroundColor: "#0e0d1c"}} className="p-12 justify-center items-start h-screen w-screen">
            
            <div id="ScreenTitle" className="text-4xl font-bold text-white my-3">Which account will you choose today?</div>
            <br />
            <div id="ScreenContents" className="flex flex-wrap">
                {renderAccounts()}
            </div>
        </div>
    </div>);
}

function getAvatarURL(hash) {
    return "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" + hash?.substr(0, 2) + "/" + hash + "_full.jpg";
}