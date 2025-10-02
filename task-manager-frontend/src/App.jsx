// task-manager-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
// Import your main CSS file
import './index.css'; // Assuming you have a basic index.css

// PrivateRoute component to protect the dashboard
export const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Dashboard Route */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />

                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

const App = () => (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
);

export default App;