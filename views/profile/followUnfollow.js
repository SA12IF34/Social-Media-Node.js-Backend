const Account = require('../../models/Account');

const handleFollowAndUnfollowProfile = async (req, res) => {
    const targetId = req.params.pk;
    const userId = req.userId;

    const targetAccount = await Account.findById(targetId).exec();
    const userAccount = await Account.findById(userId).exec();

    if (!targetAccount) return res.sendStatus(404);

    if (targetAccount.followers.includes(userId)) {
        targetAccount.followers = targetAccount.followers.filter(f => f !== userId);
        userAccount.following = userAccount.following.filter(f => f !== targetId);

    } else {
        targetAccount.followers = [...targetAccount.followers, userId];
        userAccount.following = [...userAccount.following, targetId];
    }

    await targetAccount.save();
    await userAccount.save();

    res.sendStatus(200);

}


module.exports = {handleFollowAndUnfollowProfile};