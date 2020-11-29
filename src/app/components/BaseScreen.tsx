import React from "react";

export default function BaseScreen(props) {
    return (
        <div>
            <div className="flex w-full">
                <div id="Sidebar" className="w-5 h-full bg-blue-700"></div>
                <div id="MainContent w-fill">
                    <div id="Topbar"></div>
                </div>
            </div>
            <div className="">{props.user.accountid}</div>
        </div>
        
    )
}