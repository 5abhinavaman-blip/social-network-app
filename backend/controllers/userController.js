const db = require('../config/db');

exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User registered successfully" });
    });
};

exports.getUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};