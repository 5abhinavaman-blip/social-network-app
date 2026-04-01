CREATE DATABASE social_app;
USE social_app;

-- ================= USERS =================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bio TEXT,
    profile_pic VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE user_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    theme VARCHAR(20),
    notifications BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE user_privacy (
    privacy_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    is_private BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ================= SOCIAL =================
CREATE TABLE followers (
    follower_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    follower_user_id INT
);

CREATE TABLE blocked_users (
    block_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blocked_user_id INT
);

CREATE TABLE close_friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    friend_id INT
);

-- ================= POSTS =================
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE post_media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    media_url VARCHAR(255)
);

CREATE TABLE post_tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    tag VARCHAR(50)
);

CREATE TABLE post_mentions (
    mention_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    mentioned_user_id INT
);

CREATE TABLE post_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    location VARCHAR(255)
);

-- ================= INTERACTIONS =================
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    comment_id INT
);

CREATE TABLE shares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT
);

CREATE TABLE saves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_id INT
);

-- ================= MESSAGING =================
CREATE TABLE chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    user_id INT
);

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    sender_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE message_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT,
    status VARCHAR(20)
);

CREATE TABLE message_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT,
    media_url VARCHAR(255)
);

-- ================= NOTIFICATIONS =================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE notification_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    likes BOOLEAN,
    comments BOOLEAN
);

-- ================= STORIES =================
CREATE TABLE stories (
    story_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    media_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT,
    viewer_id INT
);

CREATE TABLE story_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT,
    user_id INT,
    reaction VARCHAR(20)
);

-- ================= REELS =================
CREATE TABLE reels (
    reel_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    video_url VARCHAR(255)
);

CREATE TABLE reel_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reel_id INT,
    user_id INT
);

CREATE TABLE reel_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reel_id INT,
    user_id INT,
    comment TEXT
);

-- ================= HASHTAGS =================
CREATE TABLE hashtags (
    hashtag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(50)
);

CREATE TABLE hashtag_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hashtag_id INT,
    post_id INT
);

-- ================= REPORTS =================
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reported_id INT,
    reason TEXT
);

CREATE TABLE report_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50)
);

CREATE TABLE bans (
    ban_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reason TEXT
);

-- ================= ADS =================
CREATE TABLE ads (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT
);

CREATE TABLE ad_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT,
    user_id INT
);

-- ================= ANALYTICS =================
CREATE TABLE post_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT
);

CREATE TABLE profile_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_user_id INT,
    viewer_id INT
);