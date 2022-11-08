import React, { useContext, useState } from 'react'
import { db } from "../index";
import { collection, addDoc, updateDoc, arrayUnion, doc, arrayRemove } from "firebase/firestore";
import { DBContext } from '../db';
import { AuthContext } from "../auth";
import { Link } from 'react-router-dom';

export default function Groups() {
    const { currentUser } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const { fetchData, DB, setDB } = useContext(DBContext);

    const handleLeaveGroup = async event => {
        event.preventDefault();
        const target = event.target;
        const group = target.parentElement.dataset.groupid;
        console.dir(group);
        const userInGroup = DB[group]["members"].filter(member => member.id === currentUser.uid)[0];
        if (userInGroup["owner"] === true) {
            alert("You are the owner of this group! To leave, either transfer ownership before leaving, or delete the group.")
        } else {
            await updateDoc(doc(db, "groups", group), {
                members: arrayRemove(userInGroup)
            })
            .then(
                await updateDoc(doc(db, "users", currentUser.uid), {
                    groups: arrayRemove(group)
                })
                .then(() => {
                    fetchData();
                })
            )
        }
    }

    const handleGroupCreation = async event => {
        event.preventDefault();
        // do not allow group creation if name is empty
        setModal(false);
        const { groupname } = event.target.elements;
        try {
            const groupRef = await addDoc(collection(db, "groups"), {
                name: groupname.value,
                members: [{
                    id: currentUser.uid,
                    // joinDate: ,
                    status: {},
                    pastStatuses: [],
                    owner: true
                }],
                invitedMembers: []
            });
            console.log("Group made with ID: ", groupRef.id);
            await updateDoc(doc(db, "users", currentUser.uid), {
                groups: arrayUnion(groupRef.id)
            })
            var tempDB = DB;
            tempDB[groupRef.id] = {
                name: groupname.value,
                members: [{
                    id: currentUser.uid,
                    // joinDate: ,
                    status: {},
                    pastStatuses: [],
                    owner: true
                }],
                invitedMembers: []
            }
            tempDB["user"]["groups"].push(groupRef.id);
            setDB(tempDB);
            fetchData();
            // reload data fetch, or add group document directly to DBContext
        } catch (error) {
            alert(error);
        }
    }

    // this code might still be doodoo im not sure
    return(
        <>
            <div className="add-group-modal" style={{display: modal ? "block" : "none"}}  onClick={(event) => {if (event.target === event.currentTarget){setModal(false)}}}>
                <form onSubmit={handleGroupCreation}>
                    <input type="button" className='cancel-add-group' value="X" onClick={() => setModal(false)}></input>
                    <p>Create New Group</p>
                    <input name="groupname" type="text" placeholder="Group Name" />
                    <br />
                    <button type="submit">Create Group</button>
                </form>
            </div>
            Groups
            <input type="button" onClick={() => setModal(!modal)} value="Create New Group" />
            <div>
                {DB["user"]["groups"].map(group => (
                    <div key={group} data-groupid={group}>
                    <p>{group}</p>
                    <p>{DB[group]["name"]}</p>
                    <Link to={"/home/groups/" + group}>Group Page</Link>
                    <input type="button" value="Leave Group" onClick={handleLeaveGroup}/>
                    </div>
                ))}
            </div>
            {/* Create group, leave group, view invites */}
        </>
    )
}