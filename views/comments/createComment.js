const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const Account = require('../../models/Account');


const handleCreateComment = async (req, res) => {
    const {content, postId} = req.body;
    if (!content || !postId) return res.sendStatus(400);

    const post = await Post.findById(postId).exec();
    if (!post) return res.sendStatus(400);

    await Comment.create({
        content,
        post: postId,
        author: req.userId
    });

    res.status(201).json(await Comment.find({}).exec());
}

module.exports = {handleCreateComment};