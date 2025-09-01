const path = require('path');
const router = require('express').Router();
const {handleCreateAccount, profileUpload, handleFileValidation} = require('../views/profile/createAccount');
const {handleLogin} = require('../views/profile/login');
const {handleUpdateProfileImage} = require('../views/profile/profileImg')
const {handleLogout} = require('../views/profile/logout');
const {handleCloseAccount} = require('../views/profile/closeAccount');
const {handleGetAccount} = require('../views/profile/getAccount');
const {handleGetProfile} = require('../views/profile/getProfile')
const {handleRefreshToken} = require('../views/profile/refreshToken');
const {handleFollowAndUnfollowProfile} = require('../views/profile/followUnfollow');

// Import Middleware
const handleVerifyJWT = require('../middleware/JWTVerify');


router.post('/signup', handleCreateAccount, profileUpload.single('profile_img'));
router.post('/login', handleLogin);
router.patch('/profile-img', handleVerifyJWT, profileUpload.single('profile_img'), handleFileValidation, handleUpdateProfileImage);
router.post('/refresh-token', handleRefreshToken);
router.post('/logout', handleVerifyJWT, handleLogout);
router.delete('/close-account', handleVerifyJWT, handleCloseAccount);

router.get('/account', handleVerifyJWT, handleGetAccount);
router.get('/profile/:pk/', handleGetProfile);
router.patch('/profile/:pk/follow/', handleVerifyJWT, handleFollowAndUnfollowProfile);

module.exports = router;