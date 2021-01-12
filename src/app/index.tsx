import React, { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import BaseScreen from "./screens/BaseScreen";
import AccountScreen from "./screens/AccountScreen";

// Root component of Vapor
export default function Index() {
    const [user, setUser] = useState(null);

    // addNewAccount == true if logged-in user is adding new account
    const [addNewAccount, setAddNewAccount] = useState(false);
    const [switchingAccounts, setSwitchingAccounts] = useState(true);

    useEffect(() => {
        updateUser();
    }, []);

    async function updateUser() {
        setUser(await window["electron"].getUser());
    }

    return (<div>
        {user && <BaseScreen user={user} updateUser={updateUser} setAddNewAccount={setAddNewAccount} setSwitchingAccounts={setSwitchingAccounts} className="z-0" />}

        {switchingAccounts && !addNewAccount && <AccountScreen user={user} updateUser={updateUser} setSwitchingAccounts={setSwitchingAccounts} setAddNewAccount={setAddNewAccount} className="z-10" />}
        {addNewAccount && !switchingAccounts && <LoginScreen addNewAccount={addNewAccount} setSwitchingAccounts={setSwitchingAccounts} setAddNewAccount={setAddNewAccount} updateUser={updateUser} className="z-20" />}
    </div>)
}