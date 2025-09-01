const Post = require('../../models/Post');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const handleCreatePost = async (req, res, next) => {
    const {content} = req.body;
    const mediaFile = req.file;

    const data = {};

    if (content || mediaFile) {
        content ? data['content'] = content : '';

        data['author'] = req.userId;

        const post = await Post.create(data);

        if (mediaFile) {
            post.mediaFile = `/media/posts/${post.id}-${mediaFile.filename}`;
            await post.save();
            req.postId = post.id;

            next()
        }

        res.status(201).json({
            id: post.id,
            content: post.content,
            mediaFile: post.mediaFile ? post.mediaFile : null,
            author: post.author
        });
    } else {
        res.status(400).json({
            "Error": "Invalid post content."
        });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../media/posts');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = req.postId + '-' + file.originalname;

        cb(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed! Please upload only images or videos.'), false);
    }
};

const postUpload = multer({
    storage,
    fileFilter
})

module.exports = {
    handleCreatePost,
    postUpload
}