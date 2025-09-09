const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleCreateToken = require('../../utils/tokens');

const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({'Error': 'Please enter both email and password to login.'});

    const account = await Account.findOne({email: email}).exec();
    if (!account) return res.status(404).json({"Error": "Account does not exist"});

    const isPasswordCorrect = await bcrypt.compare(password, account.password);


    if (isPasswordCorrect) {
        const accessToken = handleCreateToken(
            account, 
            process.env.ACCESS_TOKEN_SECRET,
            '15m'
        );

        const refreshToken = handleCreateToken(
            account,
            process.env.REFRESH_TOKEN_SECRET,
            '30d'
        );

        res.cookie('jwt_refresh_token', refreshToken, {httpOnly: true, secure: true, maxAge: 30*24*60*60*1000, sameSite: 'None'});

        return res.status(200).json({'access_token': accessToken});
    }

    return res.status(400).json({"Error": "Password is incorrect."});

}

module.exports = {
    handleLogin
};