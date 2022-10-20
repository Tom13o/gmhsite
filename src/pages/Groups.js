import React from 'react'

export default function Groups() {
    // literally every line of this disgusting code needs to be changed
    // this is an awful implementation but i'm using it to test the db rather than the UI
    // in future (near future please) use React state to show modal
    // i cant even test this code i don't know if it works
    return(
        <>
            <div className="addGroupModal" style="display: none">
                add group
            </div>
            Groups
            <input type="button" onClick={document.getElementsByClassName(addGroupModal)[0].style.display = "block"}>Create New Group</input>
            {/* Create group, leave group, view invites */}
        </>
    )
}