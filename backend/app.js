import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import modelBlog from './Models/blogModel.js';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3030;

mongoose.connect(process.env.url)
    .then(() => {
        console.log("Connected to database ");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// API Route to get all blogs
app.get('/api/blog/all', async (req, res) => {
    try {
        const blogs = await modelBlog.find();
        res.json(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Server error');
    }
});

// add a new post
app.post('/api/blog/add', async (req, res) => {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
        return res.status(400).json({ message: 'Author, title, and content are required' });
    }

    try {
        const newBlog = new modelBlog({ author, title, content });
        await newBlog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetching single post
app.get('/api/blog/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await modelBlog.findById(id);
        if (!blog) return res.status(404).send('Blog not found');
        res.json(blog);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// update a post
app.put('/api/blog/update/:id', async (req, res) => {
    const { id } = req.params;
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
        return res.status(400).json({ message: 'Author, title, and content are required' });
    }

    try {
        const updatedBlog = await modelBlog.findByIdAndUpdate(
            id,
            { author, title, content },
            { new: true }
        );
        if (!updatedBlog) return res.status(404).send('Blog not found');
        res.json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send('Server error');
    }
});

// DELETE route to delete a blog post
app.delete('/api/blog/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await modelBlog.findByIdAndDelete(id);
        if (!deletedBlog) return res.status(404).send('Blog not found');
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).send('Server error');
    }
});

