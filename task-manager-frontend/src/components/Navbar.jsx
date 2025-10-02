import '../Navbar.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="site-title">Task Manager</Link>
            <div className="nav-links">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;