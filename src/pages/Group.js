import React, { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DBContext } from '../db';
import { AuthContext } from '../auth';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '..';

export default function Group() {
    const { groupID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const { DB, fetchData } = useContext(DBContext);
    const navigate = useNavigate();

    const handleDeleteGroup = async event => {

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

    return (
        <>
            <p>{DB[groupID]["name"]}</p>
            <input type="button" value="Delete Group" onClick={handleDeleteGroup}/>
        </>
    )
}