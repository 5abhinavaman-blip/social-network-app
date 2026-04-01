const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbp = db.promise();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult] = await dbp.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const userId = userResult.insertId;

        await dbp.query(
            'INSERT INTO profiles (user_id, bio, profile_pic) VALUES (?, ?, ?)',
            [userId, 'New user', 'https://picsum.photos/80']
        );

        await dbp.query(
            'INSERT INTO user_settings (user_id, theme, notifications) VALUES (?, ?, ?)',
            [userId, 'dark', true]
        );

        await dbp.query(
            'INSERT INTO user_privacy (user_id, is_private) VALUES (?, ?)',
            [userId, false]
        );

        await dbp.query(
            'INSERT INTO notification_settings (user_id, likes, comments) VALUES (?, ?, ?)',
            [userId, true, true]
        );

        res.json({ message: 'User registered successfully', userId });

    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await dbp.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await dbp.query('INSERT INTO user_sessions (user_id, token) VALUES (?, ?)', [user.user_id, token]);

        res.json({ token, userId: user.user_id, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};