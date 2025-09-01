const Comment = require('../../models/Comment');


const handleUpdateComment = async (req, res) => {
    const comment = await Comment.findById(req.params.pk).exec();
    if (!comment) return res.sendStatus(404);

    if (comment.author !== req.userId) return res.sendStatus(403);

    const {content} = req.body;
    if (!content) return res.sendStatus(400);

    comment.content = content;
    const updatedComment = await comment.save();

    res.status(202).json(updatedComment);
}

module.exports = {handleUpdateComment};