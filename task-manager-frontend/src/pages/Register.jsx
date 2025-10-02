import '../Auth.css';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // register function internally calls the API and then logs in
            await register(username, email, password); 
            alert('Registration successful! You are now logged in.'); 
            navigate('/dashboard'); 
        } catch (err) {
            // Handles backend errors like 409 Conflict (username/email exists)
            const msg = err.response?.data || 'Registration failed.';
            setError(msg);
        }
    };

    return (
        <div className="auth-container">
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password (min 6 chars)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    minLength="6"
                    required 
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default Register;