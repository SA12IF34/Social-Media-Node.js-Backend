const Post = require('../../models/Post');

const handleGetAccountPosts = async (req, res) => {
    const posts = await Post.find({author: req.params.author}).sort('-createDate').exec();
    posts.length > 0 ? res.status(200).json(posts): res.sendStatus(204);
}


module.exports = {handleGetAccountPosts};