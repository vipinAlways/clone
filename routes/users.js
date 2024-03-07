const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/printerest")
const plm = require("passport-local-mongoose")
// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    dp: {
        type: String, // Assuming dp is a URL to the user's profile picture
        default: 'default.jpg' // Default profile picture
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post model
    }]
});

userSchema.plugin(plm)
// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
