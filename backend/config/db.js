const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'social_app'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        throw err;
    }
    console.log("MySQL Connected...");
});


console.log("PASSWORD:", process.env.DB_PASSWORD);
module.exports = db;