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

    function Status({ status })

    function Column({ groupId, empty, column }) {
        return (
        <>
            {!empty &&
            <div className={"column-" + column}>
                <p>Props: groupId={groupId}, empty={empty}</p>
                <p>{DB[groupId]["name"]}</p>
            </div>
            }

            {empty &&
            <div className={"column-" + column}>
                <p>You don't have a second group yet. When you do, this column will be filled with their statuses!</p>
            </div>
            }
        </>
        )
    }

    function NoGroupPrompt() {
        return (
            <div className="no-group-prompt">
                <p>You aren't in any groups! When you join one, your groupmates' statuses will appear here.</p>
            </div>
        )
    }

    return (
        <div className="content">
            <div className="welcome">
                <p style={{display: "inline"}}>Welcome Back, {DB["user"]["firstname"]}!  </p>
                <input type="button" value="Sign Out" onClick={handleSignOut} />
            </div>
            
            {/* the code below is fundamentally stupid code and will likely lead to bugs down the line and I will have to pull my hair trying to figure out what I was trying to write, but that's what code's about
            if 0 groups, <NoGroupPrompt />. if 1 group, <Column /> with data and <Column /> without data, if 2 groups, <Column /> <Column /> */}
            {DB["user"]["groups"].length > 0 ? <Column groupId={DB["user"]["groups"][0]} empty={false} column={1} /> && DB["user"]["groups"].length > 1 ? <Column groupId={DB["user"]["groups"][1]} empty={false} column={2} /> : <Column groupId={} empty={true} column={2} /> : <NoGroupPrompt /> }
            
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