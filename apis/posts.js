const router = require('express').Router();

const {handleCreatePost, postUpload} = require('../views/posts/createPost');
const {handleGetPost, verifyPostAuthor} = require('../views/posts/getPost');
const {handleUpdatePost, handleLikePost, handleDislikePost} = require('../views/posts/updatePost');
const {handleDeletePost} = require('../views/posts/deletePost');
const {handleGetAccountPosts} = require('../views/posts/accountPosts')
const {handleGetLatestPosts} = require('../views/posts/latestPosts');
const {handleGetFollowingPosts} = require('../views/posts/followingPosts');

const handleVerifyJWT = require("../middleware/JWTVerify");

router.get('/', handleGetLatestPosts);
router.get('/following',handleVerifyJWT, handleGetFollowingPosts);
router.get('/user/:author', handleGetAccountPosts);


router.post('/create', handleVerifyJWT, handleCreatePost, postUpload.single('media_file'));
router.route('/:pk')
    .get(handleGetPost, verifyPostAuthor)
    .patch(handleVerifyJWT, handleUpdatePost, postUpload.single('media_file'))
    .delete(handleVerifyJWT, handleDeletePost);

router.patch('/:pk/like', handleVerifyJWT, handleLikePost);
router.patch('/:pk/dislike', handleVerifyJWT, handleDislikePost);

module.exports = router;