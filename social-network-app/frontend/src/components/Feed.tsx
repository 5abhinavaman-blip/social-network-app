import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import PostCard from './PostCard';

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data);
            } catch (err) {
                setError('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="feed">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;