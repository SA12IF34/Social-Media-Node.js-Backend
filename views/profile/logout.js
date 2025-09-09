

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    console.log('hello')
    console.log(cookies)
    console.log(req.cookies)
    if (cookies?.jwt_refresh_token) {
        res.clearCookie('jwt_refresh_token', {httpOnly: true, secure: true, maxAge: 30*24*60*60*1000, domain: 'social-media-nodejs.vercel.app', path: '/'});
    };


    return res.sendStatus(204);
}

module.exports = {
    handleLogout
}