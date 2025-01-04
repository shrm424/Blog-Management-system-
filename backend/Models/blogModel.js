import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
},
    {
        timestamps: true
    });

const modelBlog = mongoose.model("posts", blogPostSchema);

export default modelBlog;
