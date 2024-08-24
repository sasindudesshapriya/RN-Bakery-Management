import React from 'react';
import './ClonePopUpComponent.css';

function ClonePopUpComponent({ isOpen, onSubmit, formData, onChange, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <form onSubmit={onSubmit}>
                    <h3>Clone Item</h3>
                    {/* Render the form fields */}
                    {formData && Object.keys(formData).map((key) => (
                        <label key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                            <input
                                type={key === 'date' ? 'date' : 'text'}
                                name={key}
                                value={formData[key]}
                                onChange={onChange}
                            />
                        </label>
                    ))}
                    <div className="popup-buttons">
                        <button type="submit">Clone</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClonePopUpComponent;
