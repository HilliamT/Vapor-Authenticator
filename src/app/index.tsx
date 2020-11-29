import LoginScreen from "./components/LoginScreen";

import React, { useEffect, useState } from "react";
import BaseScreen from "./components/BaseScreen";

export default function Index() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            setUser(await window["electron"].getUser());
        })();
    }, []);

    function updateUser() {
        setUser(window["electron"].getUser());
    }

    return (
        <div style={{WebkitAppRegion: "drag"}}>
            {!user && <LoginScreen updateUser={updateUser} />}
            {user && <BaseScreen user={user} />}
        </div>
    )
}