const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema({
    imageText: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },                                  
    likes: {
        type: Number,
        default: 0
    }
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
