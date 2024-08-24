import React, { useState } from 'react';
import axios from 'axios';
import './FormComponent.css'; // Ensure this path is correct

function FormComponent() {
    const [editMode, setEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [formData, setFormData] = useState({
        branch: '',
        date: '',
        session: 'morning',
        itemName: '',
        issuedQuantity: '',
        returnedQuantity: '',
        price: '',
        itemImage: null,
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "itemImage") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const calculateTotalPrice = () => {
        return (formData.issuedQuantity * formData.price) - (formData.returnedQuantity * formData.price);
    };

    const validateForm = () => {
        const { branch, date, session, itemName, issuedQuantity, returnedQuantity, price } = formData;
        return branch && date && session && itemName && issuedQuantity && returnedQuantity && price;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage({ text: 'Please fill out all required fields.', type: 'error' });
            return;
        }

        const calculatedTotalPrice = calculateTotalPrice();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        data.append('totalPrice', calculatedTotalPrice);

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/update-item/${editItemId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ text: 'Item updated successfully!', type: 'success' });
            } else {
                await axios.post('http://localhost:5000/add-item', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ text: 'Data submitted successfully!', type: 'success' });
            }

            // Delay resetting the form to ensure the message is visible
            setTimeout(() => {
                handleReset(); 
            }, 3000); // Reset form after 3 seconds

        } catch (err) {
            console.error('Error submitting data:', err);
            setMessage({ text: 'Error submitting data!', type: 'error' });
        }
    };

    const handleReset = () => {
        setFormData({
            branch: '',
            date: '',
            session: 'morning',
            itemName: '',
            itemImage: null,
            issuedQuantity: '',
            returnedQuantity: '',
            price: '',
        });
        setEditMode(false);
        setEditItemId(null);
    };

    return (
        <div className='body'>
            <div className="form-container">
                <p className="form-instructions">Fill the below form field.</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label>
                        Branch Name:
                        <select name="branch" value={formData.branch} onChange={handleChange}>
                            <option value="">Select a branch</option>
                            <option value="Kandy">Kandy</option>
                            <option value="Matale">Matale</option>
                            <option value="Kurunegala">Kurunegala</option>
                            <option value="Kegalle">Kegalle</option>
                            <option value="Rathnapura">Rathnapura</option>
                            <option value="Gampaha">Gampaha</option>
                            <option value="Colombo">Colombo</option>
                        </select>
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" value={formData.date} onChange={handleChange} />
                    </label>
                    <label>
                        Session:
                        <select name="session" value={formData.session} onChange={handleChange}>
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                        </select>
                    </label>
                    <p className="itemDetails">
                        <strong>Item Details</strong>
                    </p>
                    <label>
                        Item Name:
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} />
                    </label>
                    <label>
                        Item Image:
                        <input type="file" name="itemImage" onChange={handleChange} />
                    </label>
                    <label>
                        Issued Quantity:
                        <input type="number" name="issuedQuantity" value={formData.issuedQuantity} onChange={handleChange} />
                    </label>
                    <label>
                        Returned Quantity:
                        <input type="number" name="returnedQuantity" value={formData.returnedQuantity} onChange={handleChange} />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="price" value={formData.price} onChange={handleChange} />
                    </label>
                    <label>
                        Total Price:
                        <input type="text" value={calculateTotalPrice()} readOnly />
                    </label>
                    <div className="button-container">
                        <button type="submit" className="add-item-button">{editMode ? 'Update Item' : 'Add Item'}</button>
                        <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormComponent;
