import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig.jsx';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --- JWT Helper Function ---
// Simple helper to decode base64 JWT payload (Not secure, but works for reading roles/username)
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Load initial state from local storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = decodeToken(token);
            if (payload) {
                // Assuming username is the subject (sub)
                setUser({ username: payload.sub, roles: payload.roles }); 
                setIsLoggedIn(true);
            } else {
                 // Token invalid/expired - clear it
                 localStorage.removeItem('token');
            }
        }
    }, []);

    const register = async (username, email, password) => {
        await api.post('/auth/register', { username, email, password });
        // After successful registration, log the user in immediately (optional)
        return login(username, password);
    };

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        const payload = decodeToken(token);
        setUser({ username: payload.sub, roles: payload.roles });
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
    };

    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};