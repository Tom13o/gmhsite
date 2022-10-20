import React, { useContext } from 'react'
import { db } from "../index";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../auth";

export default function Groups() {
    const { currentUser } = useContext(AuthContext);
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
                }]
            });
            console.log("Group made with ID: ", groupRef.id);
            // add group to user group list
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
            <div className="addGroupModal" style="display: none">
                <form onSubmit={handleGroupCreation}>
                    <input name="groupname" type="text" placeholder="Group Name" />
                    <button type="submit">Create Group</button>
                </form>
            </div>
            Groups
            <input type="button" onClick={document.getElementsByClassName(addGroupModal)[0].style.display = "block"}>Create New Group</input>
            {/* Create group, leave group, view invites */}
        </>
    )
}