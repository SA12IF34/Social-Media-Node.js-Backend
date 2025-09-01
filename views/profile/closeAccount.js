const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');

const handleCloseAccount = async (req, res) => {    
    res.clearCookie('jwt_refresh_token', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })

    await Account.findByIdAndDelete(req.userId).exec();

    return res.sendStatus(204);
}


module.exports = {
    handleCloseAccount
}