import React from 'react';

const EditPopUpComponent = ({ isOpen, formData, onChange, onSubmit, onCancel }) => {
    if (!formData) {
        return <div>Loading...</div>; // Handle the case where formData is null
    }

    return isOpen ? (
        <div className="edit-popup">
            <form onSubmit={onSubmit}>
                <label>
                    Branch:
                    <input type="text" name="branch" value={formData.branch} onChange={onChange} />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={formData.date} onChange={onChange} />
                </label>
                <label>
                    Session:
                    <select name="session" value={formData.session} onChange={onChange}>
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                    </select>
                </label>
                <label>
                    Item Name:
                    <input type="text" name="itemName" value={formData.itemName} onChange={onChange} />
                </label>
                <label>
                    Issued Quantity:
                    <input type="number" name="issuedQuantity" value={formData.issuedQuantity} onChange={onChange} />
                </label>
                <label>
                    Returned Quantity:
                    <input type="number" name="returnedQuantity" value={formData.returnedQuantity} onChange={onChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={formData.price} onChange={onChange} />
                </label>
                <button type="submit">Edit</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    ) : null;
};

export default EditPopUpComponent;
