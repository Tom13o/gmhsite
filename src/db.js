import React, { useContext, useEffect, useState } from 'react'
import { db } from '.';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './auth';

export const DBContext = React.createContext();

export function DBProvider({ children }) {
    const [DB, setDB] = useState({});
    const [fetched, setFetched] = useState(false);
    const { currentUser } = useContext(AuthContext);

    var tempDB = {};

    function getGroup(element) {
        return new Promise((resolve) => {
            getDoc(doc(db, "groups", element))
            .then(function (response2) {
                tempDB[element] = response2.data();
                resolve();
                // get the document of all users in all groups
            })
        })
    }
    
    const fetchData = async () => { // move fetched out of this function - why? so that other functions can simply fetch data without unrendering the app
        // get data code here
        // might have to use state?
        alert("among debug");
        tempDB = {};
        return new Promise(async function (resolve) {
            alert("amongst debug");
            await getDoc(doc(db, "users", currentUser.uid))
            .then(function (response) {
                alert("yippee");
                tempDB["user"] = response.data();
                const promiseArray = tempDB["user"]["groups"].map(getGroup);
                
                Promise.all(promiseArray).then(() => {
                    alert("fetched");
                    setDB(tempDB);
                    console.log("DB fetched. DB:");
                    console.dir(DB);
                    resolve();
                })
            }
            )
        })

    }
    
    useEffect(() => {
        fetchData().then(() => {
            setFetched(true);
        });
        // eslint-disable-next-line
    }, [])

    return (
        <DBContext.Provider
            value={{
                DB, setDB, fetchData, setFetched
            }}
        >
            {fetched && children} {/* only renders children if data is fetched */}
            {!fetched && <p>LOADING...</p>}
        </DBContext.Provider>
    );
}