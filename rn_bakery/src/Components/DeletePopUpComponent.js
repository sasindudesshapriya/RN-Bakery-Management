import React from 'react';
import './DeletePopUpComponent.css'; 

function DeletePopUpComponent({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <p>Are you sure you want to delete this record?</p>
                <div className="popup-buttons">
                    <button onClick={onConfirm}>Confirm Delete</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeletePopUpComponent;
