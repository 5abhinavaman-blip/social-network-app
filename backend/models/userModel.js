const db = require('../config/db');

// CREATE USER
exports.createUser = (username, email, password, callback) => {
    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [username, email, password], callback);
};

// FIND USER BY EMAIL
exports.findUserByEmail = (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], callback);
};

// FIND USER BY ID
exports.findUserById = (userId, callback) => {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sql, [userId], callback);
};

// GET ALL USERS
exports.getAllUsers = (callback) => {
    const sql = `SELECT user_id, username, email FROM users`;
    db.query(sql, callback);
};