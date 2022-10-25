import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import { DBContext } from '../db';

export default function Group() {
    const { groupID } = useParams();
    const { DB } = useContext(DBContext);

    return (
        <>
            <p>{DB[groupID][name]}</p>
        </>
    )
}