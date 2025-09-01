const Comment = require('../../models/Comment');

const handleGetPostComments = async (req, res) => {
    const comments = await Comment.find({post: req.params.pk}).sort('-createDate').exec();

    res.status(200).json(comments);
}

module.exports = {handleGetPostComments};