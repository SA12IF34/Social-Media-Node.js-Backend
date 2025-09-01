const router = require('express').Router();

const {handleCreateComment} = require('../views/comments/createComment');
const {handleGetPostComments} = require('../views/comments/getComments');
const {handleUpdateComment} = require('../views/comments/updateComment');
const {handleDeleteComment} = require('../views/comments/deleteComment');

const handleVerifyJWT = require('../middleware/JWTVerify');


router.post('/create', handleVerifyJWT, handleCreateComment);
router.get('/post/:pk', handleGetPostComments);
router.route('/:pk')
    .patch(handleVerifyJWT, handleUpdateComment)
    .delete(handleVerifyJWT, handleDeleteComment);


module.exports = router;