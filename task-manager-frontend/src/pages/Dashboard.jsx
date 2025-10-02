import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null); // For update

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [isLoggedIn, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            alert('Could not load tasks.');
        }
    };

    // --- CRUD Handlers ---
    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                // UPDATE
                await api.put(`/tasks/${editingTask.id}`, taskData);
                alert('Task updated successfully!');
            } else {
                // CREATE
                await api.post('/tasks', taskData);
                alert('Task created successfully!');
            }
            setEditingTask(null);
            fetchTasks(); // Refresh list
        } catch (error) {
            const msg = error.response?.data || 'Operation failed.';
            alert(`Error: ${msg}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                alert('Task deleted successfully!');
                fetchTasks(); // Refresh list
            } catch (error) {
                const msg = error.response?.data || 'Deletion failed.';
                alert(`Error: ${msg}`);
            }
        }
    };

    if (!isLoggedIn) return null; // Should redirect via useEffect, but safe guard

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user?.username || 'User'}!</h2>
            <button onClick={logout}>Log Out</button>

            <div className="task-management">
                <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                <TaskForm 
                    initialData={editingTask} 
                    onSave={handleSaveTask} 
                    onCancel={() => setEditingTask(null)}
                />
            </div>

            <div className="task-list">
                <h3>Your Tasks</h3>
                {tasks.length === 0 ? (
                    <p>No tasks found. Create one above!</p>
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <strong>{task.title}</strong>: {task.description}
                                <div className="actions">
                                    <button onClick={() => setEditingTask(task)}>Edit</button>
                                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;