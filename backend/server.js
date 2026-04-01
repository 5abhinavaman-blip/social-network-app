require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");

});