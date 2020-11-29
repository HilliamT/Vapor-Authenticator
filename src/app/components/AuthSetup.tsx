import React from "react";

export default function AuthSetup() {
    return (
        <div className="p-4">
            <button onClick={() => {
                
                console.log(window["electron"].authenticate.setupDesktopAuth());
            }}>Set up authentication</button>
        </div>
    )
}