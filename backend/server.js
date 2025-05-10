// Required packages
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'sql3.freesqldatabase.com',
  user: 'sql3774622',
  password: 'ugwzw1FQai',
  database: 'sql3774622'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// ---------- Data Access Object (DAO) Functions ---------- //

// Get all users with their address and identification
app.get('/users', (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id, u.name, u.dob, u.gender, u.nationality, u.email, u.phone,
      a.street, a.city, a.state, a.postal_code, a.country,
      i.id_type, i.id_number, i.expiry_date
    FROM user u
    LEFT JOIN address a ON u.id = a.user_id
    LEFT JOIN identification i ON u.id = i.user_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get a specific user by ID with address and identification
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      u.id AS user_id, u.name, u.dob, u.gender, u.nationality, u.email, u.phone,
      a.street, a.city, a.state, a.postal_code, a.country,
      i.id_type, i.id_number, i.expiry_date
    FROM user u
    LEFT JOIN address a ON u.id = a.user_id
    LEFT JOIN identification i ON u.id = i.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Insert new user with address and identification (with validation)
app.post('/users', (req, res) => {
  const { name, dob, gender, nationality, email, phone, address, identification } = req.body;

  // Validation
  const missingFields = [];
  const requiredUserFields = { name, dob, gender, email, phone };
  const requiredAddressFields = address || {};
  const requiredIDFields = identification || {};

  for (const [key, value] of Object.entries(requiredUserFields)) {
    if (!value || value.trim() === '') missingFields.push(`user.${key}`);
  }
  ['street', 'city', 'state', 'postal_code', 'country'].forEach(field => {
    if (!requiredAddressFields[field] || requiredAddressFields[field].trim() === '') {
      missingFields.push(`address.${field}`);
    }
  });
  ['id_type', 'id_number', 'expiry_date'].forEach(field => {
    if (!requiredIDFields[field] || requiredIDFields[field].trim() === '') {
      missingFields.push(`identification.${field}`);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const insertUserQuery = `
    INSERT INTO user (name, dob, gender, nationality, email, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertUserQuery, [name, dob, gender, nationality, email, phone], (err, userResult) => {
    if (err) return res.status(500).json({ error: 'Failed to insert user', details: err });

    const userId = userResult.insertId;

    const insertAddressQuery = `
      INSERT INTO address (user_id, street, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const insertIdQuery = `
      INSERT INTO identification (user_id, id_type, id_number, expiry_date)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertAddressQuery, [
      userId,
      address.street,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to insert address', details: err });

      db.query(insertIdQuery, [
        userId,
        identification.id_type,
        identification.id_number,
        identification.expiry_date
      ], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to insert identification', details: err });

        res.status(201).json({ message: 'User, address, and identification added successfully', userId });
      });
    });
  });
});

// Update user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, dob, gender, nationality, email, phone } = req.body;
  const sql = 'UPDATE user SET name = ?, dob = ?, gender = ?, nationality = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, dob, gender, nationality, email, phone, userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User updated successfully' });
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User deleted successfully' });
  });
});

app.get('/transactions/user/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT * FROM transactions
    WHERE user_id = ?
    ORDER BY user_id DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch transactions', details: err });
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});