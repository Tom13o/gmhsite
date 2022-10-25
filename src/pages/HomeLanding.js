import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DBProvider } from '../db';

export default function HomeLanding() {
    return(
        <>
            <DBProvider>
            <div> {/* horizontal navigation */}
                {/*
                    PFP @username
                */}
                    <Link to="/home">Home</Link>
                {/*
                    Inbox?
                    Profile
                    Settings
                */}
            </div>
            <div> {/* content under horizontal nav */}
                <div> {/* vertical option bar */}
                    <Link to="/home/groups">Groups</Link>
                </div>
                <Outlet />
            </div>
            </DBProvider>
        </>
    )
}