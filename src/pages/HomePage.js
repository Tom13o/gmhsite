import React, { useContext } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { DBContext } from '../db';

export default function HomePage() {
    const { DB } = useContext(DBContext);

    const auth = getAuth();
    const nav = useNavigate();
    function handleSignOut() {
        signOut(auth); //FIXME: isn't this a terrible way to handle this? try?
        nav("/"); //FIXME: i guess this could also be back to the login page? something to think about
    }

    return (
        <div className="content">
            <div className="welcome">
                <p style={{display: "inline"}}>Welcome Back, {DB["user"]["firstname"]}!  </p>
                <input type="button" value="Sign Out" onClick={handleSignOut} />
            </div>
            <div className="column-one">
                <p>{DB["user"]["groups"].length > 0 ? DB[DB["user"]["groups"][0]]["name"] : ""}</p>
            </div>
            <div className="column-two">
                <p>{DB["user"]["groups"].length > 1 ? DB[DB["user"]["groups"][1]]["name"] : "You don't have a second group yet. When you do, this column will be filled with their statuses!"}</p>
            </div>
            <div className="pulse"></div>
            <div className="post-status-prompt">
                {/* You haven't posted a status!
                    Do you want to share how you're feeling today?
                    Sure!
                    I don't feel like it. */}
            </div>
        </div>
    )
}