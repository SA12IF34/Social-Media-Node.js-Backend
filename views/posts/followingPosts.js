const Post = require('../../models/Post');
const Account = require("../../models/Account");

const handleGetFollowingPosts = async (req, res) => {
    const account = await Account.findById(req.userId).exec();
    const posts = await Post.find({author: {'$in': account.following}}).sort('-createDate').exec();

    res.status(200).json(posts);
}


module.exports = {handleGetFollowingPosts};