const db = require('../config/db');

const dbp = db.promise();

exports.createPost = async (req, res) => {
    const { caption, mediaUrl, tags = [], mentionedUserId, location } = req.body;
    const userId = req.user.userId;

    const conn = await dbp.getConnection();

    try {
        await conn.beginTransaction();

        const [postResult] = await conn.query('INSERT INTO posts (user_id, caption) VALUES (?, ?)', [userId, caption]);
        const postId = postResult.insertId;

        if (mediaUrl) {
            await conn.query('INSERT INTO post_media (post_id, media_url) VALUES (?, ?)', [postId, mediaUrl]);
        }

        if (location) {
            await conn.query('INSERT INTO post_locations (post_id, location) VALUES (?, ?)', [postId, location]);
        }

        if (mentionedUserId) {
            await conn.query('INSERT INTO post_mentions (post_id, mentioned_user_id) VALUES (?, ?)', [postId, mentionedUserId]);
        }

        for (const tag of tags) {
            const trimmed = String(tag).trim();
            if (!trimmed) {
                continue;
            }

            await conn.query('INSERT INTO post_tags (post_id, tag) VALUES (?, ?)', [postId, trimmed]);
            const [hashResult] = await conn.query('INSERT INTO hashtags (tag) VALUES (?)', [trimmed]);
            await conn.query('INSERT INTO hashtag_posts (hashtag_id, post_id) VALUES (?, ?)', [hashResult.insertId, postId]);
        }

        await conn.commit();
        res.json({ message: 'Post created successfully', postId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ message: 'Post creation failed', error: err.message });
    } finally {
        conn.release();
    }
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