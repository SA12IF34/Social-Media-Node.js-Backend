const Account = require('../../models/Account');


const handleGetProfile = async (req, res) => {
    const accountId = req.params.pk;

    const account = await Account.findById(accountId).exec();
    console.log(account)
    
    return res.send({
        id: account.id,
        username: account.username,
        bio: account.bio,
        profileImg: account.profileImg ? account.profileImg : null,
        followers: account.followers,
        following: account.following
    })
}


module.exports = {handleGetProfile}