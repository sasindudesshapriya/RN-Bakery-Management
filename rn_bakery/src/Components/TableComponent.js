import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableComponent.css'; 
import EditPopUpComponent from "./EditPopUpComponent";
import DeletePopUpComponent from './DeletePopUpComponent';
import ClonePopUpComponent from "./ClonePopUpComponent";

const TableComponent = ({ tableData = [], fetchData = () => {} }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [formData, setFormData] = useState({
        branch: '',
        date: '',
        session: 'morning',
        itemName: '',
        itemImage: null,
        issuedQuantity: '',
        returnedQuantity: '',
        price: '',
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);

    useEffect(() => {
        
    }, []);

    const openEditPopup = (itemId) => {
        const itemData = tableData.find(item => item.id === itemId);
        if (itemData) {
            setEditItemId(itemId);
            setFormData(itemData); // Pre-fill form with existing data
            setConfirmationPopupOpen(true);
        } else {
            console.error('Item not found:', itemId);
        }
    };

    const confirmEdit = () => {
        setConfirmationPopupOpen(false);
        setIsEditOpen(true);
    };

    const cancelEdit = () => {
        setConfirmationPopupOpen(false);
        setEditItemId(null);
    };

    const closeEditPopup = () => {
        setIsEditOpen(false);
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
        setEditItemId(null);
    };

    const handleEditSubmit = async (updatedFormData) => {
        try {
            await axios.put(`http://localhost:5000/update-item/${editItemId}`, updatedFormData);
            setMessage({ text: 'Item updated successfully!', type: 'success' });
            setIsEditOpen(false);
            fetchData(); // Refresh data after update
        } catch (error) {
            console.error('Error updating item:', error);
            setMessage({ text: 'Error updating item!', type: 'error' });
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/delete-item/${itemId}`);
            setMessage({ text: 'Item deleted successfully!', type: 'success' });
            fetchData(); // Refresh data after deletion
        } catch (err) {
            setMessage({ text: 'Error deleting item!', type: 'error' });
            console.error('Error deleting item:', err);
        }
    };

    const cloneItem = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5000/get-item/${itemId}`);
            const itemData = response.data;
            delete itemData.id; // Ensure ID is not duplicated

            await axios.post('http://localhost:5000/add-item', itemData);
            setMessage({ text: 'Item cloned successfully!', type: 'success' });
            fetchData(); // Refresh data after cloning
        } catch (err) {
            setMessage({ text: 'Error cloning item!', type: 'error' });
            console.error('Error cloning item:', err);
        }
    };

    return (
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Branch Name</th>
                            <th>Date</th>
                            <th>Session</th>
                            <th>Item Name</th>
                            <th>Item Image</th>
                            <th>Issued Quantity</th>
                            <th>Returned Quantity</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length ? tableData.map(item => (
                            <tr key={item.id}>
                                <td>{item.branch}</td>
                                <td>{item.date}</td>
                                <td>{item.session}</td>
                                <td>{item.itemName}</td>
                                <td>
                                    <img
                                        src={item.itemImage || 'https://via.placeholder.com/50'}
                                        alt={item.itemName}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{item.issuedQuantity}</td>
                                <td>{item.returnedQuantity}</td>
                                <td>{item.price}</td>
                                <td>{item.totalPrice}</td>
                                <td>
                                    <button className="edit-button" onClick={() => openEditPopup(item.id)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteItem(item.id)}>Delete</button>
                                    <button className="clone-button" onClick={() => cloneItem(item.id)}>Clone</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="10">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isEditOpen && (
                    <EditPopUpComponent
                        isOpen={isEditOpen}
                        formData={formData}
                        onChange={setFormData}
                        onSubmit={handleEditSubmit}
                        onCancel={closeEditPopup}
                    />
                )}
                {confirmationPopupOpen && (
                    <div className="confirmation-popup">
                        <p>Do you want to edit the form?</p>
                        <button className="confirm-edit-button" onClick={confirmEdit}>Confirm Edit</button>
                        <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
                    </div>
                )}
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
    );
};

export default TableComponent;
