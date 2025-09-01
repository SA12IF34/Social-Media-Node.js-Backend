const jwt = require('jsonwebtoken');

const handleVerifyJWT = async (req, res, next) => {
    const refreshToken = req.cookies?.jwt_refresh_token;
    if(!refreshToken) return res.sendStatus(401);

    const creds = req.headers.authorization;

    if (creds && creds.split(' ')[0] === 'Bearer') {

        const accessToken = creds.split(' ')[1];

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);

                req.userId = decoded.account.id;

                next()
            }
        )

    } else {
        return res.sendStatus(403);
    }

    
}

module.exports = handleVerifyJWT;