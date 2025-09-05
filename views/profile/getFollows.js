const Account = require('../../models/Account');

const handleGetFollowers = async (req, res) => {
    const account = await Account.findById(req.params.pk).exec();
    if (!account) return res.sendStatus(204);

    const followers = await Account.find({_id: {"$in": account.followers}}).exec();

    res.json(followers);
}

const handleGetFollowings = async (req, res) => {
    const account = await Account.findById(req.params.pk).exec();
    if (!account) return res.sendStatus(204);

    const following = await Account.find({_id: {"$in": account.following}}).exec();

    res.json(following);
}

module.exports = {
    handleGetFollowers,
    handleGetFollowings
}