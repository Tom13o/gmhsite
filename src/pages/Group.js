import React, { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DBContext } from '../db';
import { AuthContext } from '../auth';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '..';
import { useState } from 'react';

export default function Group() {
    const { groupID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { DB, fetchData } = useContext(DBContext);
    const [addStatusModal, setAddStatusModal] = useState(false);
    const navigate = useNavigate();

    const handleDeleteGroup = async () => {

        function deleteUserFromGroup(element) {
            return new Promise((resolve) => {
                if (element["id"] !== currentUser.uid) {
                    updateDoc(doc(db, "users", element["id"]), {
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

        const promiseArray = DB[groupID]["members"].map(deleteUserFromGroup);
        
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

    const isToday = date => {
        const today = new Date();
        return (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear())
    }

    const handleAddStatus = async event => {
        event.preventDefault();
        const { chosenGroup, feeling, rating, task } = event.target.elements;
        alert(feeling.value + " " + rating.value + " " + task.value);
        alert("This will actually post a status soon. WIP");
        // remember username in status
        fetchData()
        .then(async () => {
            alert("0");
            for (var i = 0; i < DB[chosenGroup]["members"].length; i++) {
                alert("1");
                const member = DB[chosenGroup]["members"][i];
                if (member["id"] === currentUser.uid) {
                    alert("2")
                    if (member["statuses"].length !== 0) {
                        alert("3")
                        if (isToday(Date(member["statuses"][member["statuses"].length-1]["date"]))) {
                            alert("4")
                            alert("Most recent status was today.")
                        } else {
                            alert("5")
                            await updateDoc(doc(db, "groups", chosenGroup), {
                                
                                [`members.${i}.statuses`]: arrayUnion(
                                    {
                                    feeling: feeling,
                                    rating: rating,
                                    task: task,
                                    date: Date()
                                    }
                                )
                            })
                        }
                    }
                }
            }
        })
    }

    // TODO: improve form for accessiblity

    return (
        <>
            <div className="add-status-modal" style={{display: addStatusModal ? "block" : "none"}}>
                <form onSubmit={handleAddStatus}>
                    <input type="button" className='cancel-add-status' value="X" onClick={() => setAddStatusModal(false)}></input>
                    <h1>Add Today's Status</h1>
                    <select name="chosenGroup">
                        {DB["user"]["groups"].map(group => (
                            <option key={group} value={group} selected={group === groupID}>{DB[group]["name"]}</option>
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