const Post = require('../../models/Post');
const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');


const handleGetPost = async (req, res, next) => {
    const postId = req.params.pk;

    const post = await Post.findById(postId).exec();
    if (!post) return res.sendStatus(404);

    const author = await Account.findById(post.author).exec();

    req.postBody = {
        id: post.id,
        content: post.content ? post.content : null,
        mediaFile: post.mediaFile ? post.mediaFile : null,
        likes: post.likes,
        dislikes: post.dislikes,
        createDate: post.createDate,
        author: {
            id: author.id,
            username: author.username,
            profileImg: author.profileImg ? author.profileImg : null
        }
    };

    next()

}

const verifyPostAuthor = async (req, res) => {

    const postBody = req.postBody;
    postBody['isPostAuthor'] = false;

    const authorization = req.headers.authorization;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        const accessToken = authorization.split(' ')[1];

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return;
                }

                const userId = decoded.account.id;
                if (userId === postBody.author.id) {
                    postBody['isPostAuthor'] = true;
                }
            }
        )
    } 


    res.status(200).json(postBody);
}


module.exports = {
    handleGetPost,
    verifyPostAuthor
}