import React from 'react';

interface PostCardProps {
    username: string;
    content: string;
    timestamp: string;
}

const PostCard: React.FC<PostCardProps> = ({ username, content, timestamp }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <h3>{username}</h3>
                <span>{new Date(timestamp).toLocaleString()}</span>
            </div>
            <p>{content}</p>
        </div>
    );
};

export default PostCard;