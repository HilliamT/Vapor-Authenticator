import React from "react";
import Logo from "../screens/vapor.svg";

export default function Home() {
    return (<div className="m-2 flex">
        <div className="m-4 p-4 rounded bg-white shadow flex w-full justify-center">
            <img src={Logo} className="h-36 w-36" />
        </div>
    </div>)
}