const Comment = require('../../models/Comment');


const handleDeleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.pk).exec();
    if (!comment) return res.sendStatus(404);

    if (comment.author !== req.userId) return res.sendStatus(403);

    await comment.deleteOne()

    res.sendStatus(204);
}

module.exports = {handleDeleteComment};