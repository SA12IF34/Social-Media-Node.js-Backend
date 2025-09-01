const Post = require('../../models/Post');


const handleDeletePost = async (req, res) => {
    const post = await Post.findById(req.params.pk).exec();

    if (post.author === req.userId) {
        await post.deleteOne();
        res.sendStatus(204);
        
    } else {
        res.sendStatus(403);
    }

    
}


module.exports = {handleDeletePost};