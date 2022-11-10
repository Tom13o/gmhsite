import React, { useContext } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { DBContext } from '../db';
import { isToday } from '../App';

export default function HomePage() {
    const { DB } = useContext(DBContext);

    const auth = getAuth();
    const nav = useNavigate();
    function handleSignOut() {
        signOut(auth); //FIXME: isn't this a terrible way to handle this? try?
        nav("/"); //FIXME: i guess this could also be back to the login page? something to think about
    }

    function Status({ member, group }) {
        // in group settings, toggle between using FirstnameLastname and Username for statuses
        const status = member["statuses"][member["statuses"].length - 1];
        return (
            <div>
                <p>{member["firstname"]} is feeling...</p>
                <p>{status["feeling"]},</p>
                <p>with a rating of {status["rating"]}</p>
                <p>Today they will:</p> {/* add pronoun functionality */}
                <p>{status["task"]}</p>
            </div>
        )
    }

    // isToday(member["statuses"][member["statuses"].length-1]["date"]))

    function Column({ groupId, empty, column }) {
        // add key
        return (
        <>
            {!empty &&
            <div className={"column-" + column}>
                <p>Props: groupId={groupId}, empty={empty ? "True" : "False"}</p>
                <p>{DB[groupId]["name"]}</p>
                <Link to={"/home/groups/" + groupId}>Group Page</Link>

                {Object.keys(DB[groupId]["members"]).map(member => (
                    DB[groupId]["members"][member]["statuses"].length !== 0 && isToday(DB[groupId]["members"][member]["statuses"][DB[groupId]["members"][member]["statuses"].length - 1]["date"]) ? <Status key={member} member={DB[groupId]["members"][member]} group={groupId} /> : <></>
                ))}

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
                <p>Welcome Back, {DB["user"]["firstname"]}!</p>
                <input type="button" value="Sign Out" onClick={handleSignOut} />
            </div>
            
            {/* if 0 groups, <NoGroupPrompt />. if 1 group, <Column /> with data and <Column /> without data, if 2 groups, <Column /> <Column /> */}
            {DB["user"]["groups"].length > 0 ? <Column groupId={DB["user"]["groups"][0]} empty={false} column={1} /> : <NoGroupPrompt />}
            
            {DB["user"]["groups"].length > 1 && <Column groupId={DB["user"]["groups"][1]} empty={false} column={2} />}
            {DB["user"]["groups"].length === 1 && <Column empty={true} column={2} />}

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