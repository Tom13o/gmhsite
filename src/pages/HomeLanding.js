import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DBProvider } from '../db';

export default function HomeLanding() {
    return(
        <>
            <DBProvider>
                <div className="vertical-nav">
                    <div className="logo-and-title">
                        <img src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png" alt="Watercooler Logo" />
                    </div>
                    <div className="pfp-and-username">
                        PFP @username
                    </div>
                    <Link to="/home">Home</Link>
                    {/*
                        Inbox?
                        Profile
                        Settings
                    */}
                        <Link to="/home/groups">Groups</Link>
                </div>
                <Outlet />
            </DBProvider>
        </>
    )
}