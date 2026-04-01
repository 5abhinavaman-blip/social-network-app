import React, { useEffect, useState } from 'react';
import { getUserProfile, getUserPosts } from '../services/api';
import './Profile.css';

const Profile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userProfile = await getUserProfile(userId);
            const userPosts = await getUserPosts(userId);
            setUser(userProfile);
            setPosts(userPosts);
        };

        fetchData();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <h1>{user.name}'s Profile</h1>
            <p>{user.bio}</p>
            <h2>Posts</h2>
            <div className="posts">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;