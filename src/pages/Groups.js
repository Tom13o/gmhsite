import React, { useContext, useState } from 'react'
import { db } from "../index";
import { collection, addDoc, updateDoc, arrayUnion, doc, arrayRemove, deleteField } from "firebase/firestore";
import { DBContext } from '../db';
import { AuthContext } from "../auth";
import { Link } from 'react-router-dom';

export default function Groups() {
    const { currentUser } = useContext(AuthContext);
    const [addGroupModal, setAddGroupModal] = useState(false);
    const { fetchData, DB } = useContext(DBContext);

    const handleLeaveGroup = async event => {
        event.preventDefault();
        const target = event.target;
        const group = target.parentElement.dataset.groupid;
        if (DB[group]["members"][currentUser.uid]["owner"] === true) {
            alert("You are the owner of this group! To leave, either transfer ownership before leaving, or delete the group.")
        } else {
            await updateDoc(doc(db, "groups", group), {
                [`members.${currentUser.uid}`]: deleteField()
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
        setAddGroupModal(false);
        const { groupname } = event.target.elements;
        const groupnamevalue = groupname.value;
        groupname.value = "";
        // clear the groupname input
        try {
            const date = Date();
            const groupRef = await addDoc(collection(db, "groups"), {
                name: groupnamevalue,
                members: {
                    [currentUser.uid]: {
                        joinDate: date,
                        statuses: [],
                        owner: true,
                        username: DB["user"]["username"],
                        firstname: DB["user"]["firstname"],
                        lastname: DB["user"]["lastname"]
                        // pronouns: DB["user"]["pronouns"]
                }},
                invitedMembers: {}
            });
            console.log("Group made with ID: ", groupRef.id);
            await updateDoc(doc(db, "users", currentUser.uid), {
                groups: arrayUnion(groupRef.id)
            })
            fetchData();
        } catch (error) {
            alert(error);
        }
    }

    // this code might still be doodoo im not sure
    return(
        <>
            <div className="add-group-modal" style={{display: addGroupModal ? "block" : "none"}}  onClick={(event) => {if (event.target === event.currentTarget){setAddGroupModal(false)}}}>
                <form onSubmit={handleGroupCreation}>
                    <input type="button" className='cancel-add-group' value="X" onClick={() => setAddGroupModal(false)}></input>
                    <h1>Create New Group</h1>
                    <input name="groupname" type="text" placeholder="Group Name" />
                    <br />
                    <button type="submit">Create Group</button>
                </form>
            </div>
            Groups
            <input type="button" onClick={() => setAddGroupModal(true)} value="Create New Group" />
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