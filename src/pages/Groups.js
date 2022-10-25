import React, { useContext, useState } from 'react'
import { db } from "../index";
import { collection, addDoc, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { DBContext, DBProvider } from '../db';
import { AuthContext } from "../auth";

export default function Groups() {
    const { currentUser } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const { DB } = useContext(DBContext);
    const handleGroupCreation = async event => {
        event.preventDefault()
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
            tempDB[currentUser]["groups"].push(groupRef.id);
            DBProvider.setDB(tempDB);
            // reload data fetch, or add group document directly to DBContext
        } catch (error) {
            alert(error);
        }
    }
    // literally every line of this disgusting code needs to be changed
    // this is an awful implementation but i'm using it to test the db rather than the UI
    // in future (near future please) use React state to show modal
    // i cant even test this code i don't know if it works
    return(
        <>
            <div className="add-group-modal" style={{display: modal ? "block" : "none", position: "absolute", top: "400px", left: "100px"}}> {/* why */}
                <form onSubmit={handleGroupCreation}>
                    <input name="groupname" type="text" placeholder="Group Name" />
                    <button type="submit">Create Group</button>
                </form>
            </div>
            Groups
            <input type="button" onClick={() => setModal(!modal)} value="Create New Group" />
            <div>
                {DB[currentUser.uid]["groups"].map(group => (
                    <>
                    <p>{group}</p>
                    <p>{DB[group]["name"]}</p>
                    <input type="button" value="Leave Group (not functional)" />
                    </>
                ))}
            </div>
            {/* Create group, leave group, view invites */}
        </>
    )
}