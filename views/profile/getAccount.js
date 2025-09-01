const Account = require('../../models/Account');

const handleGetAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.userId).exec();
        if (!account) return res.sendStatus(403)

        res.send({
            id: account.id,
            username: account.username,
            email: account.email,
            profileImg: account.profileImg ? account.profileImg : null,
            bio: account.bio,
            followers: account.followers,
            following: account.following
        });

    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }
}


module.exports = {handleGetAccount};