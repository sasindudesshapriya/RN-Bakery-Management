const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Create and configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rn-bakery-management',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the process with an error code
    }
    console.log('MySQL Connected...');
});

// Configure multer to save uploaded images to the 'uploads' directory with unique filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Save images in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid duplicates
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file type");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve the uploaded images
app.use('/uploads', express.static(uploadsDir));

// POST route to add item
app.post('/add-item', (req, res) => {
    upload.single('itemImage')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err.message);
            return res.status(500).json({ error: 'Multer Error: ' + err.message });
        } else if (err) {
            console.error('Error uploading file:', err.message);
            return res.status(500).json({ error: 'Error uploading file: ' + err.message });
        }

        const { branch, date, session, itemName, issuedQuantity, returnedQuantity, price } = req.body;
        const totalPrice = (issuedQuantity * price) - (returnedQuantity * price);
        const itemImage = req.file ? req.file.filename : null; // Store the filename in the database

        const sql = 'INSERT INTO issued_items (branch, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [branch, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ error: 'Error inserting data into the database' });
            }
            res.json({ message: 'Item added to database!' });
        });
    });
});

// GET route to fetch items
app.get('/get-items', (req, res) => {
    console.log('GET /get-items route hit');
    const sql = 'SELECT * FROM issued_items';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Error fetching data from the database' });
        }
        console.log('Fetched Results:', results);
        const modifiedResults = results.map(item => {
            return {
                ...item,
                itemImage: item.itemImage ? `http://localhost:5000/uploads/${item.itemImage}` : null,
            };
        });
        res.json(modifiedResults);
    });
});

// PUT route to update an item by ID
app.put('/update-item/:id', (req, res) => {
    upload.single('itemImage')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err.message);
            return res.status(500).json({ error: 'Multer Error: ' + err.message });
        } else if (err) {
            console.error('Error uploading file:', err.message);
            return res.status(500).json({ error: 'Error uploading file: ' + err.message });
        }

        const { id } = req.params;
        const { branch, date, session, itemName, issuedQuantity, returnedQuantity, price } = req.body;
        const totalPrice = (issuedQuantity * price) - (returnedQuantity * price);
        const itemImage = req.file ? req.file.filename : null; // Update the image if a new one is uploaded

        const sql = `UPDATE issued_items SET branch = ?, date = ?, session = ?, itemName = ?, issuedQuantity = ?, returnedQuantity = ?, price = ?, totalPrice = ?${itemImage ? ', itemImage = ?' : ''} WHERE id = ?`;
        const values = itemImage ? [branch, date, session, itemName, issuedQuantity, returnedQuantity, price, totalPrice, itemImage, id] : [branch, date, session, itemName, issuedQuantity, returnedQuantity, price, totalPrice, id];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error updating item:', err);
                return res.status(500).json({ error: 'Error updating item in the database' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json({ message: 'Item updated successfully' });
        });
    });
});

// POST route to clone an item by ID
app.post('/clone-item/:id', (req, res) => {
    const { id } = req.params;

    const getItemSql = 'SELECT * FROM issued_items WHERE id = ?';
    db.query(getItemSql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching item for cloning:', err);
            return res.status(500).json({ error: 'Error fetching item from the database' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = result[0];
        const sql = 'INSERT INTO issued_items (branch, date, session, itemName, itemImage, issuedQuantity, returnedQuantity, price, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [item.branch, item.date, item.session, item.itemName, item.itemImage, item.issuedQuantity, item.returnedQuantity, item.price, item.totalPrice];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error cloning item:', err);
                return res.status(500).json({ error: 'Error cloning item in the database' });
            }
            res.json({ message: 'Item cloned successfully' });
        });
    });
});

// DELETE route to delete an item by ID
app.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM issued_items WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Error deleting item from the database' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

// Handling undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server startup error:', err);
    process.exit(1); // Exit the process with an error code
});
