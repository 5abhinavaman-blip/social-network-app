const db = require('../config/db');

exports.createPost = (req, res) => {
    const { caption } = req.body;
    const userId = req.user.userId;

    const sql = "INSERT INTO posts (user_id, caption) VALUES (?, ?)";

    db.query(sql, [userId, caption], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Post created successfully" });
    });
};

exports.getPosts = (req, res) => {
    const sql = `
        SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};