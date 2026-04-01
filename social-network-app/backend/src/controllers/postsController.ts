import { Request, Response } from 'express';
import Post from '../models/Post';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, userId } = req.body;
        const newPost = new Post({ title, content, user: userId });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving post', error });
    }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};