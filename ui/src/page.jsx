import React from 'react';
import { NavLink } from 'react-router-dom';
import Contents from './contents.jsx';

function NavBar() {
    return (
        <nav>
            <NavLink exact to="/">Home</NavLink>
            {' | '}
            <NavLink to="/issues">Issue List</NavLink>
            {' | '}
            <NavLink to="/report">Report</NavLink>
        </nav>
    );
}


export default function Page() {
    return (
        <>
            <NavBar />
            <Contents />
        </>
    );
}
