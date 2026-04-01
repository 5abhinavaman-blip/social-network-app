const db = require('../config/db');

// CREATE POST
exports.createPost = (userId, caption, callback) => {
    const sql = `
        INSERT INTO posts (user_id, caption)
        VALUES (?, ?)
    `;
    db.query(sql, [userId, caption], callback);
};

// GET ALL POSTS
exports.getAllPosts = (callback) => {
    const sql = `
        SELECT posts.*, users.username
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC
    `;
    db.query(sql, callback);
};

// GET POSTS BY USER
exports.getPostsByUser = (userId, callback) => {
    const sql = `
        SELECT * FROM posts
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    db.query(sql, [userId], callback);
};

// DELETE POST
exports.deletePost = (postId, callback) => {
    const sql = `DELETE FROM posts WHERE post_id = ?`;
    db.query(sql, [postId], callback);
};