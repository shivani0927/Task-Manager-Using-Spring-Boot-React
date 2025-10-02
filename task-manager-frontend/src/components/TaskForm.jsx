import React, { useState, useEffect } from 'react';

const TaskForm = ({ initialData, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Load data when a task is selected for editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
        } else {
            setTitle('');
            setDescription('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Title is required!');
            return;
        }

        // Pass the data up to the Dashboard to handle the API call
        onSave({ title, description });

        // Reset form after successful save
        setTitle('');
        setDescription('');
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        if (onCancel) {
            onCancel(); // Call the function to clear the editing state in the parent
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Task Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="form-actions">
                <button type="submit">{initialData ? 'Update Task' : 'Add Task'}</button>
                {initialData && (
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;