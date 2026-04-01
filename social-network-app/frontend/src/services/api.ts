import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, postData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};