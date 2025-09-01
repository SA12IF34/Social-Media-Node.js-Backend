const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    content: String,
    mediaFile: String,
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: {
        type: [Number],
        default: []
    },
    author: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});
 
module.exports = mongoose.model('Post', postSchema);