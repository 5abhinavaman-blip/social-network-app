const db = require('../config/db');

const dbp = db.promise();

const tableNames = [
    'users',
    'profiles',
    'user_settings',
    'user_privacy',
    'user_sessions',
    'followers',
    'blocked_users',
    'close_friends',
    'posts',
    'post_media',
    'post_tags',
    'post_mentions',
    'post_locations',
    'likes',
    'comments',
    'comment_likes',
    'shares',
    'saves',
    'chats',
    'chat_members',
    'messages',
    'message_status',
    'message_media',
    'notifications',
    'notification_settings',
    'stories',
    'story_views',
    'story_reactions',
    'reels',
    'reel_likes',
    'reel_comments',
    'hashtags',
    'hashtag_posts',
    'reports',
    'report_types',
    'bans',
    'ads',
    'ad_clicks',
    'post_views',
    'profile_views'
];

const getOverview = async (req, res) => {
    try {
        const countEntries = await Promise.all(
            tableNames.map(async (table) => {
                const [rows] = await dbp.query(`SELECT COUNT(*) AS total FROM ${table}`);
                return [table, rows[0].total];
            })
        );

        const counts = Object.fromEntries(countEntries);

        const [latestPosts] = await dbp.query(
            `SELECT p.post_id, p.caption, p.created_at, u.username
             FROM posts p
             LEFT JOIN users u ON u.user_id = p.user_id
             ORDER BY p.created_at DESC
             LIMIT 5`
        );

        const [latestStories] = await dbp.query(
            `SELECT s.story_id, s.media_url, s.created_at, u.username
             FROM stories s
             LEFT JOIN users u ON u.user_id = s.user_id
             ORDER BY s.created_at DESC
             LIMIT 5`
        );

        const [latestReels] = await dbp.query(
            `SELECT r.reel_id, r.video_url, u.username
             FROM reels r
             LEFT JOIN users u ON u.user_id = r.user_id
             ORDER BY r.reel_id DESC
             LIMIT 5`
        );

        res.json({
            counts,
            latestPosts,
            latestStories,
            latestReels
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch social overview', error: error.message });
    }
};

const getOrCreatePeerUser = async (actorId) => {
    const [existing] = await dbp.query('SELECT user_id FROM users WHERE user_id != ? LIMIT 1', [actorId]);
    if (existing.length) {
        return existing[0].user_id;
    }

    const unique = Date.now();
    const username = `peer_${unique}`;
    const email = `peer_${unique}@demo.local`;
    const password = 'demo_peer_password';

    const [inserted] = await dbp.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );

    return inserted.insertId;
};

const runFullSimulation = async (req, res) => {
    const actorId = req.user?.userId;

    if (!actorId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const conn = await dbp.getConnection();

    try {
        await conn.beginTransaction();

        const peerId = await getOrCreatePeerUser(actorId);
        const nowToken = `sim-${actorId}-${Date.now()}`;

        await conn.query('INSERT INTO profiles (user_id, bio, profile_pic) VALUES (?, ?, ?)', [actorId, 'Builder profile', 'https://picsum.photos/80']);
        await conn.query('INSERT INTO profiles (user_id, bio, profile_pic) VALUES (?, ?, ?)', [peerId, 'Peer profile', 'https://picsum.photos/81']);
        await conn.query('INSERT INTO user_settings (user_id, theme, notifications) VALUES (?, ?, ?)', [actorId, 'dark', true]);
        await conn.query('INSERT INTO user_privacy (user_id, is_private) VALUES (?, ?)', [actorId, false]);
        await conn.query('INSERT INTO user_sessions (user_id, token) VALUES (?, ?)', [actorId, nowToken]);
        await conn.query('INSERT INTO notification_settings (user_id, likes, comments) VALUES (?, ?, ?)', [actorId, true, true]);

        await conn.query('INSERT INTO followers (user_id, follower_user_id) VALUES (?, ?)', [actorId, peerId]);
        await conn.query('INSERT INTO blocked_users (user_id, blocked_user_id) VALUES (?, ?)', [peerId, actorId]);
        await conn.query('INSERT INTO close_friends (user_id, friend_id) VALUES (?, ?)', [actorId, peerId]);

        const [postResult] = await conn.query('INSERT INTO posts (user_id, caption) VALUES (?, ?)', [actorId, 'Simulation post for full schema coverage']);
        const postId = postResult.insertId;

        await conn.query('INSERT INTO post_media (post_id, media_url) VALUES (?, ?)', [postId, 'https://picsum.photos/300/180']);
        await conn.query('INSERT INTO post_tags (post_id, tag) VALUES (?, ?)', [postId, 'advanced-ui']);
        await conn.query('INSERT INTO post_mentions (post_id, mentioned_user_id) VALUES (?, ?)', [postId, peerId]);
        await conn.query('INSERT INTO post_locations (post_id, location) VALUES (?, ?)', [postId, 'Remote Workspace']);

        const [hashResult] = await conn.query('INSERT INTO hashtags (tag) VALUES (?)', ['advanced-ui']);
        const hashtagId = hashResult.insertId;
        await conn.query('INSERT INTO hashtag_posts (hashtag_id, post_id) VALUES (?, ?)', [hashtagId, postId]);

        await conn.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [peerId, postId]);
        const [commentResult] = await conn.query('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [postId, peerId, 'Great upgrade!']);
        const commentId = commentResult.insertId;
        await conn.query('INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)', [actorId, commentId]);
        await conn.query('INSERT INTO shares (user_id, post_id) VALUES (?, ?)', [peerId, postId]);
        await conn.query('INSERT INTO saves (user_id, post_id) VALUES (?, ?)', [peerId, postId]);

        const [chatResult] = await conn.query('INSERT INTO chats () VALUES ()');
        const chatId = chatResult.insertId;
        await conn.query('INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?), (?, ?)', [chatId, actorId, chatId, peerId]);
        const [messageResult] = await conn.query('INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)', [chatId, actorId, 'Hello from simulation']);
        const messageId = messageResult.insertId;
        await conn.query('INSERT INTO message_status (message_id, status) VALUES (?, ?)', [messageId, 'sent']);
        await conn.query('INSERT INTO message_media (message_id, media_url) VALUES (?, ?)', [messageId, 'https://picsum.photos/200']);

        await conn.query('INSERT INTO notifications (user_id, content, is_read) VALUES (?, ?, ?)', [peerId, 'You have a new message', false]);

        const [storyResult] = await conn.query('INSERT INTO stories (user_id, media_url) VALUES (?, ?)', [actorId, 'https://picsum.photos/260']);
        const storyId = storyResult.insertId;
        await conn.query('INSERT INTO story_views (story_id, viewer_id) VALUES (?, ?)', [storyId, peerId]);
        await conn.query('INSERT INTO story_reactions (story_id, user_id, reaction) VALUES (?, ?, ?)', [storyId, peerId, '🔥']);

        const [reelResult] = await conn.query('INSERT INTO reels (user_id, video_url) VALUES (?, ?)', [actorId, 'https://example.com/demo-reel.mp4']);
        const reelId = reelResult.insertId;
        await conn.query('INSERT INTO reel_likes (reel_id, user_id) VALUES (?, ?)', [reelId, peerId]);
        await conn.query('INSERT INTO reel_comments (reel_id, user_id, comment) VALUES (?, ?, ?)', [reelId, peerId, 'Cool reel!']);

        const [typeResult] = await conn.query('INSERT INTO report_types (type) VALUES (?)', ['abuse']);
        const reportTypeId = typeResult.insertId;
        await conn.query('INSERT INTO reports (user_id, reported_id, reason) VALUES (?, ?, ?)', [actorId, peerId, `Reason type ${reportTypeId}`]);
        await conn.query('INSERT INTO bans (user_id, reason) VALUES (?, ?)', [peerId, 'Temporary moderation']);

        const [adResult] = await conn.query('INSERT INTO ads (user_id, content) VALUES (?, ?)', [actorId, 'Try our premium creator tools']);
        const adId = adResult.insertId;
        await conn.query('INSERT INTO ad_clicks (ad_id, user_id) VALUES (?, ?)', [adId, peerId]);

        await conn.query('INSERT INTO post_views (post_id, user_id) VALUES (?, ?)', [postId, peerId]);
        await conn.query('INSERT INTO profile_views (profile_user_id, viewer_id) VALUES (?, ?)', [actorId, peerId]);

        await conn.commit();

        res.json({
            message: 'Simulation completed. All schema tables were used.',
            ids: {
                actorId,
                peerId,
                postId,
                chatId,
                messageId,
                storyId,
                reelId,
                adId,
                reportTypeId
            }
        });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Simulation failed', error: error.message });
    } finally {
        conn.release();
    }
};

module.exports = {
    getOverview,
    runFullSimulation
};
