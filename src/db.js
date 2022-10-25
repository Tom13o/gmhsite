import React, { useContext, useEffect, useState } from 'react'
import { db } from '.';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './auth';

export const DBContext = React.createContext();

export function DBProvider({ children }) {
    const [DB, setDB] = useState({});
    const [fetched, setFetched] = useState(false);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        var tempDB = {};
        const fetchData = async () => {
            // get data code here
            // might have to use state?
                await getDoc(doc(db, "users", currentUser.uid))
                    .then(function (response) {
                        tempDB["user"] = response.data();
                        console.dir(response.data());
                        tempDB["user"]["groups"].forEach(element => {
                            getDoc(doc(db, "groups", element))
                                .then(function (response2) {
                                    tempDB[element] = response2.data();
                                    console.dir(response2.data());
                                    // get the document of all users in all groups
                                })
                        });
                    }
                )
            // set code here
            setDB(tempDB);
            console.dir(tempDB);
            setFetched(true);
        }

        fetchData()
        .catch(console.error);
    }, [])

    return (
        <DBContext.Provider
            value={{
                DB
            }}
        >
            {fetched && children} {/* only renders children if data is fetched */}
        </DBContext.Provider>
    );
}