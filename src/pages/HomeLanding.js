import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DBProvider } from '../db';
import './styles/HomePage.css'

export default function HomeLanding() {
    return (
        <>
            <DBProvider>
                <div className="nav-and-content">
                    <ul className="vertical-nav">
                        <li className="logo-and-title">
                            <img src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png" alt="Watercooler Logo" />
                            <p className="title">Watercooler</p>
                        </li>
                        <li className="pfp-and-username">
                            PFP @username
                            {/* Links to profile */}
                        </li>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/notifications">Notifications</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><Link to="/home/groups">Groups</Link></li>
                    </ul>
                    <Outlet />
                </div>
            </DBProvider>
        </>
    )
}