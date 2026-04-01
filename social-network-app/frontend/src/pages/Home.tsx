import React from 'react';
import Feed from '../components/Feed';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Social Network</h1>
            <Feed />
        </div>
    );
};

export default Home;