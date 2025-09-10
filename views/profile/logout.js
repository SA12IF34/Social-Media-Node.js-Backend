

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    console.log('hello')
    console.log(cookies)
    console.log(req.cookies)
    if (cookies?.jwt_refresh_token) {
        res.clearCookie('jwt_refresh_token', {httpOnly: true, secure: true, sameSite: 'Lax', domain: '.saifchan.site'});
    };


    return res.sendStatus(204);
}

module.exports = {
    handleLogout
}