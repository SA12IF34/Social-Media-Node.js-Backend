

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (cookies?.jwt_refresh_token) {
        res.clearCookie('jwt_refresh_token', { 
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
    };

    return res.sendStatus(204);
}

module.exports = {
    handleLogout
}