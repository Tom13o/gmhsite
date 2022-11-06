import React, { useContext, useState } from 'react'
import { db } from "../index";
import { collection, addDoc, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { DBContext } from '../db';
import { AuthContext } from "../auth";

export default function Groups() {
    const { currentUser } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const { DB, setDB } = useContext(DBContext);
    const handleGroupCreation = async event => {
        event.preventDefault()
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
                    <div key={group}>
                    <p>{group}</p>
                    <p>{DB[group]["name"]}</p>
                    <input type="button" value="Leave Group (not functional)" />
                    </div>
                ))}
            </div>
            {/* Create group, leave group, view invites */}
        </>
    )
}