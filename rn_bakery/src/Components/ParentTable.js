import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent';

const ParentTable = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-items'); 
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <TableComponent tableData={data} fetchData={fetchData} />
        </div>
    );
};

export default ParentTable;
