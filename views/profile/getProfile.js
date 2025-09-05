const Account = require('../../models/Account');
const jwt = require('jsonwebtoken');

const handleGetProfile = async (req, res) => {
    const accountId = req.params.pk;

    const account = await Account.findById(accountId).exec();
    
    let followed = false;
    if (req.cookies?.jwt_refresh_token) {
        var decoded = jwt.decode(req.cookies.jwt_refresh_token);
        followed = account.followers.includes(decoded.account.id);
    }

    return res.send({
        id: account.id,
        username: account.username,
        bio: account.bio,
        profileImg: account.profileImg ? account.profileImg : null,
        followers: account.followers,
        following: account.following,
        followed: followed
    })
}


module.exports = {handleGetProfile}