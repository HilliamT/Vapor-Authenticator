import LoginScreen from "./components/LoginScreen";

import React, { useState } from "react";

export default function Index() {
    const [user, setUser] = useState(window["electron"].getUser());

    function updateUser() {
        setUser(window["electron"].getUser());
    }

    return (
        <div>
            {user && <div>{user.accountid}</div>}
            {!user && <LoginScreen updateUser={updateUser} />}
        </div>
    )
}