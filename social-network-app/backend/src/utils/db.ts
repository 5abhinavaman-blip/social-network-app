import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'your_default_mongodb_uri';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

export const connectDB = async () => {
    if (db) return db;
    try {
        await client.connect();
        db = client.db('social_network');
        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export const closeDB = async () => {
    await client.close();
    console.log('Database connection closed');
};