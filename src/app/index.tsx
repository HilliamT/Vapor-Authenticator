import React, { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import BaseScreen from "./screens/BaseScreen";

// Root component of Vapor
export default function Index() {
    const [user, setUser] = useState(null);

    // addNewAccount == true if logged-in user is adding new account
    const [addNewAccount, setAddNewAccount] = useState(false);

    useEffect(() => {
        updateUser();
    }, []);

    async function updateUser() {
        setUser(await window["electron"].getUser());
    }

    return (<div style={{WebkitAppRegion: "drag"}}>
        {(!user || addNewAccount) && <LoginScreen addNewAccount={addNewAccount} setAddNewAccount={setAddNewAccount} updateUser={updateUser} />}
        {user && !addNewAccount && <BaseScreen user={user} updateUser={updateUser} setAddNewAccount={setAddNewAccount}/>}
    </div>)
}