const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleCreateToken = require('../../utils/tokens');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt_refresh_token) return res.sendStatus(401);
    const refreshToken = cookies.jwt_refresh_token;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {

            if (err) {
                // Clear the expired refresh token
                res.clearCookie('jwt_refresh_token', { 
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true
                });

                return res.status(309).redirect('/login');
            }

            const account = await Account.findById(decoded.account.id).exec();
            if (!account) return res.sendStatus(403);

            const accessToken = handleCreateToken(
                account, 
                process.env.ACCESS_TOKEN_SECRET,
                '15m'
            );

            res.json({'access_token': accessToken});
        }
    )

}


module.exports = {
    handleRefreshToken
}