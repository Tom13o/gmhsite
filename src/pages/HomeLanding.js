import React from 'react';
import { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DBContext, DBProvider } from '../db';
import './styles/HomePage.css'

export default function HomeLanding() {
    return (
        <>
            <DBProvider>
                <div className="nav-and-content">
                    <ul className="vertical-nav">
                        <li className="logo-and-title">
                            <Link to="/home">
                                <img src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png" alt="Watercooler Logo" />
                                <p className="title">Watercooler</p>
                            </Link>
                        </li>
                        <li className="pfp-and-username">
                            <Link to="/profile">PFP @username</Link>
                            {/* Links to profile */}
                        </li>
                        <li><Link to="/notifications">Notifications</Link></li>
                        <li><Link to="/home/groups">Groups</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><RefreshButton></RefreshButton></li>
                    </ul>
                    <Outlet />
                </div>
            </DBProvider>
        </>
    )
}

function RefreshButton() {
    const { fetchData, setFetched } = useContext(DBContext);

    return (
        <input type="button" value="Refresh" onClick={() => {
            setFetched(false);
            fetchData()
        }}/>
    )
}