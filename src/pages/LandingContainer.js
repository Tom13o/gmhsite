import React, {useContext} from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AuthContext } from "../auth.js";

export default function LandingContainer() {
    function SignUpButton() {
        const { currentUser } = useContext(AuthContext);
        return (
            <Link to={!!currentUser ? '/home' : '/signup'}>{!!currentUser ? 'Home' : 'Sign Up'}</Link>
        ) //FIXME: maybe something other than Home? maybe 'enter' or something?
    }

    return(
        <>
        <ul>
            <li><Link to="/">GMHSite</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><SignUpButton /></li>
        </ul>
        <Outlet />
        <div>Footer</div>
        </>
    )
}