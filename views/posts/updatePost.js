const Post = require('../../models/Post');
const Account = require('../../models/Account');

const handleUpdatePost = async (req, res, next) => {
    const post = await Post.findById(req.params.pk).exec();

    if (post.author !== req.userId) return res.sendStatus(403);

    if (Object.keys(req.body).length > 0) {
        const {content} = req.body;
        const file = req.file;

        if (!content && !file) res.status(400).json({"Error": "Invalid update data."})
        
        post.content = content;
        if (file) {
            post.mediaFile = '/media/posts/' + post.id + '-' + file.filename;
            await post.save();

            next()
        }
        await post.save();

        return res.status(202).json({
            id: post.id,
            content: post.content ? post.content : null,
            mediaFile: post.mediaFile ? post.mediaFile : null,
            likes: post.likes,
            dislikes: post.dislikes
        })
    }

    res.status(400).json({
        "Error": "Invalid update data."
    })

    
}


const handleLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.pk);
        const user = await Account.findById(req.userId);
        let liked = true;
        if (user.likes.includes(post.id)) {
            user.likes = user.likes.filter(like => like !== post.id);
            post.likes -= 1;

            await user.save();
            await post.save();
            
            liked = false;
        } else {
            user.likes = [...user.likes, post.id];
            post.likes +=1;

            await user.save();
            await post.save();

            liked = true
        }

        res.status(202).json({'like': liked});
    } catch (error) {
        console.error(error);
        res.status(500).json({"Error": error.message});
    }
}

const handleDislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.pk);
        const user = await Account.findById(req.userId);

        let disliked = true;

        if (user.dislikes.includes(post.id)) {
            user.dislikes = user.dislikes.filter(like => like !== post.id);
            post.dislikes -= 1;

            await user.save();
            await post.save();

            disliked = false;
        } else {
            user.dislikes = [...user.dislikes, post.id];
            post.dislikes +=1;

            await user.save();
            await post.save();

            disliked = true;
        }

        res.status(202).json({'dislike': disliked});

    } catch (error) {
        console.error(error);
        res.status(500).json({"Error": error.message});
    }
}


module.exports = {
    handleUpdatePost,
    handleLikePost,
    handleDislikePost
}