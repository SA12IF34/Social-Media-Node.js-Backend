const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: true,
        validate: [
            validator.isEmail,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least 8 characters long'],
        maxLength: [100, 'Password cannot exceed 100 characters']
    },
    bio: {
        type: String,
        maxLength: [500, 'Bio cannot exceed 500 characters']
    },
    profileImg: String,
    following: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    }, 
    dislikes: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('Accout', accountSchema);