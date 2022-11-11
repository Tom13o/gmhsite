import React, { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DBContext } from '../db';
import { AuthContext } from '../auth';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '..';
import { useState } from 'react';
import { isToday } from '../App';

export default function Group() {
    const { groupID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { DB, fetchData } = useContext(DBContext);
    const [addStatusModal, setAddStatusModal] = useState(false);
    const navigate = useNavigate();

    const handleDeleteGroup = async () => {

        function deleteUsersFromGroup(key) {
            return new Promise((resolve) => {
                if (key !== currentUser.uid) {
                    updateDoc(doc(db, "users", key), {
                        groups: arrayRemove(groupID)
                    })
                    .then(() => {
                        resolve();
                    })
                } else {
                    resolve();
                }
            })
        }

        const promiseArray = Object.keys(DB[groupID]["members"]).map(deleteUsersFromGroup);
        
        Promise.all(promiseArray).then(async function () {
            await deleteDoc(doc(db, "groups", groupID))
            .then(
                await updateDoc(doc(db, "users", currentUser.uid), {
                    groups: arrayRemove(groupID)
                })
                .then(() => {
                    navigate("/home/groups");
                    fetchData();
                })
            )
        })
    }

    const handleAddStatus = async event => {
        event.preventDefault();
        const { chosenGroup, feeling, rating, task } = event.target.elements;
        alert(feeling.value + " " + rating.value + " " + task.value + " " + chosenGroup.value);
        fetchData()
        .then(async () => {
            const member = DB[chosenGroup.value]["members"][currentUser.uid];
            if (member["statuses"].length === 0
                            ||
            !isToday(member["statuses"][member["statuses"].length-1]["date"])) {
                await updateDoc(doc(db, "groups", chosenGroup.value), {
                    [`members.${currentUser.uid}.username`]: DB["user"]["username"],
                    [`members.${currentUser.uid}.firstname`]: DB["user"]["firstname"],
                    [`members.${currentUser.uid}.lastname`]: DB["user"]["lastname"],
                    // [`members.${currentUser.uid}.pronouns`]: DB["user"]["pronouns"],
                    [`members.${currentUser.uid}.statuses`]: arrayUnion(
                        {
                        feeling: feeling.value,
                        rating: rating.value,
                        task: task.value,
                        date: Date()
                        }
                    )
                }).then(() => {
                    setAddStatusModal(false);
                    fetchData();
                })
            } else {
                alert("You've already posted a status today!"); // do this a different way pls
                setAddStatusModal(false);
            }
        })
    }

    // TODO: improve form for accessiblity

    return (
        <>
            <div className="add-status-modal" style={{display: addStatusModal ? "block" : "none"}} onClick={(event) => {if (event.target === event.currentTarget){setAddStatusModal(false)}}}>
                <form onSubmit={handleAddStatus}>
                    <input type="button" className='cancel-add-status' value="X" onClick={() => setAddStatusModal(false)}></input>
                    <h1>Add Today's Status</h1>
                    <select name="chosenGroup" defaultValue={groupID}>
                        {DB["user"]["groups"].map(group => (
                            <option key={group} value={group}>{DB[group]["name"]}</option>
                        ))}
                    </select>
                    <br />
                    <p>Today, {DB["user"]["firstname"]} is feeling...</p><input name="feeling" type="text" placeholder="?" />
                    <br/>
                    <p>How good/motivated do you feel?</p>
                    <input type="range" name="rating" min="1" max="10" defaultValue="5" onChange={() => document.getElementById("rangeValueP").textContent = document.getElementsByName("rating")[0].value + "/10"}/> {/* moves when value reaches 10 */}
                    <p id="rangeValueP">5/10</p>
                    <br />
                    <p>Today, you will...</p><input name="task" type="text" placeholder="do what?"/>
                    <br />
                    <button type="submit">Post Status</button>
                </form>
            </div>
            <p>{DB[groupID]["name"]}</p>
            <input type="button" value="Delete Group" onClick={handleDeleteGroup}/>
            <button onClick={() => setAddStatusModal(true)}>Add Status</button> {/* Add if no status, Edit if status exits */}
        </>
    )
}