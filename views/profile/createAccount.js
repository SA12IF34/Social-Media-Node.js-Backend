const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const path = require('path');
const multer = require('multer');
const handleCreateToken = require('../../utils/tokens');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../media/profiles'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(32).toString('hex') + '-' + file.originalname;
    cb(null, uniqueSuffix)
  }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Not an image! Please upload an image.';
        cb(null, false);
    }
};

const profileUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

// Modify the middleware chain to handle file validation errors
const handleFileValidation = (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    next();
};

const handleCreateAccount = async (req, res, next) => {
    const {username, email, password} = req.body;
    const profileImg = req.file;
    if (!username || !password || !email) return res.status(400).json({'Error': 'You must include username, email and password'});

    let duplicate = await Account.findOne({email: email}).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        
        const account = new Account({
            username,
            email,
            password:passwordHash
        });
        await account.save();
        if (profileImg) {
            req.userId = account.id;
            account.profileImg = '/media/profiles/' + req.file.filename
            await account.save();
            return next();
        }
        
        const accessToken = handleCreateToken(
            account, 
            process.env.ACCESS_TOKEN_SECRET,
            '15m'
        )

        const refreshToken = handleCreateToken(
            account, 
            process.env.REFRESH_TOKEN_SECRET,
            '15m'
        )

        res.cookie('jwt_refresh_token', refreshToken, {httpOnly: true, secure: true, maxAge: 30*24*60*60*1000, sameSite: 'Lax', domain: '.saifchan.site'})

        return res.status(200).send({'access_token': accessToken});

    } catch (error) {
        console.log(error);
        return res.status(500).json({"Error": "Error occured signing you up in our side."})
    }

}


module.exports = {
    handleCreateAccount,
    profileUpload,
    handleFileValidation
};