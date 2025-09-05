const Post = require('../../models/Post');

const handleGetLatestPosts = async (req, res) => {
    const posts = await Post.find({}, null, {limit: 30}).sort('-createDate').exec();
    
    res.status(200).json(posts);
}


module.exports = {handleGetLatestPosts}