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
            <p>Welcome Back, {DB["user"]["firstname"]}!</p>
            <p>{DB[DB["user"]["groups"][0]]["name"]}</p> {/* check if groups are fetched before home is rendered */}
            <input type="button" value="Sign Out" onClick={handleSignOut} />
            <div>
                
            </div>
        </div>
    )
}